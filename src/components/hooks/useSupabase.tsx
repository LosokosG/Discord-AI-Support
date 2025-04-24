import { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

export function useSupabase() {
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    // In Astro components with client:load/client:visible,
    // Supabase instance is already available in the window
    if (window.supabaseClient) {
      setSupabase(window.supabaseClient);
    }
  }, []);

  return supabase;
}

// Declare global window property for TypeScript
declare global {
  interface Window {
    supabaseClient: SupabaseClient;
  }
}
