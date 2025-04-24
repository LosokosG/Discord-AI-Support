import { defineMiddleware } from "astro:middleware";
import { createClient } from "@supabase/supabase-js";

const MOCK_USER_ID = "b0d9e154-f13a-468a-abf3-e2e2db9b6f22";

export const onRequest = defineMiddleware(async (context, next) => {
  // Make sure these values exist in your .env file
  const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
  const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;

  // Only create client if configuration exists
  if (supabaseUrl && supabaseKey) {
    // Create Supabase client with admin rights to bypass RLS for testing
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        // Use custom header to identify mock user for RLS policies
        headers: {
          "X-Mock-User-Id": MOCK_USER_ID,
        },
      },
    });

    context.locals.supabase = supabase;

    // TEMPORARY BYPASS: Mock authenticated user for testing
    // Remove this in production and implement proper Discord OAuth
    // Add mock user to locals for testing
    (context.locals as { user?: { id: string; discord_id: string; discord_username: string; role?: string } }).user = {
      id: MOCK_USER_ID,
      discord_id: "123456789012345678",
      discord_username: "test_user",
      role: "admin",
    };

    console.log("TESTING MODE: Authentication bypassed with mock user ID:", MOCK_USER_ID);
  } else {
    console.error("Missing Supabase configuration. Check your .env file.");
  }

  return next();
});
