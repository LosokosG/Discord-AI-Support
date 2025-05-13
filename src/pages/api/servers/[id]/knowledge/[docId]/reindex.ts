import type { APIRoute } from "astro";
import { reindexDocument } from "@/lib/services/documents";
import { z } from "zod";

export const prerender = false;

// Schema for path parameters
const ParamsSchema = z.object({
  id: z.string().min(1, "Server ID is required"),
  docId: z.string().uuid("Invalid document ID"),
});

export const POST: APIRoute = async ({ params, locals, redirect }) => {
  const serverId = params.id as string;
  const docId = params.docId as string;

  // Redirect to the canonical endpoint
  return redirect(`/api/servers/${serverId}/documents/${docId}/reindex`, 307);
};
