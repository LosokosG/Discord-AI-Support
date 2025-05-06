import { useState, useEffect } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";

// Extend Window interface to include supabase property
declare global {
  interface Window {
    supabase: SupabaseClient;
  }
}

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
