import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Redirect GET /servers/{id}/knowledge/{docId} to /servers/{id}/documents/{docId}
 * This maintains backward compatibility with frontend components
 */
export const GET: APIRoute = async ({ params, redirect }) => {
  const { id: serverId, docId } = params;

  if (!serverId || !docId) {
    return new Response("Missing parameters", { status: 400 });
  }

  // Redirect to the canonical endpoint
  return redirect(`/api/servers/${serverId}/documents/${docId}`, 307);
};

/**
 * Redirect PATCH /servers/{id}/knowledge/{docId} to /servers/{id}/documents/{docId}
 * This maintains backward compatibility with frontend components
 */
export const PATCH: APIRoute = async ({ params, request, redirect }) => {
  const { id: serverId, docId } = params;

  if (!serverId || !docId) {
    return new Response("Missing parameters", { status: 400 });
  }

  // Redirect to the canonical endpoint
  return redirect(`/api/servers/${serverId}/documents/${docId}`, 307);
};

/**
 * Redirect DELETE /servers/{id}/knowledge/{docId} to /servers/{id}/documents/{docId}
 * This maintains backward compatibility with frontend components
 */
export const DELETE: APIRoute = async ({ params, redirect }) => {
  const { id: serverId, docId } = params;

  if (!serverId || !docId) {
    return new Response("Missing parameters", { status: 400 });
  }

  // Redirect to the canonical endpoint
  return redirect(`/api/servers/${serverId}/documents/${docId}`, 307);
};
