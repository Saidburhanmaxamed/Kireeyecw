import "dotenv/config";
import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Property, User, Inquiry, AppNotification, Testimonial } from "./src/types";

// Supabase Client imports
import { createClient } from "@supabase/supabase-js";

// Seed data
import { SAMPLE_PROPERTIES } from "./src/data";

const app = express();
const PORT = 3000;

// Increase payload limits for Base64 image uploads by agencies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Default Seed Users
const SEED_USERS: User[] = [
  {
    id: "admin-ibnu",
    name: "Ibnuburhan Guud",
    email: "Ibnuburhan555@gmail.com",
    role: "admin",
    phone: "+252615555555",
    password: "Maalinle555",
    createdAt: new Date("2026-06-08").toISOString()
  },
  {
    id: "user-agent-1",
    name: "Abdirahman Warsame (Real Estate Lead)",
    email: "abdirahman@realestate.so",
    username: "abdirahman",
    role: "agent",
    phone: "+252615123456",
    password: "somali123",
    createdAt: new Date("2026-03-15").toISOString()
  },
  {
    id: "user-agent-2",
    name: "Sarah Yusuf (Horn Property Group)",
    email: "sarah@realestate.so",
    username: "sarah",
    role: "agent",
    phone: "+252634987654",
    password: "somali123",
    createdAt: new Date("2026-04-20").toISOString()
  }
];

// In-Memory fallback caches to ensure 100% development uptime when keys are unconfigured
let inInMemoryProperties: Property[] = [...SAMPLE_PROPERTIES];
let inInMemoryUsers: User[] = [...SEED_USERS];
let inInMemoryInquiries: Inquiry[] = [];
let inInMemoryNotifications: AppNotification[] = [];
let inInMemoryTestimonials: Testimonial[] = [];

// Lazy client setup to satisfy robust system conventions
let SUPABASE_URL = (process.env.SUPABASE_URL || "").trim();
const SUPABASE_KEY = (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "").trim();

// Normalize URL to remove /rest/v1/ or trailing slashes, ensuring standard base URL formatting
if (SUPABASE_URL.endsWith("/rest/v1/")) {
  SUPABASE_URL = SUPABASE_URL.slice(0, -9);
} else if (SUPABASE_URL.endsWith("/rest/v1")) {
  SUPABASE_URL = SUPABASE_URL.slice(0, -8);
}
if (SUPABASE_URL.endsWith("/")) {
  SUPABASE_URL = SUPABASE_URL.slice(0, -1);
}

let supabase: any = null;

const isValidUrl = (url: string) => {
  return url && (url.startsWith("http://") || url.startsWith("https://"));
};

if (isValidUrl(SUPABASE_URL) && SUPABASE_KEY) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false
      }
    });
    console.log("[Supabase Config] Successfully initialized Supabase Client wrapper.");
  } catch (err) {
    console.error("[Supabase Config] Failed to instantiate Supabase client:", err);
  }
} else {
  console.warn(
    "[Supabase Config] Credentials not configured or invalid SUPABASE_URL. Operating in High-Performance Local-Memory fallback mode. " +
    "Provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment secrets to connect to your live cloud database!"
  );
}

