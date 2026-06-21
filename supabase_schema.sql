-- =========================================================================
-- Kireeye 60-Second Supabase SQL Database Schema & Setup Script
-- Project ID: slfrjuherxhychvmljll
-- Description: Run this SQL directly in your Supabase SQL Editor to create all
--              necessary tables, seed initial sample data, & disable RLS for direct syncing.
-- =========================================================================

-- Step 1: Clean/Drop existing tables if migrating/testing (Optional)
-- DROP TABLE IF EXISTS favorites CASCADE;
-- DROP TABLE IF EXISTS notifications CASCADE;
-- DROP TABLE IF EXISTS agency_logs CASCADE;
-- DROP TABLE IF EXISTS agencies CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS inquiries CASCADE;
-- DROP TABLE IF EXISTS properties CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;

-- -------------------------------------------------------------
-- 1. Create Users Table
-- -------------------------------------------------------------
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

-- -------------------------------------------------------------
-- 2. Create Properties Table
-- -------------------------------------------------------------
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
  bedrooms INTEGER NOT NULL DEFAULT 0,
  bathrooms INTEGER NOT NULL DEFAULT 0,
  "areaSize" NUMERIC NOT NULL DEFAULT 0,
  images TEXT[] NOT NULL DEFAULT '{}',
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

-- -------------------------------------------------------------
-- 3. Create Inquiries Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS inquiries (
  id TEXT PRIMARY KEY,
  "propertyId" TEXT NOT NULL,
  "propertyTitle" TEXT NOT NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  message TEXT NOT NULL,
  date TEXT NOT NULL
);

-- -------------------------------------------------------------
-- 4. Create Testimonials Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  comment TEXT NOT NULL,
  avatar TEXT NOT NULL,
  rating INTEGER NOT NULL DEFAULT 5
);

-- -------------------------------------------------------------
-- 5. Create Agencies Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  logo TEXT,
  location TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 6. Create Agency Logs Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS agency_logs (
  id TEXT PRIMARY KEY,
  "agencyId" TEXT NOT NULL,
  action TEXT NOT NULL,
  "targetId" TEXT,
  details TEXT,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- -------------------------------------------------------------
-- 7. Create Notifications Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'general',
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- -------------------------------------------------------------
-- 8. Create Favorites Table
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS favorites (
  id TEXT PRIMARY KEY,
  "userId" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =========================================================================
-- Step 2: Disable Row Level Security (RLS)
-- By default, Supabase tables block anonymous select/insert queries unless
-- RLS policies are specifically allowed. Disabling RLS guarantees instant
-- operation.
-- =========================================================================
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE properties DISABLE ROW LEVEL SECURITY;
ALTER TABLE inquiries DISABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials DISABLE ROW LEVEL SECURITY;
ALTER TABLE agencies DISABLE ROW LEVEL SECURITY;
ALTER TABLE agency_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE notifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE favorites DISABLE ROW LEVEL SECURITY;

-- =========================================================================
-- Step 3: Seed Initial Data
-- Insert admin user and sample locations matching local_store.json config
-- =========================================================================

-- Insert default admin user: "admin-ibnu" / "Maalinle555"
INSERT INTO users (id, name, email, role, phone, password, approved)
VALUES (
  'admin-ibnu', 
  'Ibnuburhan Guud', 
  'Ibnuburhan555@gmail.com', 
  'admin', 
  '+252615555555', 
  'Maalinle555', 
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- Insert premium agent 1
INSERT INTO users (id, name, email, role, phone, password, approved)
VALUES (
  'user-agent-1', 
  'Abdirahman Warsame (Real Estate Lead)', 
  'abdirahman@realestate.so', 
  'agent', 
  '+252615123456', 
  'somali123', 
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- Insert premium agent 2
INSERT INTO users (id, name, email, role, phone, password, approved)
VALUES (
  'user-agent-2', 
  'Sarah Yusuf (Horn Property Group)', 
  'sarah@realestate.so', 
  'agent', 
  '+252634987654', 
  'somali123', 
  TRUE
) ON CONFLICT (id) DO NOTHING;

-- Add sample agencies
INSERT INTO agencies (id, name, email, phone, location)
VALUES (
  'agency-1',
  'Horn of Africa Real Estate Group',
  'info@hornrealestate.so',
  '+252615999888',
  'Mogadishu, Somalia'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO agencies (id, name, email, phone, location)
VALUES (
  'agency-2',
  'Golis Properties Hargeisa',
  'contact@golisprop.com',
  '+25263444555',
  'Hargeisa, Somaliland'
) ON CONFLICT (id) DO NOTHING;

-- Seed properties matching local_store.json
INSERT INTO properties (
  id, title, description, category, type, price, location, region, status, 
  bedrooms, bathrooms, "areaSize", images, "ownerId", "ownerName", "ownerPhone", 
  "ownerWhatsapp", approved, featured, "agencyId"
) VALUES (
  'prop-1', 
  'Premium Modern Residence in October', 
  'Experience comfortable living in this premium villa located in the heart of October neighborhood, Caabudwaaq. Featuring modern high-ceiling salons, high-quality finishes, spacious bedrooms, and a secure gated compound with solar security, reliable backup electricity, and independent security parameters. Perfect for returnee diaspora families wanting comfort, space, and ultimate peace of mind.',
  'Villas', 
  'Residential', 
  165000, 
  'Waddada October, Caabudwaaq', 
  'October', 
  'Sale', 
  6, 
  5, 
  420, 
  ARRAY[
    'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
  ],
  'user-agent-1', 
  'Abdirahman Warsame (Real Estate Lead)', 
  '+252615123456', 
  '252615123456', 
  TRUE, 
  TRUE,
  'agency-1'
) ON CONFLICT (id) DO NOTHING;

-- Seed Testimonials
INSERT INTO testimonials (id, name, role, comment, avatar, rating)
VALUES (
  'test-1',
  'Mustafe Farah',
  'Diaspora Buyer',
  'Aad iyo aad ayaan ugu qancay adeegooda. Waxaan Caabudwaaq ka iibsaday guri aad u qurux badan anigoo jooga UK.',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
  5
) ON CONFLICT (id) DO NOTHING;

-- Setup Notification
INSERT INTO notifications (id, title, message, type, read)
VALUES (
  'notif-init',
  'Teleskopka Supabase',
  'Nidaamka is-waafajinta gogosha macluumaadka Supabase ayaa toos u hawlgalay.',
  'success',
  FALSE
) ON CONFLICT (id) DO NOTHING;
