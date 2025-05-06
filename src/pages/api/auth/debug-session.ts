import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

// Define a type for cookie debug information
interface CookieDebugInfo {
  name?: string;
  value?: string;
  error?: string;
}

export const GET: APIRoute = async ({ request, cookies }) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // Pobierz informacje o sesji i użytkowniku
  const sessionResponse = await supabase.auth.getSession();
  const userResponse = await supabase.auth.getUser();

  // Pobierz wszystkie cookies
  let cookiesDebug: CookieDebugInfo[] = [];
  try {
    const cookieHeader = request.headers.get("cookie");
    if (cookieHeader) {
      cookiesDebug = cookieHeader.split(";").map((cookie) => {
        const [name, value] = cookie.trim().split("=");
        // Pokaż pełną wartość dla cookies związanych z sesją Supabase
        if (name.includes("supabase")) {
          return { name, value };
        }
        return {
          name,
          value: value ? value.substring(0, 10) + "..." : "[no value]",
        };
      });
    }
  } catch {
    cookiesDebug = [{ error: "Nie można odczytać cookies" }];
  }

  // Pobierz informacje o zmiennych środowiskowych
  const envInfo = {
    PUBLIC_SUPABASE_URL: import.meta.env.PUBLIC_SUPABASE_URL ? "Defined" : "Missing",
    PUBLIC_SUPABASE_ANON_KEY: import.meta.env.PUBLIC_SUPABASE_ANON_KEY ? "Defined" : "Missing",
    DISCORD_CLIENT_ID: import.meta.env.DISCORD_CLIENT_ID ? "Defined" : "Missing",
    DISCORD_SECRET: import.meta.env.DISCORD_SECRET ? "Defined" : "Missing",
    DISCORD_REDIRECT_URI: import.meta.env.DISCORD_REDIRECT_URI || "Not defined",
  };

  // Przygotuj odpowiedź z informacjami debugowymi
  const debugInfo = {
    session: {
      exists: !!sessionResponse.data.session,
      expires_at: sessionResponse.data.session?.expires_at,
      token_type: sessionResponse.data.session?.token_type,
    },
    user: userResponse.data.user
      ? {
          id: userResponse.data.user.id,
          email: userResponse.data.user.email,
          lastSignIn: userResponse.data.user.last_sign_in_at,
          metadata: userResponse.data.user.user_metadata,
          providerIds: userResponse.data.user.identities?.map((id) => id.provider) || [],
        }
      : null,
    cookies: cookiesDebug,
    headers: Object.fromEntries(
      [...request.headers.entries()]
        .filter(([key]) => !["cookie", "authorization"].includes(key.toLowerCase()))
        .map(([key, value]) => [key, typeof value === "string" ? value.substring(0, 30) + "..." : "[complex value]"])
    ),
    environment: envInfo,
  };

  return new Response(JSON.stringify(debugInfo, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
