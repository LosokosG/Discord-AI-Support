import type { APIRoute } from "astro";

export const prerender = false;

export const POST: APIRoute = async ({ params, redirect }) => {
  const { id: serverId, docId } = params;

  if (!serverId || !docId) {
    return new Response("Missing parameters", { status: 400 });
  }

  // Redirect to the documents endpoint
  return redirect(`/api/servers/${serverId}/documents/${docId}/reindex`, 307);
};
