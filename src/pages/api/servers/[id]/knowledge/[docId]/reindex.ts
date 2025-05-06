import type { APIRoute } from "astro";
import { reindexDocument } from "@/lib/services/documents";
import { z } from "zod";

export const prerender = false;

// Schema for path parameters
const ParamsSchema = z.object({
  id: z.string().min(1, "Server ID is required"),
  docId: z.string().uuid("Invalid document ID"),
});

export const POST: APIRoute = async ({ params, locals, redirect, request }) => {
  try {
    // Validate path parameters
    const validParams = ParamsSchema.safeParse(params);
    if (!validParams.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid parameters",
            details: validParams.error.errors,
          },
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const serverId = params.id as string;
    const docId = params.docId as string;

    // Get authenticated user
    const supabase = locals.supabase;

    // Call service to trigger reindexing
    await reindexDocument(serverId, docId, supabase);

    // Get referer for redirect
    const referer = request.headers.get("referer");
    const redirectUrl = referer || `/servers/${serverId}/knowledge`;

    // Redirect back to the document page
    return redirect(redirectUrl);
  } catch (error) {
    console.error("Error reindexing document:", error);

    // Handle specific errors
    if (error instanceof Error) {
      if (error.message.includes("not found")) {
        return new Response(
          JSON.stringify({
            error: {
              code: 404,
              message: "Document not found",
            },
          }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    // Generic error
    return new Response(
      JSON.stringify({
        error: {
          code: 500,
          message: "Failed to reindex document",
        },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
