/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  SAMPLE_PROPERTIES, 
  SAMPLE_FAQS, 
  SAMPLE_TESTIMONIALS,
  SEED_AGENCIES,
  SEED_AGENCY_LOGS
} from "./data";
import { 
  Property, 
  User, 
  Inquiry, 
  AppNotification, 
  PropertyStatus,
  PropertyCategory,
  Testimonial,
  Agency,
  AgencyLog 
} from "./types";
import Header from "./components/Header";
import Hero, { SearchFilters } from "./components/Hero";
import PropertyGrid from "./components/PropertyGrid";
import PropertyDetailModal from "./components/PropertyDetailModal";
import AuthModal from "./components/AuthModal";
import UserDashboard from "./components/UserDashboard";
import AdminDashboard from "./components/AdminDashboard";
import ContactPage from "./components/ContactPage";
import Footer from "./components/Footer";
import { Info, Bell, CheckCircle2, Heart, MessageSquare, Sparkles } from "lucide-react";
import { Language } from "./localization";
import { supabase } from "./supabase";


// Initial seed users
const INITIAL_USERS: User[] = [
  {
    id: "admin-ibnu",
    name: "Ibnuburhan Guud",
    email: "Ibnuburhan555@gmail.com",
    role: "admin",
    phone: "+252615555555",
    password: "Maalinle555",
    approved: true,
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
    approved: true,
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
    approved: true,
    createdAt: new Date("2026-04-20").toISOString()
  }
];

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Language state
  const [language, setLanguage] = useState<Language>("en");

  // Core Data States
  const [properties, setProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [registeredUsers, setRegisteredUsers] = useState<User[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [agencies, setAgencies] = useState<Agency[]>([]);
  const [agencyLogs, setAgencyLogs] = useState<AgencyLog[]>([]);

  // Navigation State & Search Filters
  const [activeTab, setActiveTab] = useState<string>("home");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters | null>(null);
  const [showNewEntriesOnly, setShowNewEntriesOnly] = useState(false);
  
  // Modals & Floating Drawer states
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<"login" | "register">("login");

  // Floating Toast Alert notification indicator
  const [toastMessage, setToastMessage] = useState<{ type: "success" | "info" | "heart"; text: string } | null>(null);

  // Scroll to top when activeTab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [activeTab]);

  // Load and seed initial states from LocalStorage and Express/Supabase proxy API
  useEffect(() => {
    // 0. Language
    const savedLang = localStorage.getItem("sre_language") as Language | null;
    if (savedLang === "en" || savedLang === "so") {
      setLanguage(savedLang);
    } else {
      setLanguage("en");
      localStorage.setItem("sre_language", "en");
    }

    // 1. Theme
    setTheme("light");
    document.documentElement.classList.remove("dark");
    localStorage.setItem("sre_theme", "light");

    // 2. Fetch/Load offline fallback states first for instant rendering
    const localPropsStr = localStorage.getItem("sre_properties");
    if (localPropsStr) {
      setProperties(JSON.parse(localPropsStr));
    } else {
      setProperties(SAMPLE_PROPERTIES);
      localStorage.setItem("sre_properties", JSON.stringify(SAMPLE_PROPERTIES));
    }

    const localUsersStr = localStorage.getItem("sre_registered_users");
    if (localUsersStr) {
      setRegisteredUsers(JSON.parse(localUsersStr));
    } else {
      setRegisteredUsers(INITIAL_USERS);
      localStorage.setItem("sre_registered_users", JSON.stringify(INITIAL_USERS));
    }

    const localInquiriesStr = localStorage.getItem("sre_inquiries");
    if (localInquiriesStr) {
      setInquiries(JSON.parse(localInquiriesStr));
    }

    const localNotifsStr = localStorage.getItem("sre_notifications");
    if (localNotifsStr) {
      setNotifications(JSON.parse(localNotifsStr));
    }

    const localTestimonialsStr = localStorage.getItem("sre_testimonials");
    if (localTestimonialsStr) {
      setTestimonials(JSON.parse(localTestimonialsStr));
    } else {
      setTestimonials(SAMPLE_TESTIMONIALS);
    }

    const localAgenciesStr = localStorage.getItem("sre_agencies");
    if (localAgenciesStr) {
      setAgencies(JSON.parse(localAgenciesStr));
    } else {
      setAgencies(SEED_AGENCIES);
    }

    const localAgencyLogsStr = localStorage.getItem("sre_agency_logs");
    if (localAgencyLogsStr) {
      setAgencyLogs(JSON.parse(localAgencyLogsStr));
    } else {
      setAgencyLogs(SEED_AGENCY_LOGS);
    }

    // Current logged-in Broker/Admin persistence
    const savedUser = localStorage.getItem("sre_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // Try to auto-connect with active Supabase browser/auth session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !localStorage.getItem("sre_current_user")) {
        const savedUsersStr = localStorage.getItem("sre_registered_users") || "[]";
        const savedUsers: User[] = JSON.parse(savedUsersStr);
        let matchedUser = savedUsers.find(u => u.email.toLowerCase() === session.user.email?.toLowerCase());
        if (!matchedUser) {
          matchedUser = {
            id: session.user.id,
            name: session.user.user_metadata?.name || session.user.email?.split("@")[0] || "Supabase Broker",
            email: session.user.email || "",
            username: session.user.email?.toLowerCase().split("@")[0],
            role: session.user.user_metadata?.role || "buyer",
            phone: session.user.user_metadata?.phone || "+252610000000",
            approved: session.user.user_metadata?.approved !== false,
            createdAt: session.user.created_at || new Date().toISOString()
          };
        }
        setCurrentUser(matchedUser);
        localStorage.setItem("sre_current_user", JSON.stringify(matchedUser));
      }
    }).catch(err => {
      console.warn("Supabase auth check error during boot sequence:", err);
    });

    // Saved Favorites catalog
    const savedFavs = localStorage.getItem("sre_favorites");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    }

    // 3. Initiate background sync connection with Express + Supabase
    const syncBackendData = async () => {
      try {
        const [
          resProps,
          resUsers,
          resInquiries,
          resTestimonials,
          resAgencies,
          resLogs,
          resNotifs,
          resFavs
        ] = await Promise.all([
          fetch("/api/properties").then(r => r.json()).catch(() => null),
          fetch("/api/users").then(r => r.json()).catch(() => null),
          fetch("/api/inquiries").then(r => r.json()).catch(() => null),
          fetch("/api/testimonials").then(r => r.json()).catch(() => null),
          fetch("/api/agencies").then(r => r.json()).catch(() => null),
          fetch("/api/agency-logs").then(r => r.json()).catch(() => null),
          fetch("/api/notifications").then(r => r.json()).catch(() => null),
          fetch("/api/favorites").then(r => r.json()).catch(() => null)
        ]);

        if (resProps && Array.isArray(resProps)) {
          if (resProps.length > 0) {
            setProperties(resProps);
            localStorage.setItem("sre_properties", JSON.stringify(resProps));
          } else {
            // Seed Supabase if empty on backend
            const defaults = JSON.parse(localStorage.getItem("sre_properties") || "[]");
            const target = defaults.length > 0 ? defaults : SAMPLE_PROPERTIES;
            for (const p of target) {
              await fetch("/api/properties", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(p)
              }).catch(() => {});
            }
          }
        }

        if (resUsers && Array.isArray(resUsers)) {
          if (resUsers.length > 0) {
            setRegisteredUsers(resUsers);
            localStorage.setItem("sre_registered_users", JSON.stringify(resUsers));
          } else {
            const defaults = JSON.parse(localStorage.getItem("sre_registered_users") || "[]");
            const target = defaults.length > 0 ? defaults : INITIAL_USERS;
            for (const u of target) {
              await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(u)
              }).catch(() => {});
            }
          }
        }

        if (resInquiries && Array.isArray(resInquiries)) {
          setInquiries(resInquiries);
          localStorage.setItem("sre_inquiries", JSON.stringify(resInquiries));
        }

        if (resTestimonials && Array.isArray(resTestimonials)) {
          if (resTestimonials.length > 0) {
            setTestimonials(resTestimonials);
            localStorage.setItem("sre_testimonials", JSON.stringify(resTestimonials));
          } else {
            for (const t of SAMPLE_TESTIMONIALS) {
              await fetch("/api/testimonials", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(t)
              }).catch(() => {});
            }
          }
        }

        if (resAgencies && Array.isArray(resAgencies)) {
          if (resAgencies.length > 0) {
            setAgencies(resAgencies);
            localStorage.setItem("sre_agencies", JSON.stringify(resAgencies));
          } else {
            for (const a of SEED_AGENCIES) {
              await fetch("/api/agencies", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(a)
              }).catch(() => {});
            }
          }
        }

        if (resLogs && Array.isArray(resLogs)) {
          if (resLogs.length > 0) {
            setAgencyLogs(resLogs);
            localStorage.setItem("sre_agency_logs", JSON.stringify(resLogs));
          } else {
            for (const l of SEED_AGENCY_LOGS) {
              await fetch("/api/agency-logs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(l)
              }).catch(() => {});
            }
          }
        }

        if (resNotifs && Array.isArray(resNotifs)) {
          setNotifications(resNotifs);
          localStorage.setItem("sre_notifications", JSON.stringify(resNotifs));
        }

        if (resFavs && Array.isArray(resFavs)) {
          const mappedIds = resFavs.map((f: any) => f.propertyId);
          setFavorites(mappedIds);
          localStorage.setItem("sre_favorites", JSON.stringify(mappedIds));
        }

      } catch (err) {
        console.warn("Backend proxy offline or configuring. Failover backup system is shielding queries.", err);
      }
    };

    // Fast-track API syncing
    syncBackendData();
  }, []);

  // Sync state functions with local storage and Express/Supabase proxy API
  const saveProperties = async (updated: Property[]) => {
    setProperties(updated);
    localStorage.setItem("sre_properties", JSON.stringify(updated));

    try {
      // Find deleted
      const oldIds = properties.map(p => p.id);
      const newIds = updated.map(p => p.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const id of deletedIds) {
        await fetch(`/api/properties/${id}`, { method: "DELETE" }).catch(() => {});
      }

      // Upsert modified or added
      for (const prop of updated) {
        const oldMatch = properties.find(p => p.id === prop.id);
        if (!oldMatch || JSON.stringify(oldMatch) !== JSON.stringify(prop)) {
          await fetch("/api/properties", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(prop)
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Express proxy save error for properties:", err);
    }
  };

  const saveFavorites = async (updated: string[]) => {
    setFavorites(updated);
    localStorage.setItem("sre_favorites", JSON.stringify(updated));

    if (currentUser) {
      try {
        for (const favId of updated) {
          await fetch("/api/favorites", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id: `fav-${currentUser.id}-${favId}`,
              userId: currentUser.id,
              propertyId: favId
            })
          }).catch(() => {});
        }
      } catch (err) {
        console.error("Favorites persistent save error:", err);
      }
    }
  };

  const saveInquiries = async (updated: Inquiry[]) => {
    setInquiries(updated);
    localStorage.setItem("sre_inquiries", JSON.stringify(updated));

    try {
      const oldIds = inquiries.map(i => i.id);
      const newIds = updated.map(i => i.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const id of deletedIds) {
        await fetch(`/api/inquiries/${id}`, { method: "DELETE" }).catch(() => {});
      }

      for (const inq of updated) {
        const oldMatch = inquiries.find(i => i.id === inq.id);
        if (!oldMatch) {
          await fetch("/api/inquiries", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(inq)
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Inquiries persistence update error:", err);
    }
  };

  const saveNotifications = async (updated: AppNotification[]) => {
    setNotifications(updated);
    localStorage.setItem("sre_notifications", JSON.stringify(updated));

    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated)
      }).catch(() => {});
    } catch (err) {
      console.error("Notifications synchronous save error:", err);
    }
  };

  const saveUsers = async (updated: User[]) => {
    setRegisteredUsers(updated);
    localStorage.setItem("sre_registered_users", JSON.stringify(updated));

    try {
      const oldIds = registeredUsers.map(u => u.id);
      const newIds = updated.map(u => u.id);
      const deletedIds = oldIds.filter(id => !newIds.includes(id));

      for (const id of deletedIds) {
        await fetch(`/api/users/${id}`, { method: "DELETE" }).catch(() => {});
      }

      for (const usr of updated) {
        const oldMatch = registeredUsers.find(u => u.id === usr.id);
        if (!oldMatch || JSON.stringify(oldMatch) !== JSON.stringify(usr)) {
          await fetch("/api/users", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usr)
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Users synchronous save error:", err);
    }
  };

  const saveTestimonials = async (updated: Testimonial[]) => {
    setTestimonials(updated);
    localStorage.setItem("sre_testimonials", JSON.stringify(updated));

    try {
      for (const test of updated) {
        const oldMatch = testimonials.find(t => t.id === test.id);
        if (!oldMatch) {
          await fetch("/api/testimonials", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(test)
          }).catch(() => {});
        }
      }
    } catch (err) {
      console.error("Testimonials upload update error:", err);
    }
  };

  // Helper trigger for visual toasts
  const triggerToast = (text: string, type: "success" | "info" | "heart" = "info") => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Theme Toggler
  const handleToggleTheme = () => {
    const targetTheme = theme === "light" ? "dark" : "light";
    setTheme(targetTheme);
    localStorage.setItem("sre_theme", targetTheme);

    if (targetTheme === "dark") {
      document.documentElement.classList.add("dark");
      triggerToast("Dark Theme Activated", "info");
    } else {
      document.documentElement.classList.remove("dark");
      triggerToast("Light Theme Activated", "info");
    }
  };

  // Auth Operations
  const handleLoginSuccess = (user: User) => {
    setCurrentUser(user);
    
    // Add user registration check to registeredUsers
    if (!registeredUsers.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
      const updatedUsers = [...registeredUsers, user];
      saveUsers(updatedUsers);
    }

    // Add alert notification
    const alertId = "notif-sgn-" + Date.now();
    const loginNotif: AppNotification = {
      id: alertId,
      title: "Successfully Logged In",
      message: `Signed in as a vetted broker under name: ${user.name}. Keep directories up to date.`,
      type: "success",
      createdAt: new Date().toISOString(),
      read: false
    };
    saveNotifications([loginNotif, ...notifications]);

    triggerToast(`Welcome back, ${user.name}!`, "success");
    
    // Auto redirect to correct dashboard
    setActiveTab(user.role === "admin" ? "admin-dash" : "user-dash");
  };

  const handleUpdateCurrentUser = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    localStorage.setItem("sre_current_user", JSON.stringify(updatedUser));
    const updatedUsers = registeredUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(updatedUsers);
  };

  const handleAddTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: "testimonial-" + Date.now()
    };
    saveTestimonials([newTestimonial, ...testimonials]);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("sre_current_user");
    supabase.auth.signOut().catch(() => {});
    triggerToast("Signed out successfully from portal", "info");
    setActiveTab("home");
  };

  const handleOpenAuthModal = (tab: "login" | "register" = "login") => {
    setAuthInitialTab(tab);
    setAuthModalOpen(true);
  };

  // Toggle Favorite
  const handleToggleFavorite = (propertyId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated;
    if (favorites.includes(propertyId)) {
      updated = favorites.filter(id => id !== propertyId);
      triggerToast("Property removed from saved portfolio", "heart");
    } else {
      updated = [...favorites, propertyId];
      const matchedProp = properties.find(p => p.id === propertyId);
      triggerToast(`Saved: "${matchedProp?.title || "Property"}" to Favorites`, "heart");
    }
    saveFavorites(updated);
  };

  const handleViewFavoritesFromNavbar = () => {
    setSelectedCategory("");
    setSearchFilters({
      status: "",
      region: "",
      category: "",
      minPrice: "",
      maxPrice: "",
      bedrooms: "",
      bathrooms: ""
    });
    // Scroll to listings with filtered list
    setActiveTab("properties");
    const element = document.getElementById("properties");
    if (element) {
      setTimeout(() => element.scrollIntoView({ behavior: "smooth" }), 100);
    }
    triggerToast("Favorites filter loaded. Displaying saved properties.", "heart");
  };

  // Execute advanced hero searches
  const handleSearchFilters = (filters: SearchFilters) => {
    setSearchFilters(filters);
    if (activeTab !== "home" && activeTab !== "properties") {
      setActiveTab("home");
    }
    setTimeout(() => {
      const element = document.getElementById("properties");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
    triggerToast("Applying advanced catalog search filters", "info");
  };

  const handleResetFilters = () => {
    setSearchFilters(null);
    setSelectedCategory("");
    setShowNewEntriesOnly(false);
    triggerToast("Search filters cleared", "info");
  };

  const handleToggleLanguage = () => {
    const nextLang = language === "en" ? "so" : "en";
    setLanguage(nextLang);
    localStorage.setItem("sre_language", nextLang);
    triggerToast(nextLang === "en" ? "Language updated to English" : "Af-Soomaali baa loo beddelay", "info");
  };

  // Contact Inquiries
  const handleSendInquiry = (inqPayload: Omit<Inquiry, "id" | "date">) => {
    const newInquiry: Inquiry = {
      ...inqPayload,
      id: "inq-" + Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString()
    };

    saveInquiries([newInquiry, ...inquiries]);

    // Send app notification alert to the matching owner/broker
    const matchedProp = properties.find(p => p.id === inqPayload.propertyId);
    const notificationId = "notif-" + Math.random().toString(36).substr(2, 9);
    const newNotif: AppNotification = {
      id: notificationId,
      title: "New Customer Message Received",
      message: `Buyer "${inqPayload.name}" inquired on your listing: "${matchedProp?.title || "Property Listing"}". Phone: ${inqPayload.phone}.`,
      type: "inquiry",
      createdAt: new Date().toISOString(),
      read: false
    };

    saveNotifications([newNotif, ...notifications]);
    triggerToast("Customer Inquiry Sent to Landlord broker", "success");
  };

  // Add / Edit Property inside User Dashboard
  const handleAddProperty = (payload: Omit<Property, "id" | "ownerId" | "ownerName" | "ownerPhone" | "ownerWhatsapp" | "approved" | "createdAt">) => {
    const newProp: Property = {
      ...payload,
      id: "prop-" + Math.random().toString(36).substr(2, 9),
      ownerId: currentUser?.id || "user-agent-custom",
      ownerName: currentUser?.name || "Independent Broker",
      ownerPhone: currentUser?.phone || "+252615000000",
      ownerWhatsapp: (currentUser?.phone || "252615000000").replace(/[^0-9]/g, ""),
      approved: true, // Auto-verified for active brokers for sandbox efficiency!
      featured: false,
      createdAt: new Date().toISOString()
    };

    saveProperties([newProp, ...properties]);

    // Trigger Notification
    const updatedNotifs = [
      {
        id: "notif-add-" + Date.now(),
        title: "New Property Published",
        message: `Your property listing: "${payload.title}" has been verified and mapped.`,
        type: "success",
        createdAt: new Date().toISOString(),
        read: false
      } as AppNotification,
      ...notifications
    ];
    saveNotifications(updatedNotifs);
    triggerToast("Listing successfully published to directories!", "success");
  };

  const handleUpdateProperty = (id: string, updatedFields: Partial<Property>) => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, ...updatedFields };
      }
      return p;
    });
    saveProperties(updated);
    triggerToast("Listing specifications updated", "success");
  };

  const handleDeleteProperty = (id: string) => {
    const updated = properties.filter(p => p.id !== id);
    saveProperties(updated);

    // Sync saved favorites
    const updatedFavs = favorites.filter(favId => favId !== id);
    saveFavorites(updatedFavs);

    triggerToast("Listing removed from database", "info");
  };

  const handleDeleteUser = (userId: string, deleteProperties = false) => {
    const updatedUsers = registeredUsers.filter(u => u.id !== userId);
    saveUsers(updatedUsers);
    
    if (deleteProperties) {
      const remainingProperties = properties.filter(p => p.ownerId !== userId);
      saveProperties(remainingProperties);
      triggerToast("Broker and all of their listings deleted", "info");
    } else {
      triggerToast("Broker registry suspended", "info");
    }
  };

  const handleUpdateUser = (updatedUser: User) => {
    const updatedUsers = registeredUsers.map(u => u.id === updatedUser.id ? updatedUser : u);
    saveUsers(updatedUsers);
    
    if (currentUser && currentUser.id === updatedUser.id) {
      setCurrentUser(updatedUser);
      localStorage.setItem("sre_current_user", JSON.stringify(updatedUser));
    }

    triggerToast("Broker registry entry updated", "success");
  };

  const handleCreateUser = (newUser: User) => {
    const updatedUsers = [...registeredUsers, newUser];
    saveUsers(updatedUsers);
    triggerToast("Broker registered successfully", "success");
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter(i => i.id !== id);
    saveInquiries(updated);
    triggerToast("Contact inquiry removed from console", "info");
  };

  const handleCreateAgency = async (newAgency: Agency) => {
    try {
      const updated = [newAgency, ...agencies];
      setAgencies(updated);
      localStorage.setItem("sre_agencies", JSON.stringify(updated));
      triggerToast(language === "en" ? "Agency registered successfully!" : "Wakaaladda waa la diiwaangeliyey!", "success");

      // Sync backend
      await fetch("/api/agencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newAgency)
      }).catch(e => console.error(e));

      // Log action
      const auditLog: AgencyLog = {
        id: "log-" + Math.random().toString(36).substr(2, 9),
        agencyId: newAgency.id,
        action: "AGENCY_REGISTERED",
        details: `Registered new Agency "${newAgency.name}" located at ${newAgency.location}.`,
        createdAt: new Date().toISOString()
      };
      await handleCreateAgencyLog(auditLog);
    } catch (err: any) {
      console.error("Create agency error:", err);
      triggerToast("Error: " + err.message, "info");
    }
  };

  const handleDeleteAgency = async (id: string) => {
    try {
      const targetAgency = agencies.find(a => a.id === id);
      const updated = agencies.filter(a => a.id !== id);
      setAgencies(updated);
      localStorage.setItem("sre_agencies", JSON.stringify(updated));
      triggerToast(language === "en" ? "Agency removed successfully." : "Wakaaladda waa laga tirtiray.", "info");

      if (targetAgency) {
        const auditLog: AgencyLog = {
          id: "log-" + Math.random().toString(36).substr(2, 9),
          agencyId: id,
          action: "AGENCY_DELETED",
          details: `Deleted real estate agency association for ${targetAgency.name}.`,
          createdAt: new Date().toISOString()
        };
        await handleCreateAgencyLog(auditLog);
      }
    } catch (err: any) {
      console.error("Delete agency error:", err);
      triggerToast("Error: " + err.message, "info");
    }
  };

  const handleCreateAgencyLog = async (newLog: AgencyLog) => {
    try {
      const updated = [newLog, ...agencyLogs];
      setAgencyLogs(updated);
      localStorage.setItem("sre_agency_logs", JSON.stringify(updated));

      // Sync backend
      await fetch("/api/agency-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLog)
      }).catch(e => console.error(e));
    } catch (err) {
      console.error("Storing log failed:", err);
    }
  };

  const handleApproveProperty = (id: string) => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, approved: true };
      }
      return p;
    });
    saveProperties(updated);
    triggerToast("Vetting approved. Property listed publicly.", "success");
  };

  const handleMarkNotificationRead = (id: string) => {
    const updated = notifications.map((n) => {
      if (n.id === id) {
        return { ...n, read: true };
      }
      return n;
    });
    saveNotifications(updated);
  };

  // Filter logic on the catalog grid
  const getFilteredProperties = () => {
    let result = properties;

    // Filter by Approval Queue (only show approved to non-admin public)
    if (currentUser?.role !== "admin") {
      result = result.filter(p => p.approved);
    }

    if (showNewEntriesOnly) {
      result = result.filter(p => new Date(p.createdAt).getTime() >= new Date("2026-06-01T00:00:00Z").getTime());
    }

    // Filter by search parameters in Hero
    if (searchFilters) {
      if (searchFilters.status) {
        result = result.filter(p => p.status === searchFilters.status);
      }
      if (searchFilters.region) {
        result = result.filter(p => p.region.toLowerCase() === searchFilters.region.toLowerCase());
      }
      if (searchFilters.category) {
        result = result.filter(p => p.category === searchFilters.category);
      }
      if (searchFilters.minPrice) {
        result = result.filter(p => p.price >= parseFloat(searchFilters.minPrice));
      }
      if (searchFilters.maxPrice) {
        result = result.filter(p => p.price <= parseFloat(searchFilters.maxPrice));
      }
      if (searchFilters.bedrooms) {
        result = result.filter(p => p.bedrooms >= parseInt(searchFilters.bedrooms));
      }
      if (searchFilters.bathrooms) {
        result = result.filter(p => p.bathrooms >= parseInt(searchFilters.bathrooms));
      }
      if (searchFilters.hasTitleDeed) {
        if (searchFilters.hasTitleDeed === "yes") {
          result = result.filter(p => p.hasTitleDeed === true);
        } else if (searchFilters.hasTitleDeed === "no") {
          result = result.filter(p => !p.hasTitleDeed);
        }
      }
    }

    // Filter strictly by the active tab if they clicked "Favorites"
    if (activeTab === "favorites-view") {
      result = result.filter(p => favorites.includes(p.id));
    }

    return result;
  };

  const visibleProperties = getFilteredProperties();
  const selectedProperty = properties.find((p) => p.id === selectedPropertyId);
  const newEntriesCount = properties.filter(p => p.approved && new Date(p.createdAt).getTime() >= new Date("2026-06-01T00:00:00Z").getTime()).length;

  const handleShowNewEntries = () => {
    setShowNewEntriesOnly(true);
    setSelectedCategory("");
    setSearchFilters(null);
    setActiveTab("properties");
    setTimeout(() => {
      const element = document.getElementById("properties");
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
    triggerToast(language === "en" ? "Filter loaded: Showing New Entries only!" : "Tusidda Guryaha ku cusub baa la furay!", "info");
  };

  return (
    <div id="main-application-frame" className="min-h-screen flex flex-col justify-between bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-all duration-300">
      
      {/* 1. STICKY TOP HEADER */}
      <Header
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenAuthModal={handleOpenAuthModal}
        favoritesCount={favorites.length}
        onViewFavorites={handleViewFavoritesFromNavbar}
        notifications={notifications}
        onMarkNotificationRead={handleMarkNotificationRead}
        onToggleTheme={handleToggleTheme}
        theme={theme}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        language={language}
        onToggleLanguage={handleToggleLanguage}
      />

      {/* 2. FLOATING ALERTS OR TOAST MESSAGE CENTER */}
      {toastMessage && (
        <div 
          id="floating-alert-toast" 
          className="fixed top-24 right-6 z-50 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-850 animate-bounce cursor-pointer max-w-sm"
          onClick={() => setToastMessage(null)}
        >
          {toastMessage.type === "success" && (
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
          )}
          {toastMessage.type === "info" && (
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <Info className="h-5 w-5" />
            </div>
          )}
          {toastMessage.type === "heart" && (
            <div className="p-2 rounded-xl bg-red-50 text-red-500 dark:bg-red-955/20">
              <Heart className="h-5 w-5 fill-red-500" />
            </div>
          )}
          <span className="text-xs font-bold text-slate-900 dark:text-white leading-normal pr-3">{toastMessage.text}</span>
        </div>
      )}

      {/* 3. CORE SUB-VIEWS HANDLERS ROADS */}
      <main className="flex-1">

        {activeTab === "user-dash" && currentUser ? (
          /* USER BROKER DASHBOARD VIEW */
          <div className="animate-fade-in py-6">
            <UserDashboard
              currentUser={currentUser}
              properties={properties}
              onAddProperty={handleAddProperty}
              onUpdateProperty={handleUpdateProperty}
              onDeleteProperty={handleDeleteProperty}
              inquiries={inquiries}
              notifications={notifications}
              favorites={properties.filter(p => favorites.includes(p.id))}
              onRemoveFavorite={handleToggleFavorite}
              onUpdateCurrentUser={handleUpdateCurrentUser}
              onAddTestimonial={handleAddTestimonial}
              agencies={agencies}
              language={language}
            />
          </div>
        ) : activeTab === "admin-dash" && currentUser?.role === "admin" ? (
          /* SYSTEM ADMIN DASHBOARD VIEW */
          <div className="animate-fade-in py-6">
            <AdminDashboard
              properties={properties}
              onApproveProperty={handleApproveProperty}
              onDeleteProperty={handleDeleteProperty}
              users={registeredUsers}
              onDeleteUser={handleDeleteUser}
              onUpdateUser={handleUpdateUser}
              onCreateUser={handleCreateUser}
              inquiries={inquiries}
              onDeleteInquiry={handleDeleteInquiry}
              agencies={agencies}
              agencyLogs={agencyLogs}
              onCreateAgency={handleCreateAgency}
              onDeleteAgency={handleDeleteAgency}
              onCreateAgencyLog={handleCreateAgencyLog}
              language={language}
            />
          </div>
        ) : (
          /* MAIN SITE FLOW DESIGN (HOME, SEARCH, CATALOG, TESTIMONIALS, FAQS, CONTACTS) */
          <div className="space-y-0 animate-fade-in">
            
            {/* HERO FILTER BANNER */}
            {activeTab === "home" && (
              <div id="home">
                <Hero 
                  onSearch={handleSearchFilters} 
                  onResetSearch={handleResetFilters} 
                  language={language} 
                  onShowNewEntries={handleShowNewEntries}
                  newEntriesCount={newEntriesCount}
                />
                
                {/* Embedded Property Catalog directly on the Home view */}
                <div id="properties" className="scroll-mt-20">
                  <PropertyGrid
                    properties={visibleProperties}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                    onViewDetails={setSelectedPropertyId}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={setSelectedCategory}
                    onClearFilters={handleResetFilters}
                    agencies={agencies}
                    language={language}
                    regionFilter={searchFilters?.region || ""}
                  />
                </div>
                
                {/* SECURE CUSTOM CONTACT SUBMISSION SECTION ENCLOSED AT HOME */}
                <ContactPage language={language} />
              </div>
            )}

            {/* PERSISTENT NEW ENTRIES NOTIFICATION FILTER BANNER */}
            {activeTab === "properties" && showNewEntriesOnly && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/20 text-slate-800 dark:text-emerald-250 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 flex items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
                      <Bell className="h-5 w-5 animate-bounce" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold sm:text-base">
                        {language === "en" ? "Viewing New Entries Only" : "Kaliya Guryaha iyo Dukaamada Cusub"}
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                        {language === "en" 
                          ? `Displaying ${newEntriesCount} newly registered properties and shops in Abudwak.` 
                          : `Hadda waxaa kuu muuqda dhammaan ${newEntriesCount} guryaha iyo dukaamada ku cusub Abudwak.`}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowNewEntriesOnly(false)}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-all shadow-md cursor-pointer uppercase tracking-wider"
                  >
                    {language === "en" ? "Show All Listings" : "Muuji Dhammaan Guryaha"}
                  </button>
                </div>
              </div>
            )}

            {/* PROPERTIES SECTION GOURMET CATALOG GRID */}
            {activeTab === "properties" && (
              <div id="properties">
                <PropertyGrid
                  properties={visibleProperties}
                  favorites={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onViewDetails={setSelectedPropertyId}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  onClearFilters={handleResetFilters}
                  agencies={agencies}
                  language={language}
                  regionFilter={searchFilters?.region || ""}
                />
              </div>
            )}

            {/* SECURE CUSTOM CONTACT SUBMISSION SECTION */}
            {activeTab === "contact" && (
              <div id="contact">
                <ContactPage language={language} />
              </div>
            )}

          </div>
        )}

      </main>

      {/* 4. BRAND FOOTER LINKS */}
      <Footer onNavigate={setActiveTab} language={language} />

      {/* 5. SELECTION DETAIL SPECIFICATIONS SYSTEM VIEW MODAL */}
      {selectedPropertyId && selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedPropertyId(null)}
          isFavorite={favorites.includes(selectedProperty.id)}
          onToggleFavorite={handleToggleFavorite}
          onSendInquiry={handleSendInquiry}
          agencies={agencies}
          language={language}
        />
      )}

      {/* 6. VERIFICATION BROKER login MODAL PORTAL */}
      {authModalOpen && (
        <AuthModal
          onClose={() => setAuthModalOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          initialTab={authInitialTab}
          language={language}
          onToggleLanguage={handleToggleLanguage}
        />
      )}

    </div>
  );
}
