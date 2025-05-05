/// <reference types="astro/client" />

import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./db/database.types.ts";

declare global {
  namespace App {
    interface Locals {
      supabase: SupabaseClient<Database>;
      user?: {
        id: string;
        email?: string;
        discord_id?: string;
        discord_username?: string;
        role?: string;
      };
    }
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_SUPABASE_URL: string;
  readonly PUBLIC_SUPABASE_ANON_KEY: string;
  readonly DISCORD_CLIENT_ID: string;
  readonly DISCORD_SECRET: string;
  readonly DISCORD_TOKEN: string;
  readonly OPENROUTER_API_KEY: string;
  readonly PUBLIC_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
