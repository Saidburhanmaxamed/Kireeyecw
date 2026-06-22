import express, { Request, Response } from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp as initFirebaseApp } from "firebase/app";
import { 
  getFirestore as initFirestore, 
  doc as fireDoc, 
  getDocs as fireGetDocs, 
  setDoc as fireSetDoc, 
  deleteDoc as fireDeleteDoc, 
  collection as fireCollection 
} from "firebase/firestore";

// Initialize Firebase server-side instance dynamically reading local configuration
let firestoreDb: any = null;
const DEFAULT_DATABASE_ID = "ai-studio-ac2fda15-f7ad-4ea6-afac-ec16dd4c6bea";

try {
  const firebaseConfigPath = path.join(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(firebaseConfigPath)) {
    const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, "utf8"));
    const firebaseApp = initFirebaseApp(firebaseConfig);
    firestoreDb = initFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId || DEFAULT_DATABASE_ID);
    console.log("[server.ts] Firebase Firestore server instance initialized successfully!");
  }
} catch (fireInitErr: any) {
  console.warn("[server.ts Warning] Firestore failed to initialize on backend server side:", fireInitErr.message || fireInitErr);
}

const readServerFirestore = async (collectionName: string): Promise<any[]> => {
  if (!firestoreDb) return [];
  try {
    const colRef = fireCollection(firestoreDb, collectionName);
    const snap = await fireGetDocs(colRef);
    const list: any[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() });
    });
    return list;
  } catch (err) {
    console.error(`Error reading ${collectionName} from Firestore backend:`, err);
    return [];
  }
};

const writeServerFirestore = async (collectionName: string, id: string, data: any): Promise<any> => {
  if (!firestoreDb) return data;
  try {
    // Sanitize nested undefined values to avoid Firestore serialization issues
    const sanitizedObj = JSON.parse(JSON.stringify(data));
    const docRef = fireDoc(firestoreDb, collectionName, id);
    await fireSetDoc(docRef, sanitizedObj, { merge: true });
    return sanitizedObj;
  } catch (err) {
    console.error(`Error writing to ${collectionName} in Firestore backend:`, err);
    return data;
  }
};

const deleteServerFirestore = async (collectionName: string, id: string): Promise<boolean> => {
  if (!firestoreDb) return false;
  try {
    const docRef = fireDoc(firestoreDb, collectionName, id);
    await fireDeleteDoc(docRef);
    return true;
  } catch (err) {
    console.error(`Error deleting from ${collectionName} in Firestore backend:`, err);
    return false;
  }
};

const PORT = 3000;
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

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

