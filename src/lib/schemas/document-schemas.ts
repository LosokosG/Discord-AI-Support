import { z } from "zod";

/**
 * Schema for validating query parameters in document list requests
 */
export const DocumentQuerySchema = z.object({
  page: z.coerce.number().positive().default(1).optional().catch(1),
  pageSize: z.coerce.number().positive().max(100).default(20).optional().catch(20),
  q: z.string().optional().nullable(),
  fileType: z.enum(["txt", "md", "pdf"]).optional().nullable(),
});

/**
 * Schema for validating document upload JSON payload
 */
export const UploadDocumentSchema = z.object({
  title: z.string().min(1, "Title is required").max(255),
  content: z.string().optional(),
  fileType: z.enum(["txt", "md", "pdf"]),
});

/**
 * Schema for validating document update payload
 */
export const UpdateDocumentSchema = z
  .object({
    title: z.string().min(1).max(255).optional(),
    content: z.string().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
  });

/**
 * Schema for path parameters
 */
export const ServerIdSchema = z.object({
  id: z.string().min(1, "Server ID is required"),
});

export const DocumentIdSchema = ServerIdSchema.extend({
  docId: z.string().uuid("Document ID must be a valid UUID"),
});
