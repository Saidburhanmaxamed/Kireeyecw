import { createClient } from "@supabase/supabase-js";

function sanitizeUrl(url: any): string {
  if (typeof url !== 'string') return "";
  let trimmed = url.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  // Strip trailing '/rest/v1/' or '/rest/v1' or custom trailing slashes
  trimmed = trimmed.replace(/\/rest\/v1\/?$/i, "");
  trimmed = trimmed.replace(/\/+$/, "");
  return trimmed;
}

function getValidSupabaseUrl(envUrl: any, defaultUrl: string): string {
  const sanitized = sanitizeUrl(envUrl);
  if (sanitized && /^https?:\/\//i.test(sanitized)) {
    return sanitized;
  }
  return sanitizeUrl(defaultUrl);
}

function sanitizeKey(key: any): string {
  if (typeof key !== 'string') return "";
  let trimmed = key.trim();
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    trimmed = trimmed.slice(1, -1).trim();
  }
  return trimmed;
}

function safeDecodeBase64(str: string): string {
  try {
    if (typeof Buffer !== "undefined") {
      return Buffer.from(str, "base64").toString("utf8");
    }
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
      base64 += "=";
    }
    return decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
  } catch (e) {
    try {
      return atob(str);
    } catch (err) {
      return "";
    }
  }
}

function parseSupabaseKey(key: any): { ref?: string; role?: string } | null {
  if (typeof key !== 'string') return null;
  const parts = key.trim().split('.');
  if (parts.length !== 3) return null;
  try {
    const payloadStr = safeDecodeBase64(parts[1]);
    if (!payloadStr) return null;
    const payload = JSON.parse(payloadStr);
    if (payload && payload.iss === 'supabase') {
      return { ref: payload.ref, role: payload.role };
    }
  } catch (e) {}
  return null;
}

const DEFAULT_URL = "https://slfrjuherxhychvmljll.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZnJqdWhlcnhoeWNodm1samxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjY3OTEsImV4cCI6MjA5NzQ0Mjc5MX0.O03KF9Tg-6TvDRC1l4-u-gIgzuFhYZeFJASEBXIWPDs";

function resolveConfig() {
  const metaEnv = (import.meta as any).env || {};
  const candidateKeys = [
    metaEnv.VITE_SUPABASE_ANON_KEY,
    DEFAULT_KEY
  ];

  for (const raw of candidateKeys) {
    const key = sanitizeKey(raw);
    const parsed = parseSupabaseKey(key);
    if (parsed && parsed.ref) {
      const url = `https://${parsed.ref}.supabase.co`;
      return { url, key };
    }
  }

  const envUrl = getValidSupabaseUrl(metaEnv.VITE_SUPABASE_URL, DEFAULT_URL);
  const tempKey = sanitizeKey(metaEnv.VITE_SUPABASE_ANON_KEY) || DEFAULT_KEY;
  return { url: envUrl, key: tempKey };
}

const { url: supabaseUrl, key: supabaseAnonKey } = resolveConfig();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

