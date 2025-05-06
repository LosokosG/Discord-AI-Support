import type { SupabaseClient } from "@supabase/supabase-js";
import type { ServerList, Server, CreateServerCommand, UpdateServerCommand } from "@/types";

const API_BASE_URL = import.meta.env.PUBLIC_API_BASE_URL || "/api";

/**
 * Fetches the list of Discord servers connected to the application
 */
export async function getServers(
  supabaseClient: SupabaseClient,
  options: { page?: number; pageSize?: number } = {}
): Promise<ServerList> {
  const { page = 1, pageSize = 20 } = options;

  try {
    // In production, we would use the supabaseClient to query the database
    // For now, we'll return mock data to demonstrate the UI

    const { data, error } = await supabaseClient
      .from("servers")
      .select("id, name, active, config, icon_url")
      .order("name", { ascending: true })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) throw error;

    // Convert snake_case to camelCase
    const formattedData = data.map((server) => ({
      id: server.id,
      name: server.name,
      active: server.active,
      config: server.config,
      iconUrl: server.icon_url,
    }));

    // Get total count for pagination
    const { count, error: countError } = await supabaseClient.from("servers").select("id", { count: "exact" });

    if (countError) throw countError;

    return {
      data: formattedData,
      page,
      pageSize,
      total: count || 0,
    };
  } catch (error) {
    console.error("Error fetching servers:", error);
    throw error;
  }
}

/**
 * Gets a single server by ID
 */
export async function getServerById(serverId: string | number, supabaseClient: SupabaseClient): Promise<Server> {
  try {
    const { data, error } = await supabaseClient
      .from("servers")
      .select("id, name, active, config, icon_url")
      .eq("id", serverId)
      .single();

    if (error) throw error;

    // Convert to camelCase
    return {
      id: data.id,
      name: data.name,
      active: data.active,
      config: data.config,
      iconUrl: data.icon_url,
    };
  } catch (error) {
    console.error(`Error fetching server ${serverId}:`, error);
    throw error;
  }
}

/**
 * Creates a new server
 */
export async function createServer(serverData: CreateServerCommand, supabaseClient: SupabaseClient): Promise<Server> {
  try {
    // Convert camelCase to snake_case for database
    const dbData = {
      id: serverData.id,
      name: serverData.name,
      icon_url: serverData.iconUrl,
      config: serverData.config,
      active: true, // Default to active
    };

    const { data, error } = await supabaseClient
      .from("servers")
      .insert(dbData)
      .select("id, name, active, config, icon_url")
      .single();

    if (error) throw error;

    // Convert back to camelCase
    return {
      id: data.id,
      name: data.name,
      active: data.active,
      config: data.config,
      iconUrl: data.icon_url,
    };
  } catch (error) {
    console.error("Error creating server:", error);
    throw error;
  }
}

/**
 * Updates an existing server
 */
export async function updateServer(
  serverId: string | number,
  serverData: UpdateServerCommand,
  supabaseClient: SupabaseClient
): Promise<Server> {
  try {
    // Convert camelCase to snake_case for database
    const dbData: Record<string, any> = {};

    if (serverData.name !== undefined) dbData.name = serverData.name;
    if (serverData.iconUrl !== undefined) dbData.icon_url = serverData.iconUrl;
    if (serverData.config !== undefined) dbData.config = serverData.config;
    if (serverData.active !== undefined) dbData.active = serverData.active;

    const { data, error } = await supabaseClient
      .from("servers")
      .update(dbData)
      .eq("id", serverId)
      .select("id, name, active, config, icon_url")
      .single();

    if (error) throw error;

    // Convert back to camelCase
    return {
      id: data.id,
      name: data.name,
      active: data.active,
      config: data.config,
      iconUrl: data.icon_url,
    };
  } catch (error) {
    console.error(`Error updating server ${serverId}:`, error);
    throw error;
  }
}
