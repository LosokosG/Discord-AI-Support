import type { APIRoute } from "astro";
import { z } from "zod";
import type { ErrorResponse } from "@/types";

// Define the schema here directly to avoid import errors
const ServerListQuerySchema = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().positive().max(100).default(10),
  q: z.string().optional(),
});

// Disable static prerendering for this endpoint
export const prerender = false;

/**
 * GET /api/servers
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
      page: url.searchParams.get("page") || "1",
      pageSize: url.searchParams.get("pageSize") || "10",
      q: url.searchParams.get("q") || undefined,
    };

    console.log("API request URL:", request.url);
    console.log("Query params:", queryParams);

    // Parse and validate with Zod schema
    const parsedQuery = ServerListQuerySchema.safeParse({
      page: parseInt(queryParams.page),
      pageSize: parseInt(queryParams.pageSize),
      q: queryParams.q,
    });

    if (!parsedQuery.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid query parameters",
            details: parsedQuery.error.errors.map((err: z.ZodIssue) => ({
              field: err.path.join("."),
              message: err.message,
            })),
          },
        } as ErrorResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Mock server list response for testing
    // In a real implementation, you would call the service function:
    // const serverList = await listServers(parsedQuery.data, supabase);
    const serverList = {
      data: [
        {
          id: 123456789,
          name: "Test Discord Server",
          active: true,
          config: { language: "en" },
          iconUrl: null,
        },
      ],
      page: parsedQuery.data.page,
      pageSize: parsedQuery.data.pageSize,
      total: 1,
    };

    // 4. Return the response
    return new Response(JSON.stringify(serverList), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
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
