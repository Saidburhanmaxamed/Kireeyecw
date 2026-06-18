import { createClient } from "@supabase/supabase-js";
import { Property, User, Inquiry, AppNotification, Testimonial } from "../types";

// Get client-side config from environment variables
const VITE_URL = (import.meta as any).env.VITE_SUPABASE_URL || "https://tdescdhzzktekxkozezq.supabase.co";
const VITE_KEY = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || "";

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
    
    const [pRes, uRes, iRes, nRes, tRes] = await Promise.all([
      supabaseClient.from("properties").select("*").order("createdAt", { ascending: false }),
      supabaseClient.from("users").select("*"),
      supabaseClient.from("inquiries").select("*"),
      supabaseClient.from("notifications").select("*").order("createdAt", { ascending: false }),
      supabaseClient.from("testimonials").select("*")
    ]);

    if (pRes.error) throw pRes.error;

    return {
      properties: pRes.data || [],
      users: uRes.data || [],
      inquiries: iRes.data || [],
      notifications: nRes.data || [],
      testimonials: tRes.data || []
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
  }
};
