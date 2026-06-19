import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createClient } from "@supabase/supabase-js";
import { createServer as createViteServer } from "vite";

// Configuration for Supabase SDK matching the user's details
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
    return JSON.parse(decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    ));
  } catch (e) {
    try {
      if (typeof Buffer !== "undefined") {
        return Buffer.from(str, "base64").toString("utf8");
      }
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
    const payload = typeof payloadStr === 'string' ? JSON.parse(payloadStr) : payloadStr;
    if (payload && payload.iss === 'supabase') {
      return { ref: payload.ref, role: payload.role };
    }
  } catch (e) {}
  return null;
}

const DEFAULT_URL = "https://slfrjuherxhychvmljll.supabase.co";
const DEFAULT_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsZnJqdWhlcnhoeWNodm1samxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE4NjY3OTEsImV4cCI6MjA5NzQ0Mjc5MX0.O03KF9Tg-6TvDRC1l4-u-gIgzuFhYZeFJASEBXIWPDs";

function resolveConfig() {
  const candidateKeys = [
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.VITE_SUPABASE_ANON_KEY,
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

  const envUrl = getValidSupabaseUrl(process.env.SUPABASE_URL, DEFAULT_URL);
  const tempKey = sanitizeKey(process.env.SUPABASE_SERVICE_ROLE_KEY) || 
                  sanitizeKey(process.env.VITE_SUPABASE_ANON_KEY) || 
                  DEFAULT_KEY;
  return { url: envUrl, key: tempKey };
}

const { url: SUPABASE_URL, key: SUPABASE_KEY } = resolveConfig();

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const PORT = 3000;
const app = express();

app.use(express.json());

// Helper file paths for fallback JSON storage if Supabase queries fails or tables don't exist
const FALLBACK_FILE = path.join(process.cwd(), "local_store.json");

// Ensure local file storage has standard mock templates on startup if it doesn't exist
const initializeLocalStore = () => {
  if (!fs.existsSync(FALLBACK_FILE)) {
    const defaultData = {
      users: [
        {
          id: "admin-ibnu",
          name: "Ibnuburhan Guud",
          email: "Ibnuburhan555@gmail.com",
          role: "admin",
          phone: "+252615555555",
          password: "Maalinle555",
          approved: true,
          createdAt: new Date().toISOString()
        },
        {
          id: "user-agent-1",
          name: "Abdirahman Warsame (Real Estate Lead)",
          email: "abdirahman@realestate.so",
          role: "agent",
          phone: "+252615123456",
          password: "somali123",
          approved: true,
          createdAt: new Date().toISOString()
        },
        {
          id: "user-agent-2",
          name: "Sarah Yusuf (Horn Property Group)",
          email: "sarah@realestate.so",
          role: "agent",
          phone: "+252634987654",
          password: "somali123",
          approved: true,
          createdAt: new Date().toISOString()
        }
      ],
      properties: [],
      inquiries: [],
      testimonials: [],
      agencies: [],
      agencyLogs: [],
      notifications: [],
      favorites: []
    };
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(defaultData, null, 2));
  }
};

initializeLocalStore();

// Read from local JSON backup
const readLocalStore = () => {
  try {
    initializeLocalStore();
    return JSON.parse(fs.readFileSync(FALLBACK_FILE, "utf-8"));
  } catch (err) {
    console.error("Error reading local backup store:", err);
    return {};
  }
};

