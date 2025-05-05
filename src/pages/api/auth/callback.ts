import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

export const prerender = false;

// Ten endpoint będzie używany jako lokalny callback, gdy Discord przekieruje użytkownika po zalogowaniu
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url);
  console.log("📢 [api/auth/callback] Callback URL:", requestUrl.toString());

  // Get all query parameters for debugging
  const params = Object.fromEntries(requestUrl.searchParams);
  console.log("📢 [api/auth/callback] Query parameters:", JSON.stringify(params));

  const code = requestUrl.searchParams.get("code");
  const error = requestUrl.searchParams.get("error");
  const errorDescription = requestUrl.searchParams.get("error_description");

  console.log("📢 [api/auth/callback] Otrzymany kod autoryzacyjny:", code ? "Tak (otrzymano kod)" : "Nie (brak kodu)");

  // Log cookie header for debugging
  const cookieHeader = request.headers.get("cookie") || "";
  console.log("📢 [api/auth/callback] Cookie header length:", cookieHeader.length);
  console.log("📢 [api/auth/callback] Has Supabase cookies:", cookieHeader.includes("sb-"));

  // Jeśli otrzymano błąd z Discord OAuth
  if (error) {
    console.error("📢 [api/auth/callback] Błąd OAuth:", error, errorDescription);
    return redirect(`/auth/login?error=${encodeURIComponent(errorDescription || error)}`);
  }

  // Jeśli nie ma kodu, przekieruj na stronę logowania z błędem
  if (!code) {
    console.log("📢 [api/auth/callback] Brak kodu, przekierowuję do logowania");
    return redirect("/auth/login?error=no_code");
  }

  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  try {
    console.log("📢 [api/auth/callback] Próba wymiany kodu na sesję");

    // Check for PKCE verifier cookie - this is essential
    const verifierCookie = parseCookies(cookieHeader).find((c) => c.name.includes("code-verifier"));
    if (!verifierCookie) {
      console.error("📢 [api/auth/callback] Brak ciasteczka code-verifier, sesja nie może być utworzona");
      return redirect("/auth/login?error=missing_verifier");
    }
    console.log("📢 [api/auth/callback] Code verifier cookie found:", verifierCookie.name);

    // Wymień kod na sesję
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("📢 [api/auth/callback] Błąd wymiany kodu:", error);
      return redirect(`/auth/login?error=${encodeURIComponent(error.message)}`);
    }

    console.log("📢 [api/auth/callback] Code exchange successful, session:", data?.session ? "Obecna" : "Brak");

    if (!data.session) {
      console.error("📢 [api/auth/callback] Session was not created during code exchange");
      return redirect("/auth/login?error=session_creation_failed");
    }

    // Log user details
    console.log("📢 [api/auth/callback] User logged in:", {
      id: data.user?.id,
      email: data.user?.email,
      provider: data.user?.app_metadata?.provider,
    });

    // Sprawdźmy jeszcze raz sesję po wymianie kodu
    const { data: sessionData } = await supabase.auth.getSession();
    console.log(
      "📢 [api/auth/callback] Post-verification session check:",
      sessionData.session ? "Session exists" : "No session found"
    );

    // Check cookies after session exchange
    const afterCookieHeader = request.headers.get("cookie") || "";
    const afterCookies = parseCookies(afterCookieHeader);
    console.log("📢 [api/auth/callback] Cookies after exchange:", afterCookies.map((c) => c.name).join(", "));

    // Po udanym zalogowaniu, przekieruj do dashboardu
    console.log("📢 [api/auth/callback] Przekierowuję do /dashboard");
    return redirect("/dashboard");
  } catch (error) {
    console.error("📢 [api/auth/callback] Error during code exchange:", error);
    return redirect("/auth/login?error=auth_error");
  }
};

// Helper function to parse cookies
function parseCookies(cookieHeader: string): { name: string; value: string }[] {
  if (!cookieHeader) return [];
  return cookieHeader.split(";").map((cookie) => {
    const parts = cookie.trim().split("=");
    return {
      name: parts[0],
      value: parts.slice(1).join("="),
    };
  });
}
