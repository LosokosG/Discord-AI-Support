import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

export const prerender = false;

/**
 * API endpoint to handle the callback after a Discord bot has been added to a server
 * This saves the server to the database
 */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    console.log("📢 [api/auth/bot-added] Processing bot addition callback");

    // Get URL parameters from Discord callback
    const url = new URL(request.url);
    const guild_id = url.searchParams.get("guild_id");
    const guild_name = url.searchParams.get("guild_name");
    const guild_icon = url.searchParams.get("guild_icon");

    // Check if required parameters are present
    if (!guild_id || !guild_name) {
      console.error("📢 [api/auth/bot-added] Missing required parameters", { guild_id, guild_name });
      return new Response(JSON.stringify({ error: "Missing required parameters" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create Supabase client
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Get user session
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      console.error("📢 [api/auth/bot-added] User not authenticated");
      return redirect("/auth/login");
    }

    console.log("📢 [api/auth/bot-added] Attempting to create server in database", { guild_id, guild_name });

    // Construct icon URL if icon is available
    const iconUrl = guild_icon ? `https://cdn.discordapp.com/icons/${guild_id}/${guild_icon}.png` : null;

    // Create the server in our database
    try {
      const response = await fetch(`${url.origin}/api/servers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Forward authorization headers
          Authorization: request.headers.get("Authorization") || `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          id: guild_id,
          name: guild_name,
          iconUrl: iconUrl,
          config: {
            language: "en",
            welcomeMessage: "Hello! I'm a support bot ready to help you.",
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // If server already exists, that's fine, just continue to the dashboard
        if (response.status === 409) {
          console.log("📢 [api/auth/bot-added] Server already exists, redirecting to dashboard");
        } else {
          console.error("📢 [api/auth/bot-added] Error creating server", result);
          // Still redirect to dashboard even if there's an error
        }
      } else {
        console.log("📢 [api/auth/bot-added] Server created successfully", result);
      }

      // Redirect to the server dashboard
      return redirect(`/dashboard/servers/${guild_id}`);
    } catch (error) {
      console.error("📢 [api/auth/bot-added] Error creating server:", error);
      return new Response(JSON.stringify({ error: "Internal server error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("📢 [api/auth/bot-added] Unexpected error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