// Write to local JSON backup
const writeLocalStore = (data: any) => {
  try {
    fs.writeFileSync(FALLBACK_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error("Error writing local backup store:", err);
  }
};

// Supabase Connection Status Testing API
app.get("/api/supabase/status", async (req: Request, res: Response) => {
  let isConnected = false;
  let hasUsersTable = false;
  let hasPropertiesTable = false;
  let hasInquiriesTable = false;
  let hasTestimonialsTable = false;
  let hasAgenciesTable = false;
  let hasAgencyLogsTable = false;
  let hasNotificationsTable = false;
  let hasFavoritesTable = false;
  let errorMessage = "";

  try {
    // Attempt ping-testing tables
    const userRes = await supabase.from("users").select("count").limit(1);
    hasUsersTable = !userRes.error;
    if (userRes.error) errorMessage = userRes.error.message;

    const propRes = await supabase.from("properties").select("count").limit(1);
    hasPropertiesTable = !propRes.error;

    const inqRes = await supabase.from("inquiries").select("count").limit(1);
    hasInquiriesTable = !inqRes.error;

    const testRes = await supabase.from("testimonials").select("count").limit(1);
    hasTestimonialsTable = !testRes.error;

    const agencyRes = await supabase.from("agencies").select("count").limit(1);
    hasAgenciesTable = !agencyRes.error;

    const logRes = await supabase.from("agency_logs").select("count").limit(1);
    hasAgencyLogsTable = !logRes.error;

    const notifRes = await supabase.from("notifications").select("count").limit(1);
    hasNotificationsTable = !notifRes.error;

    const favRes = await supabase.from("favorites").select("count").limit(1);
    hasFavoritesTable = !favRes.error;

    isConnected = true;
  } catch (err: any) {
    isConnected = false;
    errorMessage = err?.message || String(err);
  }

  const creationSql = `-- Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  role TEXT NOT NULL DEFAULT 'buyer',
  phone TEXT NOT NULL,
  password TEXT,
  avatar TEXT,
  approved BOOLEAN DEFAULT TRUE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL,
  bedrooms INTEGER NOT NULL,
  bathrooms INTEGER NOT NULL,
  "areaSize" NUMERIC NOT NULL,
  images TEXT[] NOT NULL,
  "ownerId" TEXT NOT NULL,
  "ownerName" TEXT NOT NULL,
  "ownerPhone" TEXT NOT NULL,
  "ownerWhatsapp" TEXT NOT NULL,
  approved BOOLEAN DEFAULT FALSE,
  featured BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  "agencyId" TEXT,
  "availableDate" TEXT,
  dimensions TEXT,
  "hasTitleDeed" BOOLEAN,
  zoning TEXT,
  "numShops" INTEGER,
  "hasParking" BOOLEAN,
  "rentalDeposit" NUMERIC,
  "rentalPeriod" TEXT,
  "includedUtilities" TEXT,
  "paymentInstallments" BOOLEAN,
  "downPaymentAmount" NUMERIC,
  "carMake" TEXT,
  "carModel" TEXT,
  "carYear" INTEGER,
  "carTransmission" TEXT,
  "carFuelType" TEXT,
  "carMileage" NUMERIC
);

-- Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "propertyTitle" TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  comment TEXT NOT NULL,
  avatar TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5
);

-- Create Agencies Table
CREATE TABLE IF NOT EXISTS agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  logo TEXT,
  location TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Agency Logs Table
CREATE TABLE IF NOT EXISTS agency_logs (
  id TEXT PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  action TEXT NOT NULL,
  "targetId" TEXT,
  details TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Create Favorites Table
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);`;

  res.json({
    connected: isConnected,
    tablesOk: hasUsersTable && hasPropertiesTable,
    hasUsersTable,
    hasPropertiesTable,
    hasInquiriesTable,
    hasTestimonialsTable,
    hasAgenciesTable,
    hasAgencyLogsTable,
    hasNotificationsTable,
    hasFavoritesTable,
    errorMessage,
    sql: creationSql,
    credentials: {
      url: SUPABASE_URL,
      project_id: "slfrjuherxhychvmljll"
    }
  });
});

// APIs Proxy Layer: PROPERTIES
app.get("/api/properties", async (req: Request, res: Response) => {
  try {
    const { data: supaProps, error } = await supabase.from("properties").select("*");
    if (!error && supaProps) {
      return res.json(supaProps);
    }
    console.warn("Supabase properties query fallback to local file because:", error?.message);
  } catch (err) {
    console.error("Supabase properties catch error, loading local fallback:", err);
  }
  const local = readLocalStore();
  res.json(local.properties || []);
});

app.post("/api/properties", async (req: Request, res: Response) => {
  const propertyObj = req.body;
  try {
    const { data, error } = await supabase.from("properties").upsert([propertyObj]).select();
    if (!error && data) {
      return res.json(data[0] || propertyObj);
    }
    console.warn("Failed posting to Supabase. Fastsaving locally:", error?.message);
  } catch (err) {
    console.error("Catch error posting to Supabase properties:", err);
  }
  const local = readLocalStore();
  local.properties = local.properties || [];
  // Remove existing if matching ID, then insert new
  local.properties = local.properties.filter((p: any) => p.id !== propertyObj.id);
  local.properties.push(propertyObj);
  writeLocalStore(local);
  res.json(propertyObj);
});

app.put("/api/properties", async (req: Request, res: Response) => {
  const propertyObj = req.body;
  try {
    const { data, error } = await supabase.from("properties").update(propertyObj).eq("id", propertyObj.id).select();
    if (!error && data) {
      return res.json(data[0] || propertyObj);
    }
    console.warn("Critical: Supabase properties update error. Syncing locally:", error?.message);
  } catch (err) {
    console.error("Catch updating properties:", err);
  }
  const local = readLocalStore();
  local.properties = local.properties || [];
  local.properties = local.properties.map((p: any) => p.id === propertyObj.id ? { ...p, ...propertyObj } : p);
  writeLocalStore(local);
  res.json(propertyObj);
});

app.delete("/api/properties/:id", async (req: Request, res: Response) => {
  const propId = req.params.id;
  try {
    const { error } = await supabase.from("properties").delete().eq("id", propId);
    if (!error) {
      return res.json({ success: true });
    }
    console.warn("Supabase properties delete failed:", error.message);
  } catch (err) {
    console.error("Catch deleting properties:", err);
  }
  const local = readLocalStore();
  local.properties = local.properties || [];
  local.properties = local.properties.filter((p: any) => p.id !== propId);
  writeLocalStore(local);
  res.json({ success: true });
});

// APIs Proxy Layer: USERS
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const { data: supaUsers, error } = await supabase.from("users").select("*");
    if (!error && supaUsers) {
      return res.json(supaUsers);
    }
    console.warn("Supabase users query fallback to local file because:", error?.message);
  } catch (err) {
    console.error("Supabase user loading error:", err);
  }
  const local = readLocalStore();
  res.json(local.users || []);
});

