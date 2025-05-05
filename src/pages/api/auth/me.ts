import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

export const GET: APIRoute = async ({ request, cookies }) => {
  console.log("📢 [api/auth/me] Pobieranie danych zalogowanego użytkownika");

  try {
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Pobierz dane użytkownika
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error) {
      console.error("📢 [api/auth/me] Błąd podczas pobierania danych użytkownika:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    if (!user) {
      console.log("📢 [api/auth/me] Użytkownik nie jest zalogowany");
      return new Response(JSON.stringify({ error: "Użytkownik nie jest zalogowany" }), {
        status: 401,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Przygotuj dane użytkownika do zwrócenia
    const userData = {
      id: user.id,
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      username:
        user.user_metadata?.full_name || user.user_metadata?.name || user.user_metadata?.custom_claims?.global_name,
      discord_id: user.user_metadata?.provider_id,
    };

    console.log("📢 [api/auth/me] Pomyślnie pobrano dane użytkownika:", user.id);

    return new Response(JSON.stringify(userData), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("📢 [api/auth/me] Nieoczekiwany błąd:", error);
    return new Response(
      JSON.stringify({ error: "Wystąpił nieoczekiwany błąd podczas pobierania danych użytkownika" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};