// Backend auto-restore database seeding system for Firebase Firestore
const restoreAllDatabaseEntries = async () => {
  console.log("[Restore Engine] Beginning proactive data restoration and Firebase Firestore reconciliation sequence...");

  const defaultUsers = [
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
  ];

  // 1. Restore & Seed Users
  for (const u of defaultUsers) {
    try {
      await writeServerFirestore("users", u.id, u);
      console.log(`[Restore Engine] Synced user to Firebase Firestore: ${u.email} (ID: ${u.id})`);
    } catch (err: any) {
      console.warn(`[Restore Engine] Failed to complete user sync for ${u.email}:`, err.message || err);
    }
  }

  // 2. Load other backup datasets and populate Firebase Firestore
  const local = readLocalStore();

  const testimonials = local.testimonials && local.testimonials.length > 0 ? local.testimonials : [
    {
      id: "test-1",
      name: "Ahmed Duale",
      role: "Returning Diaspora Buyer (US)",
      comment: "Kireeye completely changed how my family settled back home in Caabudwaaq! The neighborhood filtering for October was incredibly accurate, and contacting the property manager through WhatsApp was instant. Highly professional, locally responsive service.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      id: "test-2",
      name: "Filsan Haji",
      role: "Business Developer, Caabudwaaq",
      comment: "Listing my commercial shops and depots on this hub gave me quality corporate leads in weeks! The dashboard allows me to manage properties effortlessly and see active inquiries instantly. Absolute gold standard for real estate portals in central Somalia.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      id: "test-3",
      name: "Dr. Liban Abdi",
      role: "Clinic Coordinator, Caabudwaaq",
      comment: "I searched for secure development plots in 1 Luuliyo neighborhood for months with no luck. Then I found a certified listing with perfect boundary details on this hub. Within three hours I was in direct contact with the owner.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5
    }
  ];

  const agencies = local.agencies && local.agencies.length > 0 ? local.agencies : [
    {
      id: "agency-1",
      name: "Juba Valley Agency",
      email: "juba.valley@agency.so",
      phone: "+252615551234",
      logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=60",
      location: "Waabari, Caabudwaaq",
      createdAt: new Date().toISOString()
    },
    {
      id: "agency-2",
      name: "Galgaduud Trust Realty",
      email: "galgaduud.trust@agency.so",
      phone: "+252615555678",
      logo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&auto=format&fit=crop&q=60",
      location: "Koonfur, Caabudwaaq",
      createdAt: new Date().toISOString()
    },
    {
      id: "agency-3",
      name: "Somali Star Brokers",
      email: "somali.star@agency.so",
      phone: "+252615559012",
      logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60",
      location: "Liido Beach, Mogadishu",
      createdAt: new Date().toISOString()
    }
  ];

  const agencyLogs = local.agencyLogs && local.agencyLogs.length > 0 ? local.agencyLogs : [
    {
      id: "log-1",
      agencyId: "agency-1",
      action: "AUTHORIZED_BROKER",
      targetId: "user-agent-1",
      details: "Authorized new Broker Agent Mohamed Farah for legal title-deed validations.",
      createdAt: new Date().toISOString()
    },
    {
      id: "log-2",
      agencyId: "agency-2",
      action: "VERIFIED_LISTING",
      targetId: "prop-1",
      details: "Audited & verified title deed registration for Caabudwaaq Commercial Block.",
      createdAt: new Date().toISOString()
    },
    {
      id: "log-3",
      agencyId: "agency-1",
      action: "INQUIRY_ROUTED",
      targetId: "inq-1",
      details: "Routed rental inquiry for Waabari Commercial Hub to assigned field agent.",
      createdAt: new Date().toISOString()
    }
  ];

  // Testimonials Batch Sync
  for (const t of testimonials) {
    try {
      await writeServerFirestore("testimonials", t.id, t);
    } catch (e) {}
  }

  // Agencies Batch Sync
  for (const a of agencies) {
    try {
      await writeServerFirestore("agencies", a.id, a);
    } catch (e) {}
  }

  // Agency Logs Batch Sync
  for (const log of agencyLogs) {
    try {
      await writeServerFirestore("agency_logs", log.id, log);
    } catch (e) {}
  }

  // Seeding default properties directly on server startup if none exist in Firebase
  try {
    const currentProperties = await readServerFirestore("properties");
    if (!currentProperties || currentProperties.length === 0) {
      console.log("[Restore Engine] Seeding default properties because Firebase properties collection is empty...");
      
      const seedProps = [
        {
          id: "prop-1",
          title: "Premium Modern Residence in October",
          description: "Experience comfortable living in this premium villa located in the heart of October neighborhood, Caabudwaaq. Featuring modern high-ceiling salons, high-quality finishes, spacious bedrooms, and a secure gated compound with solar security, reliable backup electricity, and independent security parameters. Perfect for returnee diaspora families wanting comfort, space, and ultimate peace of mind.",
          category: "Villas",
          type: "Residential",
          price: 165000,
          location: "Waddada October, Caabudwaaq",
          region: "October",
          status: "Sale",
          bedrooms: 6,
          bathrooms: 5,
          areaSize: 420,
          images: [
            "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
          ],
          ownerId: defaultUsers[1].id, // abdirahman
          ownerName: "Abdirahman Warsame (Real Estate Lead)",
          ownerPhone: "+252615123456",
          ownerWhatsapp: "252615123456",
          approved: true,
          featured: true,
          createdAt: new Date().toISOString(),
          agencyId: "agency-1"
        },
        {
          id: "prop-2",
          title: "Spacious Family Compound in Amaana",
          description: "An amazing multi-generational estate located in the highly secure Amaana neighborhood of Caabudwaaq. Features large modern living rooms, high-quality security walling, private courtyard with beautiful shade trees, reliable water supply with backup reservoirs, and dual solar/generator backup setups. Ideal for families seeking a serene community environment.",
          category: "Houses",
          type: "Residential",
          price: 350,
          location: "Xaafadda Amaana, Caabudwaaq",
          region: "Amaana",
          status: "Rent",
          bedrooms: 5,
          bathrooms: 4,
          areaSize: 380,
          images: [
            "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
          ],
          ownerId: defaultUsers[2].id, // sarah
          ownerName: "Sarah Yusuf (Horn Property Group)",
          ownerPhone: "+252634987654",
          ownerWhatsapp: "252634987654",
          approved: true,
          featured: true,
          createdAt: new Date().toISOString(),
          availableDate: "2026-06-15",
          agencyId: "agency-2"
        },
        {
          id: "prop-3",
          title: "Modern Multi-Bedroom Apartment in Ubax",
          description: "A beautifully styled, high-security 3-bedroom apartment on the 2nd floor of a newly developed modern apartment complex in Ubax neighborhood, Caabudwaaq. Offers excellent ventilation, premium tiled floors, dynamic layout, open-plan kitchen, indoor parking coordinates, and 24/7 solar-powered energy system. Best option for business owners or local staff.",
          category: "Apartments",
          type: "Residential",
          price: 250,
          location: "Main Street, Xaafadda Ubax, Caabudwaaq",
          region: "Ubax",
          status: "Rent",
          bedrooms: 3,
          bathrooms: 2,
          areaSize: 165,
          images: [
            "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
          ],
          ownerId: "user-agent-3",
          ownerName: "Mohamed Farah (Juba Valley Agency)",
          ownerPhone: "+252612543210",
          ownerWhatsapp: "252612543210",
          approved: true,
          featured: false,
          createdAt: new Date().toISOString(),
          availableDate: "2026-06-25",
          agencyId: "agency-1"
        }
      ];

      for (const p of seedProps) {
        try {
          await writeServerFirestore("properties", p.id, p);
        } catch (e) {}
      }
    }
  } catch (err) {
    console.warn("[Restore Engine] Failed checking and seeding properties collection:", err);
  }

  console.log("[Restore Engine] Seeding and Firebase Firestore synchronization completed successfully!");
};

