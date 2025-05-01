import { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Custom hook to access the Supabase client in React components
 *
 * This hook uses the client-side only window object and astro's injected
 * Supabase client that's available after hydration.
 */
export function useSupabase() {
  const [client, setClient] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window !== "undefined") {
      // @ts-ignore - Astro injects this into the window object during hydration
      const supabase = window.supabase;

      if (supabase) {
        setClient(supabase);
      } else {
        console.error("Supabase client not found on window object");
      }
    }
  }, []);

  return client;
}
