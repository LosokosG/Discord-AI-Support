import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
}

export const GET: APIRoute = async ({ cookies, request }) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // Pobierz aktualną sesję użytkownika
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  // Pobierz token dostępu Discord z sesji
  const providerToken = session.provider_token;

  if (!providerToken) {
    return new Response(JSON.stringify({ error: "No Discord token available" }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  try {
    // Pobierz listę serwerów użytkownika z API Discord
    const response = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${providerToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Discord API error: ${response.statusText}`);
    }

    const guilds: DiscordGuild[] = await response.json();

    // Filtruj serwery, na których użytkownik ma uprawnienia administratora
    const adminGuilds = guilds.filter((guild: DiscordGuild) => {
      const permissions = BigInt(guild.permissions);
      const adminPermission = BigInt(1 << 3); // ADMINISTRATOR permission
      return (permissions & adminPermission) === adminPermission;
    });

    // W przyszłości możemy dodać sprawdzenie, na których serwerach jest już zainstalowany bot

    return new Response(JSON.stringify({ guilds: adminGuilds }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error fetching Discord guilds:", error);
    return new Response(JSON.stringify({ error: "Failed to fetch Discord servers" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