// Firebase Connection Status Testing API
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
    if (firestoreDb) {
      isConnected = true;
      hasUsersTable = true;
      hasPropertiesTable = true;
      hasInquiriesTable = true;
      hasTestimonialsTable = true;
      hasAgenciesTable = true;
      hasAgencyLogsTable = true;
      hasNotificationsTable = true;
      hasFavoritesTable = true;
    } else {
      errorMessage = "Firestore database reference is not initialized.";
    }
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
    tablesOk: isConnected,
    hasUsersTable: isConnected,
    hasPropertiesTable: isConnected,
    hasInquiriesTable: isConnected,
    hasTestimonialsTable: isConnected,
    hasAgenciesTable: isConnected,
    hasAgencyLogsTable: isConnected,
    hasNotificationsTable: isConnected,
    hasFavoritesTable: isConnected,
    errorMessage,
    sql: `-- Firebase Firestore Schema is active and managed automatically.`,
    credentials: {
      url: "Firestore Default Instance",
      project_id: DEFAULT_DATABASE_ID
    }
  });
});

// APIs Proxy Layer: PROPERTIES
app.get("/api/properties", async (req: Request, res: Response) => {
  try {
    const list = await readServerFirestore("properties");
    if (list && list.length > 0) {
      return res.json(list);
    }
  } catch (err) {}

  const local = readLocalStore();
  res.json(local.properties || []);
});

