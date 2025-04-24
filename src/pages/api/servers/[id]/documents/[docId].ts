import type { APIContext } from "astro";
import { getDocumentById, updateDocument, deleteDocument } from "../../../../../lib/services/documents";
import { DocumentIdSchema, UpdateDocumentSchema } from "../../../../../lib/schemas/document-schemas";
import type { ErrorResponse } from "../../../../../types";

export const prerender = false;

/**
 * GET /servers/{id}/documents/{docId} - Get a specific document
 *
 * Returns the full document including content.
 * For PDF documents, includes a signed download URL.
 */
export async function GET({ params, locals }: APIContext): Promise<Response> {
  try {
    // Validate path parameters
    const pathResult = DocumentIdSchema.safeParse(params);
    if (!pathResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid parameters",
            details: pathResult.error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        } as ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check authentication
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({
          error: {
            code: 401,
            message: "Unauthorized",
          },
        } as ErrorResponse),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the document
    try {
      const document = await getDocumentById(pathResult.data.id, pathResult.data.docId, supabase);

      return new Response(JSON.stringify(document), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "max-age=60, stale-while-revalidate=300",
        },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "NotFoundError") {
        return new Response(
          JSON.stringify({
            error: {
              code: 404,
              message: "Document not found",
            },
          } as ErrorResponse),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw error; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error("Error getting document:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: 500,
          message: "Internal server error",
        },
      } as ErrorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * PATCH /servers/{id}/documents/{docId} - Update a document
 *
 * Updates document title and/or content.
 */
export async function PATCH({ params, request, locals }: APIContext): Promise<Response> {
  try {
    // Validate path parameters
    const pathResult = DocumentIdSchema.safeParse(params);
    if (!pathResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid parameters",
            details: pathResult.error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        } as ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check authentication
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({
          error: {
            code: 401,
            message: "Unauthorized",
          },
        } as ErrorResponse),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateDocumentSchema.safeParse(body);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid update data",
            details: validationResult.error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        } as ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Update the document
    try {
      const document = await updateDocument(pathResult.data.id, pathResult.data.docId, validationResult.data, supabase);

      return new Response(JSON.stringify(document), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      if (error instanceof Error && error.name === "NotFoundError") {
        return new Response(
          JSON.stringify({
            error: {
              code: 404,
              message: "Document not found",
            },
          } as ErrorResponse),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw error; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error("Error updating document:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: 500,
          message: "Internal server error",
        },
      } as ErrorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

/**
 * DELETE /servers/{id}/documents/{docId} - Delete a document
 *
 * Removes the document and any associated files from storage.
 */
export async function DELETE({ params, locals }: APIContext): Promise<Response> {
  try {
    // Validate path parameters
    const pathResult = DocumentIdSchema.safeParse(params);
    if (!pathResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid parameters",
            details: pathResult.error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        } as ErrorResponse),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check authentication
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({
          error: {
            code: 401,
            message: "Unauthorized",
          },
        } as ErrorResponse),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Delete the document
    try {
      await deleteDocument(pathResult.data.id, pathResult.data.docId, supabase);

      return new Response(null, {
        status: 204, // No Content for successful deletion
      });
    } catch (error) {
      if (error instanceof Error && error.name === "NotFoundError") {
        return new Response(
          JSON.stringify({
            error: {
              code: 404,
              message: "Document not found",
            },
          } as ErrorResponse),
          {
            status: 404,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
      throw error; // Let the outer catch handle other errors
    }
  } catch (error) {
    console.error("Error deleting document:", error);

    return new Response(
      JSON.stringify({
        error: {
          code: 500,
          message: "Internal server error",
        },
      } as ErrorResponse),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
