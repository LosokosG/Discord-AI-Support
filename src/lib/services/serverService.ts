import { supabaseClient } from "@/db/supabase.client";

/**
 * Server interface matching database schema
 */
export interface ServerData {
  id: string;
  name: string;
  active: boolean;
  icon_url: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  config?: any;
  created_at: string;
}

/**
 * Fetch a server by ID from the database
 */
export async function getServerById(id: string): Promise<ServerData | null> {
  if (!id) return null;

  try {
    console.log(`Fetching server with ID: ${id} from database`);
    const { data, error } = await supabaseClient
      .from("servers")
      .select("id, name, icon_url, active, config, created_at")
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching server from database:", error);
      return null;
    }

    if (!data) {
      console.warn(`No server found with ID: ${id}`);
      return null;
    }

    console.log("Server data from database:", data);
    return data as ServerData;
  } catch (err) {
    console.error("Failed to fetch server:", err);
    return null;
  }
}

/**
 * Fetch all servers from the database
 */
export async function getAllServers(): Promise<ServerData[]> {
  try {
    const { data, error } = await supabaseClient
      .from("servers")
      .select("id, name, icon_url, active, config, created_at")
      .order("name");

    if (error) {
      console.error("Error fetching servers:", error);
      return [];
    }

    return (data || []) as ServerData[];
  } catch (err) {
    console.error("Failed to fetch servers:", err);
    return [];
  }
}
