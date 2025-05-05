/* eslint-disable no-console */
import { defineMiddleware } from "astro:middleware";
import { createSupabaseServerInstance } from "../db/supabase.server";

// Ścieżki publiczne - endpointy API Auth i strony renderowane na serwerze
const PUBLIC_PATHS = [
  // Publiczne strony Astro renderowane na serwerze
  "/",
  "/login",
  "/auth/login",
  "/auth/callback",
  "/debug-session",
  // Endpointy API Auth
  "/api/auth/login",
  "/api/auth/callback",
  "/api/auth/custom-callback",
  "/api/auth/logout",
  "/api/auth/me",
  "/api/auth/debug-session",
];

export const onRequest = defineMiddleware(async ({ locals, cookies, url, request, redirect }, next) => {
  // Log the URL to help debug
  console.log(`${new Date().toISOString().split("T")[1]} [REQUEST] ${request.method} ${url.pathname}`);

  // Debug cookies
  try {
    console.log("📢 [middleware] Cookies dostępne:", cookies.toString());
  } catch (error) {
    console.log("📢 [middleware] Błąd wypisywania cookies:", error);
  }

  // Check if the current path is in the public paths list
  const isPublicPath = PUBLIC_PATHS.some((path) => url.pathname === path || url.pathname.endsWith(path + "/"));

  if (isPublicPath) {
    console.log("📢 [middleware] Ścieżka publiczna, pomijam sprawdzanie autentykacji");
    return next();
  }

  const supabase = createSupabaseServerInstance({
    cookies,
    headers: request.headers,
  });

  // Dodajemy instancję Supabase do locals
  locals.supabase = supabase;

  // WAŻNE: Zawsze najpierw pobierz sesję użytkownika przed innymi operacjami
  const userResponse = await supabase.auth.getUser();
  const sessionResponse = await supabase.auth.getSession();
  const user = userResponse.data.user;
  const session = sessionResponse.data.session;

  console.log("📢 [middleware] Sesja:", session ? "Istnieje" : "Brak");
  console.log("📢 [middleware] Użytkownik:", user ? `ID: ${user.id}` : "Niezalogowany");

  if (user) {
    console.log("📢 [middleware] Szczegóły użytkownika:", {
      email: user.email,
      id: user.id,
      metadata: user.user_metadata,
    });

    // Zapisujemy dane użytkownika w locals
    locals.user = {
      id: user.id,
      email: user.email || undefined,
      discord_id: user.user_metadata?.discord_id,
      discord_username: user.user_metadata?.full_name || user.user_metadata?.name,
    };

    // Dla zalogowanych użytkowników pozwalamy na dostęp do dashboardu
    if (url.pathname.startsWith("/dashboard")) {
      console.log("📢 [middleware] Pozwalam na dostęp do dashboardu dla zalogowanego użytkownika");
      return next();
    }

    return next();
  } else {
    // Przekierowanie do logowania dla chronionych ścieżek
    console.log("📢 [middleware] Brak zalogowanego użytkownika, przekierowuję do logowania");
    return redirect("/auth/login");
  }
});
