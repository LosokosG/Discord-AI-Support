import type { SupabaseClient } from "@supabase/supabase-js";
import type { DocumentList, UploadDocumentCommand, UpdateDocumentCommand } from "../../types";

interface QueryParams {
  page?: number;
  pageSize?: number;
  q?: string;
  fileType?: string;
}

/**
 * Fetches a list of knowledge documents for a server
 */
export async function getDocumentsByServerId(
  serverId: string,
  params: QueryParams = {},
  supabaseClient: SupabaseClient
): Promise<DocumentList> {
  const { page = 1, pageSize = 20, q, fileType } = params;

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

  // Convert from snake_case to camelCase keys
  const formattedData =
    data?.map((doc) => ({
      id: doc.id,
      title: doc.title,
      fileType: doc.file_type,
      createdAt: doc.created_at,
      updatedAt: doc.updated_at,
    })) || [];

  return {
    data: formattedData,
    page,
    pageSize,
    total: count || 0,
  };
}

/**
 * Fetches a single document by ID
 */
export async function getDocumentById(serverId: string, docId: string, supabaseClient: SupabaseClient) {
  const { data, error } = await supabaseClient
    .from("knowledge_documents")
    .select("*")
    .eq("server_id", serverId)
    .eq("id", docId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new Error("Document not found");
    throw error;
  }

  // For PDF, include download URL
  const documentWithContent = { ...data };
  if (data.storage_path) {
    const { data: signedURL } = await supabaseClient.storage.from("documents").createSignedUrl(data.storage_path, 3600); // 1 hour

    documentWithContent.downloadUrl = signedURL;
  }

  // Convert to camelCase
  return {
    id: documentWithContent.id,
    title: documentWithContent.title,
    content: documentWithContent.content,
    fileType: documentWithContent.file_type,
    downloadUrl: documentWithContent.downloadUrl,
    createdAt: documentWithContent.created_at,
    updatedAt: documentWithContent.updated_at,
  };
}

/**
 * Creates a new document
 */
export async function createDocument(
  serverId: string,
  data: UploadDocumentCommand,
  createdBy: string,
  supabaseClient: SupabaseClient
) {
  // Check if we have a valid user ID
  if (!createdBy) {
    throw new Error("User must be authenticated to create documents");
  }

  // Verify the authenticated user exists in the database
  const { data: user, error: userError } = await supabaseClient
    .from("users")
    .select("id")
    .eq("id", createdBy)
    .maybeSingle();

  if (userError) {
    console.error("Error verifying user:", userError);
    throw new Error("Failed to verify user authentication");
  }

  // If user doesn't exist, try to use the auth user info to create a record
  if (!user) {
    // Get the authenticated user from the session
    const { data: authData, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !authData.user) {
      throw new Error("User not authenticated or does not exist in the database");
    }

    // Make sure the auth user ID matches the provided createdBy ID
    if (authData.user.id !== createdBy) {
      throw new Error("Authentication mismatch - user ID does not match authenticated user");
    }

    // Insert user record if they don't exist
    const { error: insertError } = await supabaseClient.from("users").insert({
      id: authData.user.id,
      discord_id: authData.user.user_metadata?.discord_id || authData.user.user_metadata?.provider_id || "unknown",
      discord_username:
        authData.user.user_metadata?.full_name ||
        authData.user.user_metadata?.name ||
        authData.user.user_metadata?.custom_claims?.global_name ||
        "Unknown User",
      avatar_url: authData.user.user_metadata?.avatar_url || authData.user.user_metadata?.picture || null,
    });

    if (insertError) {
      console.error("Error creating user record:", insertError);
      throw new Error("Failed to create user record");
    }
  }

  // Create the document with the authenticated user as creator
  const { data: document, error } = await supabaseClient
    .from("knowledge_documents")
    .insert({
      server_id: serverId,
      title: data.title,
      content: data.content || "",
      file_type: data.fileType,
      storage_path: null, // No storage path since we're not handling files
      created_by: createdBy,
    })
    .select()
    .single();

  if (error) throw error;

  return {
    id: document.id,
    title: document.title,
    fileType: document.file_type,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  };
}

/**
 * Updates an existing document
 */
export async function updateDocument(
  serverId: string,
  docId: string,
  data: UpdateDocumentCommand,
  supabaseClient: SupabaseClient
) {
  const { data: document, error } = await supabaseClient
    .from("knowledge_documents")
    .update({
      title: data.title,
      content: data.content,
    })
    .eq("server_id", serverId)
    .eq("id", docId)
    .select()
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new Error("Document not found");
    throw error;
  }

  return {
    id: document.id,
    title: document.title,
    fileType: document.file_type,
    createdAt: document.created_at,
    updatedAt: document.updated_at,
  };
}

/**
 * Deletes a document
 */
export async function deleteDocument(serverId: string, docId: string, supabaseClient: SupabaseClient) {
  // Get document info to check for storage path
  const { data: document, error: fetchError } = await supabaseClient
    .from("knowledge_documents")
    .select("storage_path")
    .eq("server_id", serverId)
    .eq("id", docId)
    .single();

  if (fetchError) {
    if (fetchError.code === "PGRST116") throw new Error("Document not found");
    throw fetchError;
  }

  // Delete file from storage if exists
  if (document.storage_path) {
    await supabaseClient.storage.from("documents").remove([document.storage_path]);
  }

  // Delete the record
  const { error } = await supabaseClient.from("knowledge_documents").delete().eq("server_id", serverId).eq("id", docId);

  if (error) throw error;
}

/**
 * Triggers reindexing of a document
 */
export async function reindexDocument(serverId: string, docId: string, supabaseClient: SupabaseClient) {
  // Check if document exists
  const { error } = await supabaseClient
    .from("knowledge_documents")
    .select("id")
    .eq("server_id", serverId)
    .eq("id", docId)
    .single();

  if (error) {
    if (error.code === "PGRST116") throw new Error("Document not found");
    throw error;
  }

  // Call reindex function
  await supabaseClient.rpc("notify_document_reindex", {
    doc_id: docId,
    server_id: serverId,
  });

  return { id: docId, status: "reindexing" };
}
