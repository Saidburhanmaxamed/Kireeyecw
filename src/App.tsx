/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  SAMPLE_PROPERTIES, 
  SAMPLE_FAQS, 
  SAMPLE_TESTIMONIALS 
} from "./data";
import { 
  Property, 
  User, 
  Inquiry, 
  AppNotification, 
  PropertyStatus,
  PropertyCategory,
  Testimonial 
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

// Initial seed users
const INITIAL_USERS: User[] = [
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

  // Load and seed initial states from Express server (centralized persistence)
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

    // 2. Fetch server bootstrap data
    fetch("/api/data-bootstrap")
      .then((res) => res.json())
      .then((data) => {
        // Properties
        if (data.properties) {
          setProperties(data.properties);
          localStorage.setItem("sre_properties", JSON.stringify(data.properties));
        }
        
        // Registered Users
        if (data.users) {
          setRegisteredUsers(data.users);
          localStorage.setItem("sre_registered_users", JSON.stringify(data.users));
        }

        // Inquiries
        if (data.inquiries) {
          setInquiries(data.inquiries);
          localStorage.setItem("sre_inquiries", JSON.stringify(data.inquiries));
        }

        // Notifications
        if (data.notifications) {
          setNotifications(data.notifications);
          localStorage.setItem("sre_notifications", JSON.stringify(data.notifications));
        }

        // Testimonials
        if (data.testimonials) {
          setTestimonials(data.testimonials);
          localStorage.setItem("sre_testimonials", JSON.stringify(data.testimonials));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch bootstrap data from back-end server. Falling back to localStorage.", err);
        // Fallback to localStorage if API is unreachable
        const savedProps = localStorage.getItem("sre_properties");
        if (savedProps) {
          setProperties(JSON.parse(savedProps));
        } else {
          localStorage.setItem("sre_properties", JSON.stringify(SAMPLE_PROPERTIES));
          setProperties(SAMPLE_PROPERTIES);
        }

        const savedUser = localStorage.getItem("sre_current_user");
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }

        const savedUsers = localStorage.getItem("sre_registered_users");
        if (savedUsers) {
          setRegisteredUsers(JSON.parse(savedUsers));
        } else {
          localStorage.setItem("sre_registered_users", JSON.stringify(INITIAL_USERS));
          setRegisteredUsers(INITIAL_USERS);
        }

        const savedInqs = localStorage.getItem("sre_inquiries");
        if (savedInqs) {
          setInquiries(JSON.parse(savedInqs));
        }

        const savedNotifs = localStorage.getItem("sre_notifications");
        if (savedNotifs) {
          setNotifications(JSON.parse(savedNotifs));
        }

        const savedTestimonials = localStorage.getItem("sre_testimonials");
        if (savedTestimonials) {
          setTestimonials(JSON.parse(savedTestimonials));
        }
      });

    // 3. User Credentials login persistence
    const savedUser = localStorage.getItem("sre_current_user");
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
    }

    // 4. Favorites Setup
    const savedFavs = localStorage.getItem("sre_favorites");
    if (savedFavs) {
      setFavorites(JSON.parse(savedFavs));
    } else {
      localStorage.setItem("sre_favorites", JSON.stringify([]));
    }
  }, []);

  // Sync state functions with local storage
  const saveProperties = (updated: Property[]) => {
    setProperties(updated);
    localStorage.setItem("sre_properties", JSON.stringify(updated));
  };

  const saveFavorites = (updated: string[]) => {
    setFavorites(updated);
    localStorage.setItem("sre_favorites", JSON.stringify(updated));
  };

  const saveInquiries = (updated: Inquiry[]) => {
    setInquiries(updated);
    localStorage.setItem("sre_inquiries", JSON.stringify(updated));
  };

  const saveNotifications = (updated: AppNotification[]) => {
    setNotifications(updated);
    localStorage.setItem("sre_notifications", JSON.stringify(updated));
  };

  const saveUsers = (updated: User[]) => {
    setRegisteredUsers(updated);
    localStorage.setItem("sre_registered_users", JSON.stringify(updated));
  };

  const saveTestimonials = (updated: Testimonial[]) => {
    setTestimonials(updated);
    localStorage.setItem("sre_testimonials", JSON.stringify(updated));
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

      // Save user registry to back-end
      fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user)
      }).catch(err => console.error("Error saving registered user to cloud:", err));
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

    // Save profile update to back-end
    fetch(`/api/users/${updatedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    }).catch(err => console.error("Error saving updated user user profile key:", err));
  };

  const handleAddTestimonial = (testimonial: Omit<Testimonial, "id">) => {
    const newTestimonial: Testimonial = {
      ...testimonial,
      id: "testimonial-" + Date.now()
    };
    saveTestimonials([newTestimonial, ...testimonials]);

    // Save testimonial to back-end
    fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTestimonial)
    }).catch(err => console.error("Error saving testimonial:", err));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("sre_current_user");
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

    // Save inquiry to backend Express server
    fetch("/api/inquiries", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newInquiry)
    }).catch(err => console.error("Error creating inquiry on backend:", err));

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

    // Save property listing to backend Express server
    fetch("/api/properties", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newProp)
    }).catch(err => console.error("Error creating property spec on backend:", err));

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

    // Save modified property specifications to Express server
    fetch(`/api/properties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields)
    }).catch(err => console.error("Error updating property on backend:", err));

    triggerToast("Listing specifications updated", "success");
  };

  const handleDeleteProperty = (id: string) => {
    const updated = properties.filter(p => p.id !== id);
    saveProperties(updated);

    // Delete property on server
    fetch(`/api/properties/${id}`, {
      method: "DELETE"
    }).catch(err => console.error("Error deleting property on backend:", err));

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

    // Save user update to server-side store
    fetch(`/api/users/${updatedUser.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedUser)
    }).catch(err => console.error("Error updating user on backend:", err));

    triggerToast("Broker registry entry updated", "success");
  };

  const handleCreateUser = (newUser: User) => {
    const updatedUsers = [...registeredUsers, newUser];
    saveUsers(updatedUsers);

    // Add registered user to server-side store
    fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newUser)
    }).catch(err => console.error("Error registering user on backend:", err));

    triggerToast("Broker registered successfully", "success");
  };

  const handleDeleteInquiry = (id: string) => {
    const updated = inquiries.filter(i => i.id !== id);
    saveInquiries(updated);

    // Cancel / Delete inquiry ticket on server
    fetch(`/api/inquiries/${id}`, {
      method: "DELETE"
    }).catch(err => console.error("Error deleting inquiry on backend:", err));

    triggerToast("Contact inquiry removed from console", "info");
  };

  const handleApproveProperty = (id: string) => {
    const updated = properties.map((p) => {
      if (p.id === id) {
        return { ...p, approved: true };
      }
      return p;
    });
    saveProperties(updated);

    // Set approved: true on the backend Express database
    fetch(`/api/properties/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ approved: true })
    }).catch(err => console.error("Error approving property listing:", err));

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
