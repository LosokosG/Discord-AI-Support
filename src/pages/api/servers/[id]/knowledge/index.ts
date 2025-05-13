import type { APIRoute } from "astro";

export const prerender = false;

/**
 * Redirect GET /servers/{id}/knowledge to /servers/{id}/documents
 * This maintains backward compatibility with frontend components
 * that might still use the knowledge endpoint pattern
 */
export const GET: APIRoute = async ({ params, request, redirect }) => {
  const serverId = params.id;
  if (!serverId) {
    return new Response("Missing server ID", { status: 400 });
  }

  // Preserve query parameters
  const url = new URL(request.url);
  const queryString = url.search ? url.search : "";

  // Redirect to the canonical endpoint
  return redirect(`/api/servers/${serverId}/documents${queryString}`, 307);
};

/**
 * Redirect POST /servers/{id}/knowledge to /servers/{id}/documents
 * This maintains backward compatibility with frontend components
 * that might still use the knowledge endpoint pattern
 */
export const POST: APIRoute = async ({ params, request, redirect }) => {
  const serverId = params.id;
  if (!serverId) {
    return new Response("Missing server ID", { status: 400 });
  }

  // Redirect to the canonical endpoint
  return redirect(`/api/servers/${serverId}/documents`, 307);
};
