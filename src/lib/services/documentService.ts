/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DocumentFormValues } from "@/components/knowledge/DocumentForm";

/**
 * Document Service for frontend document management
 * This is a thin wrapper around fetch for document operations
 */
export const documentService = {
  /**
   * Create a new document in the knowledge base
   */
  async createDocument(serverId: string, data: DocumentFormValues): Promise<Response> {
    return fetch(`/api/servers/${serverId}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing document in the knowledge base
   */
  async updateDocument(serverId: string, documentId: string, data: DocumentFormValues): Promise<Response> {
    return fetch(`/api/servers/${serverId}/documents/${documentId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  },

  /**
   * Get a document by ID
   */
  async getDocument(serverId: string, documentId: string): Promise<any> {
    const response = await fetch(`/api/servers/${serverId}/documents/${documentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Get all documents for a server
   */
  async getDocuments(
    serverId: string,
    params?: { page?: number; pageSize?: number; q?: string; fileType?: string }
  ): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize) searchParams.append("pageSize", params.pageSize.toString());
    if (params?.q) searchParams.append("q", params.q);
    if (params?.fileType) searchParams.append("fileType", params.fileType);

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const response = await fetch(`/api/servers/${serverId}/documents${query}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Delete a document
   */
  async deleteDocument(serverId: string, documentId: string): Promise<Response> {
    return fetch(`/api/servers/${serverId}/documents/${documentId}`, {
      method: "DELETE",
    });
  },

  /**
   * Reindex a document
   */
  async reindexDocument(serverId: string, documentId: string): Promise<Response> {
    return fetch(`/api/servers/${serverId}/documents/${documentId}/reindex`, {
      method: "POST",
    });
  },
};