// SQL Schema endpoint to facilitate copy-pasting for the developer
const SCHEMA_SQL = `-- -------------------------------------------------------------
-- SUPABASE POSTGRESQL SCHEMAS FOR SOMALI REAL ESTATE PORTAL
-- Paste this script directly into your Supabase SQL Editor (SQL Web Console)
-- and click Run to prepare your database instantly.
-- -------------------------------------------------------------

-- 1. Create Users Table
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  role TEXT NOT NULL DEFAULT 'agent',
  phone TEXT NOT NULL,
  password TEXT,
  avatar TEXT,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2. Create Properties Table
CREATE TABLE IF NOT EXISTS properties (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  type TEXT NOT NULL,
  price NUMERIC NOT NULL,
  location TEXT NOT NULL,
  region TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Rent',
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  "areaSize" NUMERIC NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
  "ownerId" TEXT NOT NULL,
  "ownerName" TEXT NOT NULL,
  "ownerPhone" TEXT NOT NULL,
  "ownerWhatsapp" TEXT,
  approved BOOLEAN DEFAULT TRUE,
  featured BOOLEAN DEFAULT FALSE,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  "availableDate" TEXT,
  dimensions TEXT,
  "hasTitleDeed" BOOLEAN DEFAULT FALSE,
  zoning TEXT,
  "numShops" INTEGER DEFAULT 0,
  "hasParking" BOOLEAN DEFAULT FALSE,
  "rentalDeposit" NUMERIC DEFAULT 0,
  "rentalPeriod" TEXT,
  "includedUtilities" TEXT,
  "paymentInstallments" BOOLEAN DEFAULT FALSE,
  "downPaymentAmount" NUMERIC DEFAULT 0,
  "carMake" TEXT,
  "carModel" TEXT,
  "carYear" INTEGER,
  "carTransmission" TEXT,
  "carFuelType" TEXT,
  "carMileage" NUMERIC
);

-- 3. Create Inquiries Table
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "propertyTitle" TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 4. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL,
  "createdAt" TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  read BOOLEAN DEFAULT FALSE
);

-- 5. Create Testimonials Table
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  comment TEXT NOT NULL,
  avatar TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5
);

-- Insert central core users as primary fallbacks
INSERT INTO users (id, name, email, role, phone, password, "createdAt")
VALUES 
('admin-ibnu', 'Ibnuburhan Guud', 'Ibnuburhan555@gmail.com', 'admin', '+252615555555', 'Maalinle555', '2026-06-08T00:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
`;

// Helper to check table connection & trigger self-seed if empty
async function seedDefaultDataIfEmpty() {
  if (!supabase) return;
  try {
    // Audit Users table
    const { data: users, error: userErr } = await supabase.from("users").select("id").limit(1);
    if (!userErr && (!users || users.length === 0)) {
      console.log("[Supabase Seeding] Supabase connected and users table is empty. Injecting seed brokers...");
      await supabase.from("users").insert(SEED_USERS as any);
    }

    // Audit Properties table
    const { data: properties, error: propErr } = await supabase.from("properties").select("id").limit(1);
    if (!propErr && (!properties || properties.length === 0)) {
      console.log("[Supabase Seeding] Supabase connected and properties table is empty. Injecting seed active catalog listings...");
      await supabase.from("properties").insert(SAMPLE_PROPERTIES as any);
    }
  } catch (err) {
    console.error("[Supabase Seeding] Lazy auto-seeding warning:", err);
  }
}

// Fire seeding asynchronously on start if supabase is loaded
if (supabase) {
  seedDefaultDataIfEmpty().catch(e => console.error("Supabase seed checks failed:", e));
}

// GET DB Config status & script
app.get("/api/db-status", async (req, res) => {
  let tablesExist = false;
  let connectionError = null;
  
  if (supabase) {
    try {
      const { error } = await supabase.from("properties").select("id").limit(1);
      if (!error) {
        tablesExist = true;
      } else {
        connectionError = error.message;
        // Postgres error code 42P01 means relation does not exist
        if (error.code === "42P01") {
          tablesExist = false;
        } else {
          // If it's a different error (e.g. auth), we treat it as unconfigured or error
          tablesExist = false;
        }
      }
    } catch (e: any) {
      connectionError = e.message;
      tablesExist = false;
    }
  }

  res.json({
    supabaseConnected: !!supabase,
    supabaseUrl: SUPABASE_URL ? `${SUPABASE_URL.substring(0, 25)}...` : null,
    hasServiceRoleKey: !!(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY),
    sqlSchema: SCHEMA_SQL,
    tablesExist,
    connectionError
  });
});

