import { createClient } from "@supabase/supabase-js";
import { Property, User, Inquiry, AppNotification, Testimonial, Agency, AgencyLog } from "../types";

// Get client-side config from environment variables
let VITE_URL = ((import.meta as any).env.VITE_SUPABASE_URL || "https://tdescdhzzktekxkozezq.supabase.co").trim();
if (VITE_URL.endsWith("/rest/v1/")) {
  VITE_URL = VITE_URL.slice(0, -9);
} else if (VITE_URL.endsWith("/rest/v1")) {
  VITE_URL = VITE_URL.slice(0, -8);
}
if (VITE_URL.endsWith("/")) {
  VITE_URL = VITE_URL.slice(0, -1);
}

const VITE_KEY = ((import.meta as any).env.VITE_SUPABASE_ANON_KEY || "sb_publishable_mOweHozV1BYtVdQXtWLHhQ_tsO9abQt").trim();

// Initialize Supabase Client if Configured on client side
let supabaseClient: any = null;

if (VITE_URL && VITE_KEY) {
  try {
    supabaseClient = createClient(VITE_URL, VITE_KEY);
    console.log("[Supabase Client SDK] Initialized direct client-side Supabase connection");
  } catch (err) {
    console.error("[Supabase Client SDK] Initialization error:", err);
  }
}

export { supabaseClient };

// Utility helper to check if client-side Supabase connectivity is fully ready
export async function testClientDbConnection(): Promise<boolean> {
  if (!supabaseClient) return false;
  try {
    const { data, error } = await supabaseClient.from("properties").select("id").limit(1);
    return !error;
  } catch {
    return false;
  }
}

// Client-side Direct API Queries
export const supabaseDirectApi = {
  async fetchBootstrapData() {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    
    const [pRes, uRes, iRes, nRes, tRes, aRes, alRes] = await Promise.all([
      supabaseClient.from("properties").select("*").order("createdAt", { ascending: false }),
      supabaseClient.from("users").select("*"),
      supabaseClient.from("inquiries").select("*"),
      supabaseClient.from("notifications").select("*").order("createdAt", { ascending: false }),
      supabaseClient.from("testimonials").select("*"),
      supabaseClient.from("agencies").select("*"),
      supabaseClient.from("agency_logs").select("*").order("createdAt", { ascending: false })
    ]);

    if (pRes.error) throw pRes.error;

    return {
      properties: pRes.data || [],
      users: uRes.data || [],
      inquiries: iRes.data || [],
      notifications: nRes.data || [],
      testimonials: tRes.data || [],
      agencies: aRes.data || [],
      agencyLogs: alRes.data || []
    };
  },

  async insertProperty(prop: Property) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("properties").insert([prop]);
    if (error) throw error;
    return prop;
  },

  async updateProperty(id: string, fields: Partial<Property>) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("properties").update(fields).eq("id", id);
    if (error) throw error;
    return { success: true, id };
  },

  async deleteProperty(id: string) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("properties").delete().eq("id", id);
    if (error) throw error;
    return { success: true, id };
  },

  async insertUser(user: User) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("users").insert([user]);
    if (error) throw error;
    return user;
  },

  async updateUser(id: string, fields: Partial<User>) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("users").update(fields).eq("id", id);
    if (error) throw error;
    return { success: true, id };
  },

  async insertInquiry(inq: Inquiry) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("inquiries").insert([inq]);
    if (error) throw error;
    return inq;
  },

  async deleteInquiry(id: string) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("inquiries").delete().eq("id", id);
    if (error) throw error;
    return { success: true, id };
  },

  async insertTestimonial(testimonial: Testimonial) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("testimonials").insert([testimonial]);
    if (error) throw error;
    return testimonial;
  },

  async insertNotification(notif: AppNotification) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("notifications").insert([notif]);
    if (error) throw error;
    return notif;
  },

  async updateNotification(id: string, fields: Partial<AppNotification>) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("notifications").update(fields).eq("id", id);
    if (error) throw error;
    return { success: true, id };
  },

  async insertAgency(agency: Agency) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("agencies").insert([agency]);
    if (error) throw error;
    return agency;
  },

  async deleteAgency(id: string) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("agencies").delete().eq("id", id);
    if (error) throw error;
    return { success: true, id };
  },

  async insertAgencyLog(log: AgencyLog) {
    if (!supabaseClient) throw new Error("Supabase client is not initialized");
    const { error } = await supabaseClient.from("agency_logs").insert([log]);
    if (error) throw error;
    return log;
  }
};