app.post("/api/users", async (req: Request, res: Response) => {
  const userObj = req.body;
  try {
    const { data, error } = await supabase.from("users").upsert([userObj]).select();
    if (!error && data) {
      return res.json(data[0] || userObj);
    }
    console.warn("Failed saving user to Supabase:", error?.message);
  } catch (err) {
    console.error("Catch creating user on Supabase:", err);
  }
  const local = readLocalStore();
  local.users = local.users || [];
  local.users = local.users.filter((u: any) => u.id !== userObj.id);
  local.users.push(userObj);
  writeLocalStore(local);
  res.json(userObj);
});

app.put("/api/users", async (req: Request, res: Response) => {
  const userObj = req.body;
  try {
    const { data, error } = await supabase.from("users").update(userObj).eq("id", userObj.id).select();
    if (!error && data) {
      return res.json(data[0] || userObj);
    }
    console.warn("Failed updating user on Supabase:", error?.message);
  } catch (err) {
    console.error("Catch updating user on Supabase:", err);
  }
  const local = readLocalStore();
  local.users = local.users || [];
  local.users = local.users.map((u: any) => u.id === userObj.id ? { ...u, ...userObj } : u);
  writeLocalStore(local);
  res.json(userObj);
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const { error } = await supabase.from("users").delete().eq("id", userId);
    if (!error) {
      return res.json({ success: true });
    }
    console.warn("Failed deleting user from Supabase:", error?.message);
  } catch (err) {
    console.error("Catch deleting user:", err);
  }
  const local = readLocalStore();
  local.users = local.users || [];
  local.users = local.users.filter((u: any) => u.id !== userId);
  writeLocalStore(local);
  res.json({ success: true });
});

// APIs Proxy Layer: INQUIRIES
app.get("/api/inquiries", async (req: Request, res: Response) => {
  try {
    const { data: supaInquiries, error } = await supabase.from("inquiries").select("*");
    if (!error && supaInquiries) {
      return res.json(supaInquiries);
    }
    console.warn("Supabase inquiries query fallback:", error?.message);
  } catch (err) {
    console.error("Supabase inquiries loading error:", err);
  }
  const local = readLocalStore();
  res.json(local.inquiries || []);
});

app.post("/api/inquiries", async (req: Request, res: Response) => {
  const inquiryObj = req.body;
  try {
    const { data, error } = await supabase.from("inquiries").upsert([inquiryObj]).select();
    if (!error && data) {
      return res.json(data[0] || inquiryObj);
    }
  } catch (err) {
    console.error("Supabase write inquiry error:", err);
  }
  const local = readLocalStore();
  local.inquiries = local.inquiries || [];
  local.inquiries.push(inquiryObj);
  writeLocalStore(local);
  res.json(inquiryObj);
});

