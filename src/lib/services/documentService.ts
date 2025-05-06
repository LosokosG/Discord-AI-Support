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
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    return fetch(`/api/servers/${serverId}/knowledge`, {
      method: "POST",
      body: formData,
    });
  },

  /**
   * Update an existing document in the knowledge base
   */
  async updateDocument(serverId: string, documentId: string, data: DocumentFormValues): Promise<Response> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    return fetch(`/api/servers/${serverId}/knowledge/${documentId}`, {
      method: "POST", // Using POST with _method=PATCH for consistent form handling
      body: formData,
    });
  },

  /**
   * Get a document by ID
   */
  async getDocument(serverId: string, documentId: string): Promise<any> {
    const response = await fetch(`/api/servers/${serverId}/knowledge/${documentId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch document: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Get all documents for a server
   */
  async getDocuments(serverId: string, params?: { page?: number; pageSize?: number }): Promise<any> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.pageSize) searchParams.append("pageSize", params.pageSize.toString());

    const query = searchParams.toString() ? `?${searchParams.toString()}` : "";
    const response = await fetch(`/api/servers/${serverId}/knowledge${query}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch documents: ${response.statusText}`);
    }
    return response.json();
  },

  /**
   * Delete a document
   */
  async deleteDocument(serverId: string, documentId: string): Promise<void> {
    const response = await fetch(`/api/servers/${serverId}/knowledge/${documentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete document: ${response.statusText}`);
    }
  },
};