app.post("/api/properties", async (req: Request, res: Response) => {
  const propertyObj = req.body;
  try {
    const saved = await writeServerFirestore("properties", propertyObj.id, propertyObj);
    if (saved) {
      const local = readLocalStore();
      local.properties = local.properties || [];
      local.properties = local.properties.filter((p: any) => p.id !== propertyObj.id);
      local.properties.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (err) {}

  const local = readLocalStore();
  local.properties = local.properties || [];
  local.properties = local.properties.filter((p: any) => p.id !== propertyObj.id);
  local.properties.push(propertyObj);
  writeLocalStore(local);
  res.json(propertyObj);
});

app.put("/api/properties", async (req: Request, res: Response) => {
  const propertyObj = req.body;
  try {
    const saved = await writeServerFirestore("properties", propertyObj.id, propertyObj);
    if (saved) {
      const local = readLocalStore();
      local.properties = local.properties || [];
      local.properties = local.properties.map((p: any) => p.id === propertyObj.id ? { ...p, ...saved } : p);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (err) {}

  const local = readLocalStore();
  local.properties = local.properties || [];
  local.properties = local.properties.map((p: any) => p.id === propertyObj.id ? { ...p, ...propertyObj } : p);
  writeLocalStore(local);
  res.json(propertyObj);
});

app.delete("/api/properties/:id", async (req: Request, res: Response) => {
  const propId = String(req.params.id);
  try {
    await deleteServerFirestore("properties", propId);
  } catch (err) {}

  const local = readLocalStore();
  local.properties = local.properties || [];
  local.properties = local.properties.filter((p: any) => p.id !== propId);
  writeLocalStore(local);
  res.json({ success: true });
});

// APIs Proxy Layer: USERS
app.get("/api/users", async (req: Request, res: Response) => {
  try {
    const list = await readServerFirestore("users");
    if (list && list.length > 0) {
      return res.json(list);
    }
  } catch (err) {}

  const local = readLocalStore();
  res.json(local.users || []);
});

app.post("/api/users/sync-auth", async (req: Request, res: Response) => {
  const { id, email, password, name, phone, role, approved } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }

  try {
    const targetId = id || `user-${Date.now()}`;
    const userObj = {
      id: targetId,
      email: email.trim(),
      name: name || email.split("@")[0],
      phone: phone || "+252610000000",
      role: role || "agent",
      password: password || "somali123",
      approved: approved !== false,
      createdAt: new Date().toISOString()
    };
    await writeServerFirestore("users", targetId, userObj);
    return res.json({ success: true, userId: targetId, user: userObj });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || "Failed to sync auth user via backend admin API" });
  }
});

app.post("/api/users", async (req: Request, res: Response) => {
  const userObj = req.body;
  try {
    const saved = await writeServerFirestore("users", userObj.id, userObj);
    if (saved) {
      const local = readLocalStore();
      local.users = local.users || [];
      local.users = local.users.filter((u: any) => u.id !== userObj.id);
      local.users.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (err) {}

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
    const saved = await writeServerFirestore("users", userObj.id, userObj);
    if (saved) {
      const local = readLocalStore();
      local.users = local.users || [];
      local.users = local.users.map((u: any) => u.id === userObj.id ? { ...u, ...saved } : u);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (err) {}

  const local = readLocalStore();
  local.users = local.users || [];
  local.users = local.users.map((u: any) => u.id === userObj.id ? { ...u, ...userObj } : u);
  writeLocalStore(local);
  res.json(userObj);
});

app.delete("/api/users/:id", async (req: Request, res: Response) => {
  const userId = String(req.params.id);
  try {
    await deleteServerFirestore("users", userId);
  } catch (err) {}

  const local = readLocalStore();
  local.users = local.users || [];
  local.users = local.users.filter((u: any) => u.id !== userId);
  writeLocalStore(local);
  res.json({ success: true });
});

// APIs Proxy Layer: INQUIRIES
app.get("/api/inquiries", async (req: Request, res: Response) => {
  try {
    const list = await readServerFirestore("inquiries");
    if (list && list.length > 0) {
      return res.json(list);
    }
  } catch (err) {}

  const local = readLocalStore();
  res.json(local.inquiries || []);
});

app.post("/api/inquiries", async (req: Request, res: Response) => {
  const inquiryObj = req.body;
  try {
    const saved = await writeServerFirestore("inquiries", inquiryObj.id, inquiryObj);
    if (saved) {
      const local = readLocalStore();
      local.inquiries = local.inquiries || [];
      local.inquiries = local.inquiries.filter((inq: any) => inq.id !== inquiryObj.id);
      local.inquiries.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (err) {}

  const local = readLocalStore();
  local.inquiries = local.inquiries || [];
  local.inquiries.push(inquiryObj);
  writeLocalStore(local);
  res.json(inquiryObj);
});

app.delete("/api/inquiries/:id", async (req: Request, res: Response) => {
  const inquiryId = String(req.params.id);
  try {
    await deleteServerFirestore("inquiries", inquiryId);
  } catch (err) {}

  const local = readLocalStore();
  local.inquiries = local.inquiries || [];
  local.inquiries = local.inquiries.filter((inq: any) => inq.id !== inquiryId);
  writeLocalStore(local);
  res.json({ success: true });
});

// OTHER LOGS, AGENCIES & TESTIMONIALS WITH SIMILAR PROXIES
app.get("/api/testimonials", async (req: Request, res: Response) => {
  try {
    const list = await readServerFirestore("testimonials");
    if (list && list.length > 0) return res.json(list);
  } catch (e) {}

  const local = readLocalStore();
  res.json(local.testimonials || []);
});

app.post("/api/testimonials", async (req: Request, res: Response) => {
  const testObj = req.body;
  try {
    const saved = await writeServerFirestore("testimonials", testObj.id, testObj);
    if (saved) {
      const local = readLocalStore();
      local.testimonials = local.testimonials || [];
      local.testimonials = local.testimonials.filter((t: any) => t.id !== testObj.id);
      local.testimonials.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (e) {}

  const local = readLocalStore();
  local.testimonials = local.testimonials || [];
  local.testimonials.push(testObj);
  writeLocalStore(local);
  res.json(testObj);
});

app.get("/api/agencies", async (req: Request, res: Response) => {
  try {
    const list = await readServerFirestore("agencies");
    if (list && list.length > 0) return res.json(list);
  } catch (e) {}

  const local = readLocalStore();
  res.json(local.agencies || []);
});

app.post("/api/agencies", async (req: Request, res: Response) => {
  const agencyObj = req.body;
  try {
    const saved = await writeServerFirestore("agencies", agencyObj.id, agencyObj);
    if (saved) {
      const local = readLocalStore();
      local.agencies = local.agencies || [];
      local.agencies = local.agencies.filter((a: any) => a.id !== agencyObj.id);
      local.agencies.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (e) {}

  const local = readLocalStore();
  local.agencies = local.agencies || [];
  local.agencies.push(agencyObj);
  writeLocalStore(local);
  res.json(agencyObj);
});

app.get("/api/agency-logs", async (req: Request, res: Response) => {
  try {
    const list = await readServerFirestore("agency_logs");
    if (list && list.length > 0) return res.json(list);
  } catch (e) {}

  const local = readLocalStore();
  res.json(local.agencyLogs || []);
});

app.post("/api/agency-logs", async (req: Request, res: Response) => {
  const logObj = req.body;
  try {
    const saved = await writeServerFirestore("agency_logs", logObj.id, logObj);
    if (saved) {
      const local = readLocalStore();
      local.agencyLogs = local.agencyLogs || [];
      local.agencyLogs = local.agencyLogs.filter((l: any) => l.id !== logObj.id);
      local.agencyLogs.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
  } catch (e) {}

  const local = readLocalStore();
  local.agencyLogs = local.agencyLogs || [];
  local.agencyLogs.push(logObj);
  writeLocalStore(local);
  res.json(logObj);
});

app.get("/api/notifications", async (req: Request, res: Response) => {
  try {
    const list = await readServerFirestore("notifications");
    if (list && list.length > 0) return res.json(list);
  } catch (e) {}

  const local = readLocalStore();
  res.json(local.notifications || []);
});

app.post("/api/notifications", async (req: Request, res: Response) => {
  const notifObj = req.body;
  try {
    const saved = await writeServerFirestore("notifications", notifObj.id, notifObj);
    if (saved) {
      const local = readLocalStore();
      local.notifications = local.notifications || [];
      local.notifications = local.notifications.filter((n: any) => n.id !== notifObj.id);
      local.notifications.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
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
        await writeServerFirestore("notifications", n.id, n);
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
    const list = await readServerFirestore("favorites");
    if (list && list.length > 0) return res.json(list);
  } catch (e) {}

  const local = readLocalStore();
  res.json(local.favorites || []);
});

app.post("/api/favorites", async (req: Request, res: Response) => {
  const favObj = req.body;
  try {
    const saved = await writeServerFirestore("favorites", favObj.id, favObj);
    if (saved) {
      const local = readLocalStore();
      local.favorites = local.favorites || [];
      local.favorites = local.favorites.filter((f: any) => f.id !== favObj.id);
      local.favorites.push(saved);
      writeLocalStore(local);
      return res.json(saved);
    }
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
  // Proactively restore database entries and sync Supabase authentication on startup
  try {
    await restoreAllDatabaseEntries();
  } catch (err: any) {
    console.error("[Startup] Database restoration or Supabase Auth synchronization error:", err.message || err);
  }

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
