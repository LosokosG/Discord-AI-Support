import type { SupabaseClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import type { KnowledgeDocument, DocumentList } from "../../types";
import type { Tables } from "../../db/database.types";

class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}

// Type for knowledge document database row
type DocumentRow = Tables<"knowledge_documents">;
// Minimal type for document list results
type DocumentListItem = Pick<DocumentRow, "id" | "title" | "file_type" | "created_at" | "updated_at">;

/**
 * Maps database rows to KnowledgeDocument DTOs
 */
function mapToKnowledgeDocument(document: DocumentListItem): KnowledgeDocument {
  return {
    id: document.id,
    title: document.title,
    fileType: document.file_type,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  };
}

/**
 * Maps database rows to KnowledgeDocument DTOs including content
 */
function mapToKnowledgeDocumentWithContent(
  document: DocumentRow & { downloadUrl?: string }
): KnowledgeDocument & { content: string; downloadUrl?: string } {
  return {
    ...mapToKnowledgeDocument(document),
    content: document.content,
    downloadUrl: document.downloadUrl,
  };
}

/**
 * Checks if a string is a valid UUID
 */
function isValidUUID(uuid: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(uuid);
}

export async function listDocuments(
  {
    serverId,
    page = 1,
    pageSize = 20,
    q,
    fileType,
  }: {
    serverId: string;
    page: number;
    pageSize: number;
    q?: string;
    fileType?: string;
  },
  supabaseClient: SupabaseClient
) {
  if (!serverId) {
    throw new Error("Server ID is required");
  }

  if (pageSize > 100) {
    pageSize = 100; // Enforce maximum page size
  }

  let query = supabaseClient
    .from("knowledge_documents")
    .select("id, title, file_type, created_at, updated_at", { count: "exact" })
    .eq("server_id", serverId)
    .range((page - 1) * pageSize, page * pageSize - 1);

  if (q) {
    query = query.textSearch("content_vector", q);
  }

  if (fileType) {
    query = query.eq("file_type", fileType);
  }

  const { data, count, error } = await query;

  if (error) throw error;

  return {
    data: data ? data.map(mapToKnowledgeDocument) : [],
    page,
    pageSize,
    total: count || 0,
  } as DocumentList;
}

export async function getDocumentById(serverId: string, docId: string, supabaseClient: SupabaseClient) {
  if (!serverId || !docId) {
    throw new Error("Server ID and Document ID are required");
  }

  const { data, error } = await supabaseClient
    .from("knowledge_documents")
    .select("*")
    .eq("server_id", serverId)
    .eq("id", docId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new NotFoundError("Document not found");
    throw error;
  }

  // For PDF, include URL for download
  const documentWithContent = { ...data };
  if (data.storage_path) {
    const { data: signedURL } = await supabaseClient.storage.from("documents").createSignedUrl(data.storage_path, 3600); // 1 hour

    documentWithContent.downloadUrl = signedURL;
  }

  return mapToKnowledgeDocumentWithContent(documentWithContent);
}

export async function createDocument(
  serverId: string,
  data: {
    title: string;
    content?: string;
    fileType: string;
    file?: File;
  },
  createdBy: string,
  supabaseClient: SupabaseClient
) {
  if (!serverId) {
    throw new Error("Server ID is required");
  }

  // For PDF file uploads - handle storage
  let storagePath = null;
  if (data.fileType === "pdf" && data.file) {
    const filePath = `documents/${serverId}/${uuidv4()}.pdf`;
    const { error: uploadError } = await supabaseClient.storage.from("documents").upload(filePath, data.file);

    if (uploadError) throw uploadError;
    storagePath = filePath;
  }

  // Check if createdBy is a valid UUID, if not (like for mock test users), generate one
  const userIdForDb = isValidUUID(createdBy) ? createdBy : uuidv4();

  const { data: document, error } = await supabaseClient
    .from("knowledge_documents")
    .insert({
      server_id: serverId,
      title: data.title,
      content: data.content,
      file_type: data.fileType,
      storage_path: storagePath,
      created_by: userIdForDb,
    })
    .select()
    .single();

  if (error) throw error;

  return mapToKnowledgeDocument(document);
}

export async function updateDocument(
  serverId: string,
  docId: string,
  data: {
    title?: string;
    content?: string;
  },
  supabaseClient: SupabaseClient
) {
  if (!serverId || !docId) {
    throw new Error("Server ID and Document ID are required");
  }

  const updateData: Partial<Pick<DocumentRow, "title" | "content">> = {};
  if (data.title !== undefined) updateData.title = data.title;
  if (data.content !== undefined) updateData.content = data.content;

  const { data: document, error } = await supabaseClient
    .from("knowledge_documents")
    .update(updateData)
    .eq("server_id", serverId)
    .eq("id", docId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new NotFoundError("Document not found");
    throw error;
  }

  return mapToKnowledgeDocument(document);
}

export async function deleteDocument(serverId: string, docId: string, supabaseClient: SupabaseClient) {
  if (!serverId || !docId) {
    throw new Error("Server ID and Document ID are required");
  }

  // Get document info first
  const { data: document, error: fetchError } = await supabaseClient
    .from("knowledge_documents")
    .select("storage_path")
    .eq("server_id", serverId)
    .eq("id", docId)
    .single();

  if (fetchError) {
    if (fetchError.code === "PGRST116") throw new NotFoundError("Document not found");
    throw fetchError;
  }

  // Remove file from storage if exists
  if (document.storage_path) {
    await supabaseClient.storage.from("documents").remove([document.storage_path]);
  }

  // Delete record
  const { error } = await supabaseClient.from("knowledge_documents").delete().eq("server_id", serverId).eq("id", docId);

  if (error) throw error;
}

export async function reindexDocument(serverId: string, docId: string, supabaseClient: SupabaseClient) {
  if (!serverId || !docId) {
    throw new Error("Server ID and Document ID are required");
  }

  // Check if document exists
  const { error } = await supabaseClient
    .from("knowledge_documents")
    .select("id")
    .eq("server_id", serverId)
    .eq("id", docId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new NotFoundError("Document not found");
    throw error;
  }

  // Call NOTIFY function in PostgreSQL to trigger reindexing
  await supabaseClient.rpc("notify_document_reindex", {
    doc_id: docId,
    server_id: serverId,
  });

  return { id: docId, status: "reindexing" };
}
