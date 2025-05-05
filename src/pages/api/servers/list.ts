import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";
import { supabaseClient } from "../../../db/supabase.client";

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
  }[];
}

// Uprawnienie ADMINISTRATOR w Discord to 1 << 3 (8)
const ADMIN_PERMISSION = BigInt(1 << 3);

export const GET: APIRoute = async ({ cookies, request }) => {
  console.log("📢 [api/servers/list] Pobieranie listy serwerów użytkownika");

  try {
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Pobierz sesję użytkownika
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError || !session) {
      console.error("📢 [api/servers/list] Błąd pobierania sesji:", sessionError?.message || "Brak sesji");
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
      console.error("📢 [api/servers/list] Brak tokenu Discord");
      return new Response(JSON.stringify({ error: "No Discord token available" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log("📢 [api/servers/list] Pobieranie listy serwerów z Discord API");

    // Pobierz listę serwerów użytkownika z API Discord
    const discordResponse = await fetch("https://discord.com/api/users/@me/guilds", {
      headers: {
        Authorization: `Bearer ${providerToken}`,
      },
    });

    if (!discordResponse.ok) {
      console.error("📢 [api/servers/list] Błąd Discord API:", await discordResponse.text());
      return new Response(JSON.stringify({ error: "Failed to fetch Discord servers" }), {
        status: discordResponse.status,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    const discordGuilds = (await discordResponse.json()) as DiscordGuild[];
    console.log(`📢 [api/servers/list] Pobrano ${discordGuilds.length} serwerów z Discord API`);

    // Filtruj serwery, na których użytkownik ma uprawnienia administratora
    const adminGuilds = discordGuilds.filter((guild) => {
      const permissions = BigInt(guild.permissions);
      return (permissions & ADMIN_PERMISSION) === ADMIN_PERMISSION;
    });

    console.log(`📢 [api/servers/list] Znaleziono ${adminGuilds.length} serwerów z uprawnieniami administratora`);

    // Pobierz z bazy danych serwery, na których jest zainstalowany bot
    const { data: botServers, error: dbError } = await supabaseClient
      .from("servers")
      .select("id, name, icon_url, active")
      .in(
        "id",
        adminGuilds.map((guild) => guild.id)
      );

    if (dbError) {
      console.error("📢 [api/servers/list] Błąd bazy danych:", dbError.message);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    console.log(`📢 [api/servers/list] Znaleziono ${botServers?.length || 0} serwerów w bazie danych`);

    // Utwórz mapę serwerów z bazy danych dla łatwiejszego dostępu
    const botServersMap = new Map(botServers?.map((server) => [server.id, server]) || []);

    // Przygotuj odpowiedź zawierającą połączone dane
    const serverList: ServerListResponse = {
      guilds: adminGuilds.map((guild) => {
        const botServer = botServersMap.get(guild.id);
        const iconUrl = guild.icon ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png` : null;

        return {
          id: guild.id,
          name: guild.name,
          icon_url: iconUrl,
          permissions: guild.permissions,
          has_bot: !!botServer,
          is_admin: true, // Wszystkie serwery w tej liście mają już administratora
        };
      }),
    };

    console.log(`📢 [api/servers/list] Zwracanie ${serverList.guilds.length} serwerów`);

    return new Response(JSON.stringify(serverList), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("📢 [api/servers/list] Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
