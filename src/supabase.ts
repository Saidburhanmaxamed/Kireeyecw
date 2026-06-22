import { createClient } from "@supabase/supabase-js";

const DEFAULT_SUPABASE_URL = "https://hulfsiejwwvqaheaifkh.supabase.co";
const DEFAULT_SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh1bGZzaWVqd3d2cWFoZWFpZmtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIwODc2MDYsImV4cCI6MjA5NzY2MzYwNn0.zXaHrC9ueYzu1XDxyBHPiI_0OGKtnoTX5jXwhwyDoNY";

function cleanUrl(url: any): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.includes("google.com/url?") && trimmed.includes("q=")) {
    try {
      const urlObj = new URL(trimmed);
      const q = urlObj.searchParams.get("q");
      if (q && (q.startsWith("http://") || q.startsWith("https://"))) {
        return q;
      }
    } catch (e) {}
  }
  return trimmed;
}

function getValidSupabaseUrl(): string {
  const envVal = (import.meta as any).env?.VITE_SUPABASE_URL;
  const cleanedEnv = cleanUrl(envVal);
  if (cleanedEnv && (cleanedEnv.startsWith("http://") || cleanedEnv.startsWith("https://"))) {
    return cleanedEnv;
  }
  return DEFAULT_SUPABASE_URL;
}

function getValidSupabaseKey(): string {
  const envKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;
  if (envKey && typeof envKey === "string" && envKey.trim().length > 30 && envKey.includes(".")) {
    return envKey.trim();
  }
  return DEFAULT_SUPABASE_ANON_KEY;
}

const supabaseUrl = getValidSupabaseUrl();
const supabaseAnonKey = getValidSupabaseKey();

let supabaseInstance;
try {
  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
} catch (e) {
  console.error("[Supabase Client] Failed to create client with configuration, using defaults:", e);
  supabaseInstance = createClient(DEFAULT_SUPABASE_URL, DEFAULT_SUPABASE_ANON_KEY);
}

export const supabase = supabaseInstance;
