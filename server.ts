import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { Property, User, Inquiry, AppNotification, Testimonial } from "./src/types";

// Seed data from properties list
import { SAMPLE_PROPERTIES } from "./src/data";

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(process.cwd(), "data-store.json");

// Increase payload limits for Base64 image uploads by agencies
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Default Seed Users (matching those in App.tsx)
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

interface DataStoreSchema {
  properties: Property[];
  users: User[];
  inquiries: Inquiry[];
  notifications: AppNotification[];
  testimonials: Testimonial[];
}

// Ensure database file exists
function readStore(): DataStoreSchema {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      const initialStore: DataStoreSchema = {
        properties: SAMPLE_PROPERTIES,
        users: SEED_USERS,
        inquiries: [],
        notifications: [],
        testimonials: []
      };
      fs.writeFileSync(DATA_FILE, JSON.stringify(initialStore, null, 2), "utf8");
      return initialStore;
    }
    const raw = fs.readFileSync(DATA_FILE, "utf8");
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading data store JSON:", err);
    return {
      properties: SAMPLE_PROPERTIES,
      users: SEED_USERS,
      inquiries: [],
      notifications: [],
      testimonials: []
    };
  }
}

function writeStore(data: DataStoreSchema) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error writing to data store JSON:", err);
  }
}

// GET all static/dynamic app state
app.get("/api/data-bootstrap", (req, res) => {
  const store = readStore();
  res.json(store);
});

// PROPERTIES ENDPOINTS
app.get("/api/properties", (req, res) => {
  const store = readStore();
  res.json(store.properties);
});

app.post("/api/properties", (req, res) => {
  const store = readStore();
  const newProp = req.body as Property;
  
  // Clean duplicates up
  store.properties = [newProp, ...store.properties.filter(p => p.id !== newProp.id)];
  writeStore(store);
  res.status(201).json(newProp);
});

app.put("/api/properties/:id", (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const updatedFields = req.body;
  
  store.properties = store.properties.map(p => {
    if (p.id === id) {
      return { ...p, ...updatedFields };
    }
    return p;
  });
  writeStore(store);
  res.json({ success: true, id });
});

app.delete("/api/properties/:id", (req, res) => {
  const store = readStore();
  const { id } = req.params;
  
  store.properties = store.properties.filter(p => p.id !== id);
  writeStore(store);
  res.json({ success: true, id });
});

// USERS ENDPOINTS
app.get("/api/users", (req, res) => {
  const store = readStore();
  res.json(store.users);
});

app.post("/api/users", (req, res) => {
  const store = readStore();
  const newUser = req.body as User;
  
  store.users = [...store.users.filter(u => u.email.toLowerCase() !== newUser.email.toLowerCase() && u.id !== newUser.id), newUser];
  writeStore(store);
  res.status(201).json(newUser);
});

app.put("/api/users/:id", (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const updatedUserFields = req.body;
  
  store.users = store.users.map(u => {
    if (u.id === id) {
      return { ...u, ...updatedUserFields };
    }
    return u;
  });
  writeStore(store);
  res.json({ success: true, id });
});

// INQUIRIES ENDPOINTS
app.get("/api/inquiries", (req, res) => {
  const store = readStore();
  res.json(store.inquiries);
});

app.post("/api/inquiries", (req, res) => {
  const store = readStore();
  const newInq = req.body as Inquiry;
  
  store.inquiries = [newInq, ...store.inquiries];
  writeStore(store);
  res.status(201).json(newInq);
});

app.delete("/api/inquiries/:id", (req, res) => {
  const store = readStore();
  const { id } = req.params;
  
  store.inquiries = store.inquiries.filter(i => i.id !== id);
  writeStore(store);
  res.json({ success: true, id });
});

// TESTIMONIALS ENDPOINTS
app.get("/api/testimonials", (req, res) => {
  const store = readStore();
  res.json(store.testimonials);
});

app.post("/api/testimonials", (req, res) => {
  const store = readStore();
  const newTestimonial = req.body as Testimonial;
  
  store.testimonials = [newTestimonial, ...store.testimonials];
  writeStore(store);
  res.status(201).json(newTestimonial);
});

// NOTIFICATIONS ENDPOINTS
app.get("/api/notifications", (req, res) => {
  const store = readStore();
  res.json(store.notifications);
});

app.post("/api/notifications", (req, res) => {
  const store = readStore();
  const newNotif = req.body as AppNotification;
  
  store.notifications = [newNotif, ...store.notifications];
  writeStore(store);
  res.status(201).json(newNotif);
});

app.put("/api/notifications/:id", (req, res) => {
  const store = readStore();
  const { id } = req.params;
  const fields = req.body;
  
  store.notifications = store.notifications.map(n => n.id === id ? { ...n, ...fields } : n);
  writeStore(store);
  res.json({ success: true });
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
    console.log(`[REAL RECENT LISTINGS ENHANCED] Full-Stack server running on port ${PORT}`);
  });
}

startServer();
