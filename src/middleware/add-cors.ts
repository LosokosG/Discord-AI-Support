import { defineMiddleware } from "astro:middleware";

// Middleware to add CORS headers for the API routes
export const onRequest = defineMiddleware(async (context, next) => {
  // Only apply CORS headers to API routes
  if (context.url.pathname.startsWith("/api/")) {
    // Get the response from the endpoint
    const response = await next();

    // Add CORS headers to the response
    const newResponse = new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers.entries()),
        "Access-Control-Allow-Origin": "*", // Allow all origins
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
        "Access-Control-Max-Age": "86400", // 24 hours
      },
    });

    return newResponse;
  }

  // For non-API routes, just pass through
  return next();
});
