import type { APIRoute } from "astro";
import { ServerListQuerySchema, CreateServerSchema } from "../../../lib/utils/validation";
import { listServers, createServer } from "../../../lib/services/servers";
import type { ErrorResponse, CreateServerCommand } from "../../../types";

// Disable static prerendering for this endpoint
export const prerender = false;

/**
 * GET /servers
 * Returns a paginated list of servers (guilds) that the authenticated user has admin rights for.
 */
export const GET: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Authorization check
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({
          error: {
            code: 401,
            message: "Unauthorized: Authentication required",
          },
        } as ErrorResponse),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = {
      page: url.searchParams.get("page"),
      pageSize: url.searchParams.get("pageSize"),
      q: url.searchParams.get("q"),
    };

    // Parse and validate with Zod schema
    const parsedQuery = ServerListQuerySchema.safeParse({
      page: queryParams.page,
      pageSize: queryParams.pageSize,
      q: queryParams.q,
    });

    if (!parsedQuery.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid query parameters",
            details: parsedQuery.error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        } as ErrorResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Call the service function to fetch servers
    const serverList = await listServers(parsedQuery.data, supabase);

    // 4. Return the response
    return new Response(JSON.stringify(serverList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching servers:", error);

    // 5. Handle unexpected errors
    return new Response(
      JSON.stringify({
        error: {
          code: 500,
          message: "Internal server error",
        },
      } as ErrorResponse),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};

/**
 * POST /servers
 * Creates a new server (guild) with initial configuration
 */
export const POST: APIRoute = async ({ request, locals }) => {
  try {
    // 1. Authorization check
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({
          error: {
            code: 401,
            message: "Unauthorized: Authentication required",
          },
        } as ErrorResponse),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Parse and validate request body
    const requestBody = await request.json().catch(() => ({}));
    const parsedBody = CreateServerSchema.safeParse(requestBody);

    if (!parsedBody.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid request payload",
            details: parsedBody.error.errors.map((err) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        } as ErrorResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Call service to create the server
    try {
      const newServer = await createServer(parsedBody.data as unknown as CreateServerCommand, supabase);

      // 4. Return the newly created server with 201 status
      return new Response(JSON.stringify(newServer), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      // Handle specific errors
      if (err instanceof Error && err.message.includes("already exists")) {
        return new Response(
          JSON.stringify({
            error: {
              code: 409,
              message: err.message,
            },
          } as ErrorResponse),
          { status: 409, headers: { "Content-Type": "application/json" } }
        );
      }
      // Re-throw for general error handling
      throw err;
    }
  } catch (error) {
    console.error("Error creating server:", error);

    // 5. Handle unexpected errors
    return new Response(
      JSON.stringify({
        error: {
          code: 500,
          message: "Internal server error",
        },
      } as ErrorResponse),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
