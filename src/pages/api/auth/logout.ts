import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

export const POST: APIRoute = async ({ cookies, request, redirect }) => {
  console.log("📢 [api/auth/logout] Rozpoczynam proces wylogowania");

  try {
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    // Wylogowanie użytkownika
    const { error } = await supabase.auth.signOut({ scope: "global" });

    if (error) {
      console.error("📢 [api/auth/logout] Błąd podczas wylogowywania:", error.message);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }

    // Ręczne czyszczenie ciasteczek Supabase
    const supabaseCookies = ["sb-access-token", "sb-refresh-token", "sb-auth-token"];
    supabaseCookies.forEach((name) => {
      cookies.delete(name, { path: "/" });
    });

    console.log("📢 [api/auth/logout] Użytkownik został wylogowany pomyślnie");

    // Przekierowanie na stronę główną po wylogowaniu
    return redirect("/");
  } catch (error) {
    console.error("📢 [api/auth/logout] Nieoczekiwany błąd:", error);
    return new Response(JSON.stringify({ error: "Wystąpił nieoczekiwany błąd podczas wylogowywania" }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
