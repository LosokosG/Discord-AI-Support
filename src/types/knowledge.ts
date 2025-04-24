import type { KnowledgeDocument } from "@/types";

/**
 * Extended KnowledgeDocument interface that includes document content and download URL
 * Used by document detail and edit pages
 */
export interface KnowledgeDocumentWithContent extends Omit<KnowledgeDocument, "fileType"> {
  id: string;
  title: string;
  content: string;
  fileType: string; // We re-declare this to ensure it's recognized in templates
  downloadUrl?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Interface for the document for preview in the document form
 */
export interface DocumentFormData {
  id?: string;
  title?: string;
  content?: string;
  fileType?: string;
}
