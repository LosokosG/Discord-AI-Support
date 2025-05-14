import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  features: string[];
}

interface ServerListResponse {
  guilds: {
    id: string;
    name: string;
    icon_url: string | null;
    permissions: string;
    has_bot: boolean;
    is_admin: boolean;
    active: boolean;
  }[];
}

// Discord ADMINISTRATOR permission is 1 << 3 (8)
const ADMIN_PERMISSION = BigInt(1 << 3);

/**
 * GET handler for /api/servers/list
 * Returns a list of Discord servers the authenticated user is an admin for
 */
export const GET: APIRoute = async ({ cookies, request }) => {
  console.log("📢 [api/servers/list] Fetching user's server list");

  try {
    // Create Supabase instance
    console.log("📢 [api/servers/list] Creating Supabase instance");
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Use Supabase auth to get the Discord access token
    console.log("📢 [api/servers/list] Getting user session");
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("📢 [api/servers/list] Session error:", sessionError);
      return new Response(
        JSON.stringify({
          error: { message: "Authentication error: " + sessionError.message },
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("📢 [api/servers/list] Session obtained:", {
      hasSession: !!session,
      hasProviderToken: !!session?.provider_token,
      provider: session?.provider_token ? "available" : "missing",
    });

    if (!session?.provider_token) {
      console.error("📢 [api/servers/list] No provider token available");
      return new Response(
        JSON.stringify({
          error: { message: "Authentication required. Please log in with Discord." },
        }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    // Get user's Discord guilds using the OAuth token
    console.log("📢 [api/servers/list] Fetching Discord guilds with token");
    const discordResponse = await fetch("https://discord.com/api/v10/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${session.provider_token}`,
      },
    });

    console.log("📢 [api/servers/list] Discord API response status:", discordResponse.status);

    if (!discordResponse.ok) {
      console.error(`📢 [api/servers/list] Discord API error: ${discordResponse.status} ${discordResponse.statusText}`);

      // Log response body for debugging
      try {
        const errorBody = await discordResponse.text();
        console.error("📢 [api/servers/list] Discord API error body:", errorBody);
      } catch (e) {
        console.error("📢 [api/servers/list] Couldn't read error body:", e);
      }

      if (discordResponse.status === 401) {
        return new Response(
          JSON.stringify({
            error: { message: "Discord session expired. Please log in again." },
          }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({
          error: { message: "Failed to fetch your Discord servers" },
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Parse the response as guild array
    const responseText = await discordResponse.text();
    console.log("📢 [api/servers/list] Discord API response body:", responseText);

    const userGuilds = JSON.parse(responseText) as DiscordGuild[];
    console.log(`📢 [api/servers/list] User has ${userGuilds.length} Discord servers`);

    // Get admin guilds (servers user has ADMINISTRATOR permission)
    const adminGuilds = userGuilds.filter((guild) => {
      try {
        // Parse permission string as bigint
        const permissions = BigInt(guild.permissions);

        // Check if the user has the ADMINISTRATOR permission
        return (permissions & ADMIN_PERMISSION) === ADMIN_PERMISSION;
      } catch (err) {
        console.error(`📢 [api/servers/list] Error parsing permissions for server ${guild.id}:`, err);
        return false;
      }
    });

    console.log(`📢 [api/servers/list] User has admin access to ${adminGuilds.length} servers`);

    // Get bot servers from the database
    console.log("📢 [api/servers/list] Fetching bot servers from database");
    const { data: botServers, error } = await supabase.from("servers").select("id, name, icon_url, active");

    if (error) {
      console.error("📢 [api/servers/list] Database error:", error);
      return new Response(
        JSON.stringify({
          error: { message: "Failed to fetch bot servers from database" },
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Log active statuses for debugging
    console.log("📢 [api/servers/list] Bot servers active status:");
    console.log("📢 [api/servers/list] Total bot servers found:", botServers.length);
    botServers.forEach((server) => {
      console.log(`Server ${server.name} (${server.id}): active=${server.active}`);
    });

    // For each admin guild, create a response object with additional info
    const guilds = adminGuilds.map((guild) => {
      // Get the Discord CDN URL for the guild icon if it exists
      let iconUrl = null;
      if (guild.icon) {
        iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`;
      }

      // Find if the bot is installed on this server
      const botServer = botServers.find((server) => server.id === guild.id);

      // Return the guild info with added "has_bot" flag
      return {
        id: guild.id,
        name: guild.name,
        icon_url: iconUrl,
        permissions: guild.permissions,
        has_bot: !!botServer,
        is_admin: true, // All servers in this list already have admin permissions
        active: botServer ? botServer.active : false,
      };
    });

    console.log(`📢 [api/servers/list] Returning ${guilds.length} servers to client`);

    // Return servers list with has_bot flag, sorted by has_bot first
    const sortedGuilds = guilds.sort((a, b) => {
      // Sort by has_bot first (active servers first)
      if (a.has_bot && a.active && (!b.has_bot || !b.active)) return -1;
      if ((!a.has_bot || !a.active) && b.has_bot && b.active) return 1;

      // Then sort by has_bot (even if inactive)
      if (a.has_bot && !b.has_bot) return -1;
      if (!a.has_bot && b.has_bot) return 1;

      // Lastly sort by name
      return a.name.localeCompare(b.name);
    });

    return new Response(JSON.stringify({ guilds: sortedGuilds } as ServerListResponse), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("📢 [api/servers/list] Unexpected error:", error);
    // Log the full error stack trace for debugging
    if (error instanceof Error) {
      console.error("📢 [api/servers/list] Error stack:", error.stack);
    }

    return new Response(
      JSON.stringify({
        error: { message: "An unexpected error occurred" },
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
