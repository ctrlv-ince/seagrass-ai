import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
    supabaseAnonKey &&
    !supabaseUrl.includes("placeholder-project") &&
    supabaseUrl.startsWith("http")
);

// Fallback dummy URL to prevent createClient crash if env vars are missing
const validUrl = isSupabaseConfigured
  ? supabaseUrl
  : "https://placeholder-project.supabase.co";
const validKey = isSupabaseConfigured ? supabaseAnonKey : "placeholder-anon-key";

export const supabase = createClient(validUrl, validKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});
