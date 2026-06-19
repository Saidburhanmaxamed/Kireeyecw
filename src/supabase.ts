import { createClient } from "@supabase/supabase-js";

// Supabase browser client with safe fallback defaults provided by the user
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || "https://slfrjuherxhychvmljll.supabase.co";
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "sb_publishable_ZjEu1jPwiMY9LP31rawY2g_L1OSvTAJ";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
