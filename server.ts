import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { Property, User, Inquiry, AppNotification, Testimonial } from "./src/types";

// Firebase Admin SDK Imports
import admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import firebaseConfig from "./firebase-applet-config.json";

// Seed data
import { SAMPLE_PROPERTIES } from "./src/data";

// Initialize Firebase Admin with credentials inside container environment
const firebaseAdminApp = admin.initializeApp({
  projectId: firebaseConfig.projectId
});
const db = getFirestore(firebaseAdminApp, firebaseConfig.firestoreDatabaseId);

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

// Helper to query firestore collection documents as array
async function fetchCollection<T>(collectionName: string): Promise<T[]> {
  try {
    const snapshot = await db.collection(collectionName).get();
    const items: T[] = [];
    snapshot.forEach((d) => {
      items.push(d.data() as T);
    });
    return items;
  } catch (error) {
    console.error(`Error fetching collection ${collectionName} from Firestore:`, error);
    return [];
  }
}

// Lazy Seeding of Cloud Database
let seeded = false;
async function ensureSeeded() {
  if (seeded) return;
  try {
    // 1. Seed Users
    const usersSnap = await db.collection("users").get();
    if (usersSnap.empty) {
      console.log("[Firebase Seed] Users collection is empty. Populating seed brokers...");
      for (const u of SEED_USERS) {
        await db.collection("users").doc(u.id).set(u);
      }
    }

    // 2. Seed Properties
    const propsSnap = await db.collection("properties").get();
    if (propsSnap.empty) {
      console.log("[Firebase Seed] Properties collection is empty. Populating sample active listings...");
      for (const p of SAMPLE_PROPERTIES) {
        await db.collection("properties").doc(p.id).set(p);
      }
    }
    seeded = true;
    console.log("[Firebase Seed] Seed verification complete. Live cloud storage ready.");
  } catch (err) {
    console.error("[Firebase Seed] Seed checking warning (might be offline/permissions status):", err);
  }
}

// Verify database seed integrity on start
ensureSeeded().catch(e => console.error("Database seed check failed:", e));

// GET all static/dynamic app state (bootstrap JSON)
app.get("/api/data-bootstrap", async (req, res) => {
  await ensureSeeded();
  try {
    const [properties, users, inquiries, notifications, testimonials] = await Promise.all([
      fetchCollection<Property>("properties"),
      fetchCollection<User>("users"),
      fetchCollection<Inquiry>("inquiries"),
      fetchCollection<AppNotification>("notifications"),
      fetchCollection<Testimonial>("testimonials")
    ]);
    res.json({ properties, users, inquiries, notifications, testimonials });
  } catch (err) {
    console.error("Error bootstrapping app data from Firestore:", err);
    res.status(500).json({ error: "Failed to read database store" });
  }
});

// PROPERTIES ENDPOINTS
app.get("/api/properties", async (req, res) => {
  const list = await fetchCollection<Property>("properties");
  res.json(list);
});

app.post("/api/properties", async (req, res) => {
  const newProp = req.body as Property;
  try {
    await db.collection("properties").doc(newProp.id).set(newProp);
    res.status(201).json(newProp);
  } catch (err) {
    console.error(`Error saving property ${newProp.id} to Firestore:`, err);
    res.status(500).json({ error: "Failed to save property listing" });
  }
});

app.put("/api/properties/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  try {
    await db.collection("properties").doc(id).set(updatedFields, { merge: true });
    res.json({ success: true, id });
  } catch (err) {
    console.error(`Error updating property ${id} in Firestore:`, err);
    res.status(500).json({ error: "Failed to update property" });
  }
});

app.delete("/api/properties/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("properties").doc(id).delete();
    res.json({ success: true, id });
  } catch (err) {
    console.error(`Error deleting property ${id} from Firestore:`, err);
    res.status(500).json({ error: "Failed to delete property" });
  }
});

// USERS ENDPOINTS
app.get("/api/users", async (req, res) => {
  const list = await fetchCollection<User>("users");
  res.json(list);
});

app.post("/api/users", async (req, res) => {
  const newUser = req.body as User;
  try {
    await db.collection("users").doc(newUser.id).set(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    console.error(`Error writing user registry ${newUser.id} to Firestore:`, err);
    res.status(500).json({ error: "Failed to create user registry" });
  }
});

app.put("/api/users/:id", async (req, res) => {
  const { id } = req.params;
  const updatedFields = req.body;
  try {
    await db.collection("users").doc(id).set(updatedFields, { merge: true });
    res.json({ success: true, id });
  } catch (err) {
    console.error(`Error updating user profile ${id} in Firestore:`, err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// INQUIRIES ENDPOINTS
app.get("/api/inquiries", async (req, res) => {
  const list = await fetchCollection<Inquiry>("inquiries");
  res.json(list);
});

app.post("/api/inquiries", async (req, res) => {
  const newInq = req.body as Inquiry;
  try {
    await db.collection("inquiries").doc(newInq.id).set(newInq);
    res.status(201).json(newInq);
  } catch (err) {
    console.error(`Error writing inquiry ${newInq.id} to Firestore:`, err);
    res.status(500).json({ error: "Failed to file property inquiry ticket" });
  }
});

app.delete("/api/inquiries/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await db.collection("inquiries").doc(id).delete();
    res.json({ success: true, id });
  } catch (err) {
    console.error(`Error deleting inquiry ${id} from Firestore:`, err);
    res.status(500).json({ error: "Failed to delete inquiry" });
  }
});

// TESTIMONIALS ENDPOINTS
app.get("/api/testimonials", async (req, res) => {
  const list = await fetchCollection<Testimonial>("testimonials");
  res.json(list);
});

app.post("/api/testimonials", async (req, res) => {
  const newTestimonial = req.body as Testimonial;
  try {
    await db.collection("testimonials").doc(newTestimonial.id).set(newTestimonial);
    res.status(201).json(newTestimonial);
  } catch (err) {
    console.error(`Error adding testimonial ${newTestimonial.id} to Firestore:`, err);
    res.status(500).json({ error: "Failed to publish feedback" });
  }
});

// NOTIFICATIONS ENDPOINTS
app.get("/api/notifications", async (req, res) => {
  const list = await fetchCollection<AppNotification>("notifications");
  res.json(list);
});

app.post("/api/notifications", async (req, res) => {
  const newNotif = req.body as AppNotification;
  try {
    await db.collection("notifications").doc(newNotif.id).set(newNotif);
    res.status(201).json(newNotif);
  } catch (err) {
    console.error(`Error saving notification ${newNotif.id} to Firestore:`, err);
    res.status(500).json({ error: "Failed to register notification" });
  }
});

// NOTIFICATIONS PUT ENDPOINT
app.put("/api/notifications/:id", async (req, res) => {
  const { id } = req.params;
  const fields = req.body;
  try {
    await db.collection("notifications").doc(id).set(fields, { merge: true });
    res.json({ success: true });
  } catch (err) {
    console.error(`Error updating notification ${id} in Firestore:`, err);
    res.status(500).json({ error: "Failed to modify notification key" });
  }
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
    console.log(`[REAL RECENT LISTINGS ENHANCED] Full-Stack server running with real Firestore database on port ${PORT}`);
  });
}

startServer();
