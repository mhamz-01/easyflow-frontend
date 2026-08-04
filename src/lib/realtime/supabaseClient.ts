import { createClient } from "@supabase/supabase-js";

// Auth is bridged from Clerk, not Supabase Auth: the Clerk dashboard has a
// JWT template for Supabase, and the Supabase project has Clerk registered
// as a third-party auth provider (see supabase/chat-realtime-setup.sql for
// the RLS side of this). Once that's wired up, Supabase verifies the Clerk
// session token itself — this client never talks to Supabase Auth directly.
declare global {
  interface Window {
    Clerk?: {
      session?: {
        getToken: (options?: { template?: string }) => Promise<string | null>;
      } | null;
    };
  }
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

let client: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      "NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY are not set",
    );
  }

  if (!client) {
    client = createClient(supabaseUrl, supabaseAnonKey, {
      accessToken: async () => {
        if (typeof window === "undefined") return null;
        return (await window.Clerk?.session?.getToken()) ?? null;
      },
    });
  }

  return client;
}
