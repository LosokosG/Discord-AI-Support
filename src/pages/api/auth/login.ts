import type { APIRoute } from "astro";
import { createSupabaseServerInstance } from "../../../db/supabase.server";

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const supabase = createSupabaseServerInstance({ cookies, headers: request.headers });

  // Construct the callback URL based on the current request
  const baseUrl = new URL(request.url).origin;
  // Use our custom callback endpoint, NOT Supabase's internal endpoint
  const redirectTo = `${baseUrl}/api/auth/custom-callback`;

  console.log("📢 [api/auth/login] Rozpoczynam logowanie z OAuth Discord");
  console.log("📢 [api/auth/login] Przekierowanie po autoryzacji:", redirectTo);

  // Inicjujemy proces OAuth
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "discord",
    options: {
      redirectTo,
      scopes: "identify email guilds",
      skipBrowserRedirect: false, // Ensure we don't skip the automatic redirect
    },
  });

  if (error) {
    console.error("📢 [api/auth/login] Błąd OAuth:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

  console.log("📢 [api/auth/login] Przekierowuję do URL autoryzacji Discord:", data.url);

  // Przekierowanie do URL autoryzacji Discord
  return redirect(data.url);
};
