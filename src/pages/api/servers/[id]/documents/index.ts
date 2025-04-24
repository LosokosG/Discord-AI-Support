import type { APIContext } from "astro";
import { getDocumentsByServerId, createDocument } from "../../../../../lib/services/documents";
import { DocumentQuerySchema, ServerIdSchema, UploadDocumentSchema } from "../../../../../lib/schemas/document-schemas";
import type { ErrorResponse } from "../../../../../types";
import { parseMultipartFormData } from "../../../../../lib/utils/parse-form-data";
import type { SupabaseClient } from "@supabase/supabase-js";

// Define the extended locals type
interface ExtendedLocals {
  supabase?: SupabaseClient;
  user?: {
    id: string;
    discord_id: string;
    discord_username: string;
    role?: string;
  };
}

export const prerender = false;

/**
 * GET /servers/{id}/documents - List documents for a server
 *
 * Returns a paginated list of knowledge base documents for a specific server.
 * Supports filtering by search term and file type.
 */
export async function GET({ params, request, locals }: APIContext): Promise<Response> {
  try {
    // Validate server ID from path params
    const pathResult = ServerIdSchema.safeParse(params);
    if (!pathResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid server ID",
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

    // Parse and validate query parameters
    const url = new URL(request.url);
    const queryParams = {
      page: url.searchParams.get("page") || undefined,
      pageSize: url.searchParams.get("pageSize") || undefined,
      q: url.searchParams.get("q") || undefined,
      fileType: url.searchParams.get("fileType") || undefined,
    };

    const queryResult = DocumentQuerySchema.safeParse(queryParams);
    if (!queryResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid query parameters",
            details: queryResult.error.errors.map((err) => ({
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

    // Check if user has access to the server (Supabase RLS will enforce this)
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

    // Call the service function to list documents
    const result = await getDocumentsByServerId(
      pathResult.data.id,
      {
        page: queryResult.data.page,
        pageSize: queryResult.data.pageSize,
        q: queryResult.data.q === null ? undefined : queryResult.data.q,
        fileType: queryResult.data.fileType === null ? undefined : queryResult.data.fileType,
      },
      supabase
    );

    // Set cache control headers for better performance
    const headers = new Headers({
      "Content-Type": "application/json",
      "Cache-Control": "max-age=60, stale-while-revalidate=300",
    });

    return new Response(JSON.stringify(result), {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Error listing documents:", error);

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

/**
 * POST /servers/{id}/documents - Create a new document
 *
 * Accepts either JSON or multipart/form-data for document creation.
 * For file uploads, use multipart/form-data with a file field.
 * For text content, either format can be used.
 */
export async function POST({ params, request, locals }: APIContext): Promise<Response> {
  try {
    // Validate server ID from path params
    const pathResult = ServerIdSchema.safeParse(params);
    if (!pathResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid server ID",
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

    // Check if user has access to the server (Supabase RLS will enforce this)
    const supabase = locals.supabase;
    if (!supabase) {
      return new Response(
        JSON.stringify({
          error: {
            code: 401,
            message: "Unauthorized - Supabase client not available",
          },
        } as ErrorResponse),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get the user ID - first try from middleware mock user, then from Supabase auth
    const extendedLocals = locals as ExtendedLocals;
    let userId = extendedLocals.user?.id;

    // If no user in locals (from middleware), try to get from auth
    if (!userId) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      userId = user?.id;
    }

    if (!userId) {
      return new Response(
        JSON.stringify({
          error: {
            code: 401,
            message: "Unauthorized - User not authenticated",
          },
        } as ErrorResponse),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Check content type to determine how to parse the request
    const contentType = request.headers.get("Content-Type") || "";
    let documentData;
    let file;

    if (contentType.includes("multipart/form-data")) {
      // Handle multipart/form-data (file upload)
      const { fields, file: uploadedFile } = await parseMultipartFormData(request);
      file = uploadedFile;

      // Determine fileType from file extension or form field
      let fileType = fields.fileType;
      if (!fileType && file?.name) {
        const extension = file.name.split(".").pop()?.toLowerCase();
        if (extension === "md" || extension === "txt" || extension === "pdf") {
          fileType = extension;
        }
      }

      documentData = {
        title: fields.title || "",
        fileType: fileType || "",
      };
    } else {
      // Handle JSON request
      const jsonData = await request.json();
      documentData = jsonData;
    }

    // Validate the document data
    const validationResult = UploadDocumentSchema.safeParse(documentData);
    if (!validationResult.success) {
      return new Response(
        JSON.stringify({
          error: {
            code: 400,
            message: "Invalid document data",
            details: validationResult.error.errors.map((err) => ({
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

    // Check file size limit (10MB)
    if (file && file.size > 10 * 1024 * 1024) {
      return new Response(
        JSON.stringify({
          error: {
            code: 413,
            message: "File size exceeds the 10MB limit",
          },
        } as ErrorResponse),
        {
          status: 413,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // For PDF files, we need the file object
    // For text files, we might need to extract content if it's a file
    let content = validationResult.data.content;
    if (file && (file.type.includes("text/") || file.type.includes("markdown"))) {
      // Read content from text file
      content = await file.text();
    }

    // Create the document
    const newDocument = await createDocument(
      pathResult.data.id,
      {
        ...validationResult.data,
        content,
        file: file && validationResult.data.fileType === "pdf" ? file : undefined,
      },
      userId,
      supabase
    );

    return new Response(JSON.stringify(newDocument), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating document:", error);

    // Handle expected error types
    if (error instanceof Error) {
      if (error.message.includes("Unsupported file type")) {
        return new Response(
          JSON.stringify({
            error: {
              code: 415,
              message: "Unsupported file type",
            },
          } as ErrorResponse),
          {
            status: 415,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

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
