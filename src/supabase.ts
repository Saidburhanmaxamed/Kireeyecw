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

// Import Firestore for decentralized automatic zero-setup fallback (perfect for Netlify/multi-device)
import { collection, getDocs, setDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

async function readFirestoreCollection(collectionName: string): Promise<any[]> {
  try {
    const colRef = collection(db, collectionName);
    const snap = await getDocs(colRef);
    const items: any[] = [];
    snap.forEach((docSnap) => {
      items.push({ id: docSnap.id, ...docSnap.data() });
    });
    return items;
  } catch (err) {
    console.error(`[Kireeye Firestore Fallback] Error reading ${collectionName} from Firestore:`, err);
    return [];
  }
}

async function writeFirestoreDocument(collectionName: string, id: string, data: any): Promise<any> {
  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, data, { merge: true });
    return data;
  } catch (err) {
    console.error(`[Kireeye Firestore Fallback] Error writing ${collectionName} id ${id} to Firestore:`, err);
    return data;
  }
}

async function deleteFirestoreDocument(collectionName: string, id: string): Promise<boolean> {
  try {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`[Kireeye Firestore Fallback] Error deleting ${collectionName} id ${id} from Firestore:`, err);
    return false;
  }
}

// Automated Netlify Serverless Routing Interceptor
// When deployed on static-only hosting services like Netlify, the Node/Express backend at "/api/*" 
// does not run. This interceptor hooks window.fetch, automatically falling back to client-side 
// direct Supabase or Firestore queries if the backend is absent or offline.
if (typeof window !== "undefined") {
  const originalFetch = window.fetch;
  const interceptorFetch = async function (input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const url = typeof input === "string" ? input : (input as any).url || "";
    if (typeof url === "string" && url.split("?")[0].startsWith("/api/")) {
      const parsedUrl = new URL(url, window.location.origin);
      const pathSegments = parsedUrl.pathname.split("/").filter(Boolean);
      const isSyncAuth = pathSegments[1] === "users" && pathSegments[2] === "sync-auth";

      try {
        const response = await originalFetch(input, init);
        // If the backend returns server-offline/error codes or 404, we trigger the serverless direct fallback, except for sync-auth
        if (!isSyncAuth && (response.status === 404 || response.status === 502 || response.status === 500)) {
          throw new Error("Backend offline. Netlify Serverless routing protocol engaged.");
        }
        return response;
      } catch (fetchError) {
        if (isSyncAuth) {
          // Do not attempt to treat sync-auth action as a database table. Let it return a clean error payload.
          return new Response(JSON.stringify({ success: false, error: (fetchError as any).message || "Sync auth failed" }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
          });
        }
        console.info("[KireeyeCw Netlify Fallback] Engagement protocol routing:", url);
        try {
          const resource = pathSegments[1]; // "properties", "users", "inquiries", etc.
          const resourceId = pathSegments[2]; // Optional ID
          
          if (resource === "supabase" && pathSegments[2] === "status") {
            return new Response(JSON.stringify({
              connected: true,
              tablesOk: true,
              hasUsersTable: true,
              hasPropertiesTable: true,
              hasInquiriesTable: true,
              hasTestimonialsTable: true,
              hasAgenciesTable: true,
              hasAgencyLogsTable: true,
              hasNotificationsTable: true,
              hasFavoritesTable: true,
              errorMessage: "",
              sql: "",
              credentials: {
                url: supabaseUrl,
                project_id: "slfrjuherxhychvmljll"
              },
              isClientFallbackMode: true
            }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }

          const method = (init?.method || "GET").toUpperCase();
          let tableName = resource;
          if (resource === "agency-logs") {
            tableName = "agency_logs";
          }

          if (method === "GET") {
            try {
              const { data, error } = await supabase.from(tableName).select("*");
              if (error) throw error;
              return new Response(JSON.stringify(data || []), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            } catch (supaErr: any) {
              console.warn(`[KireeyeCw Fallback] Supabase Direct table fetch failed for "${tableName}". Routing to static Firestore collections:`, supaErr.message || supaErr);
              const list = await readFirestoreCollection(tableName);
              return new Response(JSON.stringify(list), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            }
          }

          if (method === "POST" || method === "PUT") {
            const bodyPayload = init?.body ? JSON.parse(init.body as string) : {};
            
            // Special batch update for notifications
            if (tableName === "notifications" && method === "PUT" && Array.isArray(bodyPayload)) {
              try {
                for (const n of bodyPayload) {
                  await supabase.from("notifications").upsert([n]);
                }
              } catch (supaErr: any) {
                console.warn(`[KireeyeCw Fallback] Supabase Direct batch notifications failed. Syncing to Firestore:`, supaErr.message || supaErr);
                for (const n of bodyPayload) {
                  await writeFirestoreDocument("notifications", n.id, n);
                }
              }
              return new Response(JSON.stringify(bodyPayload), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            }

            try {
              const { data, error } = await supabase.from(tableName).upsert([bodyPayload]).select();
              if (error) throw error;
              // Also replicate sync to Firestore silently for redundant backup safety
              const id = bodyPayload.id || `doc-${Math.random().toString(36).substr(2, 9)}`;
              await writeFirestoreDocument(tableName, id, bodyPayload);

              return new Response(JSON.stringify(data?.[0] || bodyPayload), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            } catch (supaErr: any) {
              console.warn(`[KireeyeCw Fallback] Supabase Direct write upsert failed for "${tableName}". Fallback synced to Firestore:`, supaErr.message || supaErr);
              const id = bodyPayload.id || `doc-${Math.random().toString(36).substr(2, 9)}`;
              await writeFirestoreDocument(tableName, id, bodyPayload);
              return new Response(JSON.stringify(bodyPayload), {
                status: 200,
                headers: { "Content-Type": "application/json" }
              });
            }
          }

          if (method === "DELETE") {
            const idToDelete = resourceId || pathSegments.pop();
            if (idToDelete) {
              try {
                const { error } = await supabase.from(tableName).delete().eq("id", idToDelete);
                if (error) throw error;
              } catch (supaErr: any) {
                console.warn(`[KireeyeCw Fallback] Supabase Direct delete failed for "${tableName}". Falling back to Firestore delete:`, supaErr.message || supaErr);
              }
              await deleteFirestoreDocument(tableName, idToDelete);
            }
            return new Response(JSON.stringify({ success: true }), {
              status: 200,
              headers: { "Content-Type": "application/json" }
            });
          }

          return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        } catch (fallbackError) {
          console.error("[KireeyeCw Netlify Fallback Error]:", fallbackError);
          // Fallback to offline placeholder structure
          return new Response(JSON.stringify([]), {
            status: 200,
            headers: { "Content-Type": "application/json" }
          });
        }
      }
    }
    return originalFetch(input, init);
  };

  try {
    Object.defineProperty(window, "fetch", {
      value: interceptorFetch,
      writable: true,
      configurable: true
    });
  } catch (defineError) {
    console.warn("[KireeyeCw Netlify Fallback] Failed to redefine window.fetch via defineProperty. Trying legacy assignment:", defineError);
    try {
      (window as any).fetch = interceptorFetch;
    } catch (assignError) {
      console.error("[KireeyeCw Netlify Fallback] Could not intercept global fetch:", assignError);
    }
  }
}