// GET all static/dynamic app state (bootstrap JSON)
app.get("/api/data-bootstrap", async (req, res) => {
  if (supabase) {
    await seedDefaultDataIfEmpty();
    try {
      const [pRes, uRes, iRes, nRes, tRes] = await Promise.all([
        supabase.from("properties").select("*").order("createdAt", { ascending: false }),
        supabase.from("users").select("*"),
        supabase.from("inquiries").select("*"),
        supabase.from("notifications").select("*").order("createdAt", { ascending: false }),
        supabase.from("testimonials").select("*")
      ]);

      return res.json({
        supabaseConnected: true,
        properties: pRes.data || inInMemoryProperties,
        users: uRes.data || inInMemoryUsers,
        inquiries: iRes.data || inInMemoryInquiries,
        notifications: nRes.data || inInMemoryNotifications,
        testimonials: tRes.data || inInMemoryTestimonials
      });
    } catch (err) {
      console.error("[Supabase Error] Error compiling bootstrap bundle:", err);
      // Fallback gracefully instead of crashing
    }
  }

  // Fallback to high-performance local memory
  res.json({
    supabaseConnected: false,
    properties: inInMemoryProperties,
    users: inInMemoryUsers,
    inquiries: inInMemoryInquiries,
    notifications: inInMemoryNotifications,
    testimonials: inInMemoryTestimonials
  });
});

// PROPERTIES ENDPOINTS
app.get("/api/properties", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from("properties").select("*").order("createdAt", { ascending: false });
    if (!error && data) return res.json(data);
  }
  res.json(inInMemoryProperties);
});

app.post("/api/properties", async (req, res) => {
  const newProp = req.body as Property;
  if (!newProp.id) {
    newProp.id = "prop-" + Math.random().toString(36).substr(2, 9);
  }
  if (!newProp.createdAt) {
    newProp.createdAt = new Date().toISOString();
  }

  if (supabase) {
    const { error } = await supabase.from("properties").insert([newProp] as any);
    if (!error) return res.status(201).json(newProp);
    console.error("[Supabase Error] properties POST failed:", error);
  }

  // Update fallback memory State
  inInMemoryProperties = [newProp, ...inInMemoryProperties];
  res.status(201).json(newProp);
});

app.put("/api/properties/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  if (supabase) {
    const { error } = await supabase.from("properties").update(updatedFields as any).eq("id", id);
    if (!error) return res.json({ success: true, id });
    console.error("[Supabase Error] properties PUT failed:", error);
  }

  // Update fallback memory State
  inInMemoryProperties = inInMemoryProperties.map(p => p.id === id ? { ...p, ...updatedFields } : p);
  res.json({ success: true, id });
});

app.delete("/api/properties/:id", async (req, res) => {
  const { id } = req.params;

  if (supabase) {
    const { error } = await supabase.from("properties").delete().eq("id", id);
    if (!error) return res.json({ success: true, id });
    console.error("[Supabase Error] properties DELETE failed:", error);
  }

  // Update fallback memory State
  inInMemoryProperties = inInMemoryProperties.filter(p => p.id !== id);
  res.json({ success: true, id });
});

// USERS ENDPOINTS
app.get("/api/users", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from("users").select("*");
    if (!error && data) return res.json(data);
  }
  res.json(inInMemoryUsers);
});

app.post("/api/users", async (req, res) => {
  const newUser = req.body as User;
  if (!newUser.id) {
    newUser.id = "user-" + Math.random().toString(36).substr(2, 9);
  }
  if (!newUser.createdAt) {
    newUser.createdAt = new Date().toISOString();
  }

  if (supabase) {
    const { error } = await supabase.from("users").insert([newUser] as any);
    if (!error) return res.status(201).json(newUser);
    console.error("[Supabase Error] users POST failed:", error);
  }

  // Update fallback memory State
  inInMemoryUsers = [...inInMemoryUsers, newUser];
  res.status(201).json(newUser);
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;

  if (supabase) {
    const { error } = await supabase.from("users").update(updatedFields as any).eq("id", id);
    if (!error) return res.json({ success: true, id });
    console.error("[Supabase Error] users PUT failed:", error);
  }

  // Update fallback memory State
  inInMemoryUsers = inInMemoryUsers.map(u => u.id === id ? { ...u, ...updatedFields } : u);
  res.json({ success: true, id });
});

