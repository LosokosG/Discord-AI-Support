import type { APIContext } from "astro";
import { reindexDocument } from "../../../../../../lib/services/documents";
import { DocumentIdSchema } from "../../../../../../lib/schemas/document-schemas";
import type { ErrorResponse } from "../../../../../../types";

export const prerender = false;

/**
 * POST /servers/{id}/documents/{docId}/reindex - Reindex a document
 *
 * Triggers the reindexing process for a document's content vector.
 * This is useful after content updates to ensure search accuracy.
 */
export async function POST({ params, locals }: APIContext): Promise<Response> {
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

    // Trigger reindexing
    try {
      const result = await reindexDocument(pathResult.data.id, pathResult.data.docId, supabase);

      return new Response(JSON.stringify(result), {
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
    console.error("Error reindexing document:", error);

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
