import type { SupabaseClient } from "@supabase/supabase-js";
import type { Server, ServerList, CreateServerCommand, ServerDetail, UpdateServerCommand } from "../../types";

interface ListServersOptions {
  page: number;
  pageSize: number;
  q?: string;
}

/**
 * Retrieves a paginated list of servers (guilds) from the database.
 * Supports filtering by name and pagination.
 */
export async function listServers(options: ListServersOptions, supabaseClient: SupabaseClient): Promise<ServerList> {
  const { page, pageSize, q } = options;

  // Start building the query
  let query = supabaseClient.from("servers").select("*", { count: "exact" });

  // Apply name filter if provided
  if (q) {
    query = query.ilike("name", `%${q}%`);
  }

  // Apply pagination
  const from = (page - 1) * pageSize;
  const to = page * pageSize - 1;
  query = query.range(from, to);

  // Execute the query
  const { data, error, count } = await query;

  if (error) {
    throw error;
  }

  // Transform snake_case DB results to camelCase for the API response
  const serverData = data.map((server) => ({
    id: server.id,
    name: server.name,
    iconUrl: server.icon_url,
    active: server.active,
    config: server.config,
  })) as Server[];

  return {
    data: serverData,
    page,
    pageSize,
    total: count || 0,
  };
}

/**
 * Creates a new server (guild) in the database
 * @throws {Error} If the server with the given id already exists or if database operation fails
 */
export async function createServer(command: CreateServerCommand, supabaseClient: SupabaseClient): Promise<Server> {
  // Prepare the data in DB format (snake_case)
  const serverData = {
    id: command.id.toString(), // Store Discord IDs as strings to preserve precision
    name: command.name,
    icon_url: command.iconUrl,
    config: command.config,
    active: true, // New servers are active by default
  };

  // Insert the server into the database
  const { data, error } = await supabaseClient.from("servers").insert(serverData).select().single();

  if (error) {
    // Check if it's a unique constraint violation (server already exists)
    if (error.code === "23505") {
      throw new Error(`Server with ID ${command.id} already exists`);
    }
    throw error;
  }

  // Transform snake_case DB result to camelCase for the API response
  return {
    id: data.id,
    name: data.name,
    iconUrl: data.icon_url,
    active: data.active,
    config: data.config,
  } as Server;
}

/**
 * Retrieves a server (guild) by its ID with detailed information
 * @throws {Error} If the server is not found or if database operation fails
 */
export async function getServerDetail(id: string, supabaseClient: SupabaseClient): Promise<ServerDetail> {
  // Query by string ID
  const { data, error } = await supabaseClient.from("servers").select("*").eq("id", id).maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`Server with ID ${id} not found`);
  }

  // Transform snake_case DB result to camelCase for the API response
  return {
    id: data.id,
    name: data.name,
    iconUrl: data.icon_url,
    active: data.active,
    config: data.config,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    planId: data.plan_id,
  } as ServerDetail;
}

/**
 * Updates a server's properties (name, iconUrl, config, active status)
 * @throws {Error} If the server is not found or if database operation fails
 */
export async function updateServer(
  id: string,
  command: UpdateServerCommand,
  supabaseClient: SupabaseClient
): Promise<Server> {
  // Prepare the data in DB format (snake_case)
  const updateData: {
    name?: string;
    icon_url?: string | null;
    config?: unknown;
    active?: boolean;
  } = {};
  if (command.name !== undefined) updateData.name = command.name;
  if (command.iconUrl !== undefined) updateData.icon_url = command.iconUrl;
  if (command.config !== undefined) updateData.config = command.config;
  if (command.active !== undefined) updateData.active = command.active;

  // Update the server in the database
  const { data, error } = await supabaseClient.from("servers").update(updateData).eq("id", id).select().maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`Server with ID ${id} not found`);
  }

  // Transform snake_case DB result to camelCase for the API response
  return {
    id: data.id,
    name: data.name,
    iconUrl: data.icon_url,
    active: data.active,
    config: data.config,
  } as Server;
}

/**
 * Deactivates a server (soft delete)
 * @throws {Error} If the server is not found or if database operation fails
 */
export async function deactivateServer(id: string, supabaseClient: SupabaseClient): Promise<void> {
  // Update the server to set active = false
  const { data, error } = await supabaseClient
    .from("servers")
    .update({ active: false })
    .eq("id", id)
    .select()
    .maybeSingle();

  if (error) {
    throw error;
  }

  if (!data) {
    throw new Error(`Server with ID ${id} not found`);
  }
}