// INQUIRIES ENDPOINTS
app.get("/api/inquiries", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from("inquiries").select("*");
    if (!error && data) return res.json(data);
  }
  res.json(inInMemoryInquiries);
});

app.post("/api/inquiries", async (req, res) => {
  const newInq = req.body as Inquiry;
  if (!newInq.id) {
    newInq.id = "inq-" + Math.random().toString(36).substr(2, 9);
  }
  if (!newInq.date) {
    newInq.date = new Date().toISOString();
  }

  if (supabase) {
    const { error } = await supabase.from("inquiries").insert([newInq] as any);
    if (!error) return res.status(201).json(newInq);
    console.error("[Supabase Error] inquiries POST failed:", error);
  }

  // Update fallback memory State
  inInMemoryInquiries = [newInq, ...inInMemoryInquiries];
  res.status(201).json(newInq);
});

app.delete("/api/inquiries/:id", async (req, res) => {
  const { id } = req.params;

  if (supabase) {
    const { error } = await supabase.from("inquiries").delete().eq("id", id);
    if (!error) return res.json({ success: true, id });
    console.error("[Supabase Error] inquiries DELETE failed:", error);
  }

  // Update fallback memory State
  inInMemoryInquiries = inInMemoryInquiries.filter(i => i.id !== id);
  res.json({ success: true, id });
});

// TESTIMONIALS ENDPOINTS
app.get("/api/testimonials", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from("testimonials").select("*");
    if (!error && data) return res.json(data);
  }
  res.json(inInMemoryTestimonials);
});

app.post("/api/testimonials", async (req, res) => {
  const newTestimonial = req.body as Testimonial;
  if (!newTestimonial.id) {
    newTestimonial.id = "testimonial-" + Date.now();
  }

  if (supabase) {
    const { error } = await supabase.from("testimonials").insert([newTestimonial] as any);
    if (!error) return res.status(201).json(newTestimonial);
    console.error("[Supabase Error] testimonials POST failed:", error);
  }

  // Update fallback memory State
  inInMemoryTestimonials = [newTestimonial, ...inInMemoryTestimonials];
  res.status(201).json(newTestimonial);
});

// NOTIFICATIONS ENDPOINTS
app.get("/api/notifications", async (req, res) => {
  if (supabase) {
    const { data, error } = await supabase.from("notifications").select("*").order("createdAt", { ascending: false });
    if (!error && data) return res.json(data);
  }
  res.json(inInMemoryNotifications);
});

app.post("/api/notifications", async (req, res) => {
  const newNotif = req.body as AppNotification;
  if (!newNotif.id) {
    newNotif.id = "notif-" + Math.random().toString(36).substr(2, 9);
  }
  if (!newNotif.createdAt) {
    newNotif.createdAt = new Date().toISOString();
  }

  if (supabase) {
    const { error } = await supabase.from("notifications").insert([newNotif] as any);
    if (!error) return res.status(201).json(newNotif);
    console.error("[Supabase Error] notifications POST failed:", error);
  }

  // Update fallback memory State
  inInMemoryNotifications = [newNotif, ...inInMemoryNotifications];
  res.status(201).json(newNotif);
});

app.put("/api/notifications/:id", async (req, res) => {
  const { id } = req.params;
  const fields = req.body;

  if (supabase) {
    const { error } = await supabase.from("notifications").update(fields as any).eq("id", id);
    if (!error) return res.json({ success: true, id });
    console.error("[Supabase Error] notifications PUT failed:", error);
  }

  // Update fallback memory State
  inInMemoryNotifications = inInMemoryNotifications.map(n => n.id === id ? { ...n, ...fields } : n);
  res.json({ success: true, id });
});

// Dev server / production server setups
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[REAL RECENT LISTINGS] Full-Stack server with live Supabase fallback client active on port ${PORT}`);
  });
}

startServer();
