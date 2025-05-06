import type { AstroCookies } from "astro";
import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { Database } from "./database.types";

// Configure cookie options according to best practices
export const cookieOptions: CookieOptionsWithName = {
  name: "sb-auth-token",
  path: "/",
  secure: false, // Set to false for development, true for production
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7, // 1 week
};

// Function to parse cookie header string into expected format for Supabase
function parseCookieHeader(cookieHeader: string): { name: string; value: string }[] {
  if (!cookieHeader) return [];

  return cookieHeader.split(";").map((cookie) => {
    const [name, ...rest] = cookie.trim().split("=");
    return { name, value: rest.join("=") };
  });
}

// Create a server-side Supabase client with proper cookie handling
export const createSupabaseServerInstance = (context: { headers: Headers; cookies: AstroCookies }) => {
  console.log("📢 [supabase.server] Creating Supabase server instance");
  console.log("📢 [supabase.server] Environment variables check:", {
    PUBLIC_SUPABASE_URL: !!import.meta.env.PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY: !!import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  });

  // Get cookie header for logging
  const cookieHeader = context.headers.get("Cookie") || "";
  console.log("📢 [supabase.server] Cookie header length:", cookieHeader.length);

  // Check for presence of Supabase auth cookies
  const hasSbAuthCookie = cookieHeader.includes("sb-");
  console.log("📢 [supabase.server] Has Supabase auth cookie:", hasSbAuthCookie);

  // Create the Supabase client with proper cookie handling
  const supabase = createServerClient<Database>(
    import.meta.env.PUBLIC_SUPABASE_URL,
    import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
    {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce", // Use PKCE flow for OAuth
      },
      cookies: {
        // IMPORTANT: Using ONLY getAll and setAll for cookie management
        // as recommended in the documentation
        getAll() {
          const cookies = parseCookieHeader(cookieHeader);
          console.log("📢 [supabase.server] getAll cookies count:", cookies.length);
          // Log Supabase-related cookies for debugging
          const sbCookies = cookies.filter((c) => c.name.startsWith("sb-"));
          console.log("📢 [supabase.server] Supabase cookies:", sbCookies.map((c) => c.name).join(", ") || "none");
          return cookies;
        },
        setAll(cookiesToSet) {
          console.log("📢 [supabase.server] setAll cookies count:", cookiesToSet.length);
          cookiesToSet.forEach(({ name, value, options }) => {
            console.log(`📢 [supabase.server] Setting cookie: ${name}`);
            // Force correct options for cookies
            const mergedOptions = {
              ...options,
              path: "/",
              httpOnly: true,
              secure: false, // Set to false for development, true for production
              sameSite: "lax" as const,
              maxAge: 60 * 60 * 24 * 7, // 1 week
            };
            context.cookies.set(name, value, mergedOptions);
          });
        },
      },
    }
  );

  return supabase;
};
