import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

export const prerender = false;

/**
 * This custom callback handler helps fix issues with Supabase's OAuth flow.
 * It serves as a bridge between the Supabase auth callback and our dashboard.
 */
export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const requestUrl = new URL(request.url);
  console.log("📢 [api/auth/custom-callback] Callback URL:", requestUrl.toString());

  // Get all query parameters for debugging
  const params = Object.fromEntries(requestUrl.searchParams);
  console.log("📢 [api/auth/custom-callback] Query parameters:", JSON.stringify(params));

  // Extract the hash fragment if present (Supabase sometimes appends data as URL hash)
  const hashParams = new URLSearchParams(requestUrl.hash?.substring(1) || "");
  const accessToken = hashParams.get("access_token");
  const refreshToken = hashParams.get("refresh_token");

  if (accessToken && refreshToken) {
    console.log("📢 [api/auth/custom-callback] Tokens found in URL hash fragment");

    // Create a supabase client
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    try {
      // Set the session using the tokens
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });

      if (error) {
        console.error("📢 [api/auth/custom-callback] Error setting session:", error);
        return redirect("/auth/login?error=session_creation_failed");
      }

      console.log("📢 [api/auth/custom-callback] Session set successfully");
      console.log("📢 [api/auth/custom-callback] User:", data.user?.id);

      // Redirect to dashboard
      return redirect("/dashboard");
    } catch (error) {
      console.error("📢 [api/auth/custom-callback] Error:", error);
      return redirect("/auth/login?error=unexpected_error");
    }
  }

  // Handle standard code exchange flow
  const code = requestUrl.searchParams.get("code");
  if (code) {
    console.log("📢 [api/auth/custom-callback] Auth code found in URL params");

    // Create a supabase client
    const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

    try {
      // Exchange code for session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (error) {
        console.error("📢 [api/auth/custom-callback] Error exchanging code:", error);
        return redirect("/auth/login?error=code_exchange_failed");
      }

      console.log("📢 [api/auth/custom-callback] Code exchange successful");
      console.log("📢 [api/auth/custom-callback] Session created:", !!data.session);

      // Redirect to dashboard
      return redirect("/dashboard");
    } catch (error) {
      console.error("📢 [api/auth/custom-callback] Error:", error);
      return redirect("/auth/login?error=unexpected_error");
    }
  }

  // If we don't have tokens or code, redirect to login
  console.log("📢 [api/auth/custom-callback] No tokens or code found");
  return redirect("/auth/login?error=missing_auth_params");
};
