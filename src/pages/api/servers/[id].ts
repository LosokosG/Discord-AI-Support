import type { APIRoute } from "astro";
import { getServerDetail, updateServer, deactivateServer } from "../../../lib/services/servers";
import type { ErrorResponse } from "../../../types";
import { z } from "zod";
import { UpdateServerSchema } from "../../../lib/utils/validation";

// Disable static prerendering for this endpoint
export const prerender = false;

// Schema for validating the server ID
const ServerIdSchema = z.string().regex(/^\d+$/, "Server ID must contain only digits");

/**
 * GET /servers/{id}
 * Returns detailed information about a specific server (guild)
 */
export const GET: APIRoute = async ({ params, locals }) => {
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

    // 2. Validate server ID
    const { id } = params;
    const parsedId = ServerIdSchema.safeParse(id);

    if (!parsedId.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid server ID format",
          },
        } as ErrorResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Call service to get server details
    try {
      const serverDetail = await getServerDetail(parsedId.data, supabase);

      // 4. Return the server details
      return new Response(JSON.stringify(serverDetail), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      // Handle not found error
      if (err instanceof Error && err.message.includes("not found")) {
        return new Response(
          JSON.stringify({
            error: {
              code: 404,
              message: err.message,
            },
          } as ErrorResponse),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      // Re-throw for general error handling
      throw err;
    }
  } catch (error) {
    console.error("Error fetching server details:", error);

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
 * PATCH /servers/{id}
 * Updates properties of a specific server (guild)
 */
export const PATCH: APIRoute = async ({ params, request, locals }) => {
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

    // 2. Validate server ID
    const { id } = params;
    const parsedId = ServerIdSchema.safeParse(id);

    if (!parsedId.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid server ID format",
          },
        } as ErrorResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Parse and validate request body
    const requestBody = await request.json().catch(() => ({}));
    const parsedBody = UpdateServerSchema.safeParse(requestBody);

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

    // 4. Check if update data is empty
    if (Object.keys(parsedBody.data).length === 0) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Update payload cannot be empty",
          },
        } as ErrorResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 5. Call service to update the server
    try {
      const updatedServer = await updateServer(parsedId.data, parsedBody.data, supabase);

      // 6. Return the updated server
      return new Response(JSON.stringify(updatedServer), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      // Handle not found error
      if (err instanceof Error && err.message.includes("not found")) {
        return new Response(
          JSON.stringify({
            error: {
              code: 404,
              message: err.message,
            },
          } as ErrorResponse),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      // Re-throw for general error handling
      throw err;
    }
  } catch (error) {
    console.error("Error updating server:", error);

    // 7. Handle unexpected errors
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
 * DELETE /servers/{id}
 * Deactivates a server (soft delete)
 */
export const DELETE: APIRoute = async ({ params, locals }) => {
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

    // 2. Validate server ID
    const { id } = params;
    const parsedId = ServerIdSchema.safeParse(id);

    if (!parsedId.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid server ID format",
          },
        } as ErrorResponse),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Call service to deactivate the server
    try {
      await deactivateServer(parsedId.data, supabase);

      // 4. Return success with no content
      return new Response(null, { status: 204 });
    } catch (err) {
      // Handle not found error
      if (err instanceof Error && err.message.includes("not found")) {
        return new Response(
          JSON.stringify({
            error: {
              code: 404,
              message: err.message,
            },
          } as ErrorResponse),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }
      // Re-throw for general error handling
      throw err;
    }
  } catch (error) {
    console.error("Error deactivating server:", error);

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