app.delete("/api/inquiries/:id", async (req: Request, res: Response) => {
  const inquiryId = req.params.id;
  try {
    const { error } = await supabase.from("inquiries").delete().eq("id", inquiryId);
    if (!error) {
      return res.json({ success: true });
    }
  } catch (err) {
    console.error("Supabase delete inquiry error:", err);
  }
  const local = readLocalStore();
  local.inquiries = local.inquiries || [];
  local.inquiries = local.inquiries.filter((inq: any) => inq.id !== inquiryId);
  writeLocalStore(local);
  res.json({ success: true });
});

// OTHER LOGS, AGENCIES & TESTIMONIALS WITH SIMILAR PROXIES
app.get("/api/testimonials", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("testimonials").select("*");
    if (!error && data) return res.json(data);
  } catch (e) {}
  const local = readLocalStore();
  res.json(local.testimonials || []);
});

app.post("/api/testimonials", async (req: Request, res: Response) => {
  const testObj = req.body;
  try {
    const { data, error } = await supabase.from("testimonials").upsert([testObj]).select();
    if (!error && data) return res.json(data[0] || testObj);
  } catch (e) {}
  const local = readLocalStore();
  local.testimonials = local.testimonials || [];
  local.testimonials.push(testObj);
  writeLocalStore(local);
  res.json(testObj);
});

app.get("/api/agencies", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("agencies").select("*");
    if (!error && data) return res.json(data);
  } catch (e) {}
  const local = readLocalStore();
  res.json(local.agencies || []);
});

app.post("/api/agencies", async (req: Request, res: Response) => {
  const agencyObj = req.body;
  try {
    const { data, error } = await supabase.from("agencies").upsert([agencyObj]).select();
    if (!error && data) return res.json(data[0] || agencyObj);
  } catch (e) {}
  const local = readLocalStore();
  local.agencies = local.agencies || [];
  local.agencies.push(agencyObj);
  writeLocalStore(local);
  res.json(agencyObj);
});

app.get("/api/agency-logs", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("agency_logs").select("*");
    if (!error && data) return res.json(data);
  } catch (e) {}
  const local = readLocalStore();
  res.json(local.agencyLogs || []);
});

app.post("/api/agency-logs", async (req: Request, res: Response) => {
  const logObj = req.body;
  try {
    const { data, error } = await supabase.from("agency_logs").upsert([logObj]).select();
    if (!error && data) return res.json(data[0] || logObj);
  } catch (e) {}
  const local = readLocalStore();
  local.agencyLogs = local.agencyLogs || [];
  local.agencyLogs.push(logObj);
  writeLocalStore(local);
  res.json(logObj);
});

app.get("/api/notifications", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("notifications").select("*");
    if (!error && data) return res.json(data);
  } catch (e) {}
  const local = readLocalStore();
  res.json(local.notifications || []);
});

app.post("/api/notifications", async (req: Request, res: Response) => {
  const notifObj = req.body;
  try {
    const { data, error } = await supabase.from("notifications").upsert([notifObj]).select();
    if (!error && data) return res.json(data[0] || notifObj);
  } catch (e) {}
  const local = readLocalStore();
  local.notifications = local.notifications || [];
  local.notifications.push(notifObj);
  writeLocalStore(local);
  res.json(notifObj);
});

app.put("/api/notifications", async (req: Request, res: Response) => {
  const updatedNotifs = req.body;
  try {
    if (Array.isArray(updatedNotifs)) {
      for (const n of updatedNotifs) {
        await supabase.from("notifications").upsert([n]);
      }
    }
  } catch (e) {}
  const local = readLocalStore();
  local.notifications = updatedNotifs;
  writeLocalStore(local);
  res.json(updatedNotifs);
});

app.get("/api/favorites", async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase.from("favorites").select("*");
    if (!error && data) return res.json(data);
  } catch (e) {}
  const local = readLocalStore();
  res.json(local.favorites || []);
});

app.post("/api/favorites", async (req: Request, res: Response) => {
  const favObj = req.body;
  try {
    const { data, error } = await supabase.from("favorites").upsert([favObj]).select();
    if (!error && data) return res.json(data[0] || favObj);
  } catch (e) {}
  const local = readLocalStore();
  local.favorites = local.favorites || [];
  local.favorites = local.favorites.filter((f: any) => f.id !== favObj.id);
  local.favorites.push(favObj);
  writeLocalStore(local);
  res.json(favObj);
});

// START EXPRESS + VITE ROUTING
async function startServer() {
  // Vite middleware setup if we are in development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serving production files
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    // React Router single page app catch-all using Express v5 *all syntax
    app.get("*all", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[FULLSTACK ENGINE] Server is bound on http://0.0.0.0:${PORT}`);
  });
}

startServer();
