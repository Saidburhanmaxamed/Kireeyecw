/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Heart, 
  Bell, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  User, 
  LogOut, 
  LayoutDashboard, 
  ShieldAlert,
  Check,
  Database,
  Copy,
  CheckCircle2,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { User as UserType, AppNotification } from "../types";
import { translations, Language } from "../localization";
import LogoIcon from "./LogoIcon";

interface HeaderProps {
  currentUser: UserType | null;
  onLogout: () => void;
  onOpenAuthModal: (tab?: "login" | "register") => void;
  favoritesCount: number;
  onViewFavorites: () => void;
  notifications: AppNotification[];
  onMarkNotificationRead: (id: string) => void;
  onToggleTheme: () => void;
  theme: "light" | "dark";
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: Language;
  onToggleLanguage: () => void;
  dbStatus?: { 
    supabaseConnected: boolean; 
    supabaseUrl: string | null; 
    hasServiceRoleKey: boolean; 
    sqlSchema: string;
    tablesExist?: boolean;
    connectionError?: string | null;
  } | null;
}

export default function Header({
  currentUser,
  onLogout,
  onOpenAuthModal,
  favoritesCount,
  onViewFavorites,
  notifications,
  onMarkNotificationRead,
  onToggleTheme,
  theme,
  activeTab,
  setActiveTab,
  language,
  onToggleLanguage,
  dbStatus
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [dbStatusModalOpen, setDbStatusModalOpen] = useState(false);
  const [sqlCopied, setSqlCopied] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);
  const dict = translations[language];

  const navigationLinks = [
    { id: "home", label: dict.home },
    { id: "properties", label: dict.properties },
    { id: "contact", label: dict.contactUs }
  ];

  const handleLinkClick = (id: string) => {
    if (id === "properties" || id === "contact") {
      setActiveTab("home");
      setMobileMenuOpen(false);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      setActiveTab(id);
      setMobileMenuOpen(false);
      if (id === "home") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <header id="header-root" className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-[#034d2d]/40 bg-[#012a18] text-white shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo" 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleLinkClick("home")}
          >
            <div className="p-2.5 bg-emerald-500 rounded-xl text-white group-hover:scale-105 transition-transform duration-300 shadow-md shadow-emerald-500/20">
              <LogoIcon className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-white leading-none">
                Kireeye<span className="text-emerald-400">Cw</span>
              </span>
              <span className="text-[10px] uppercase font-semibold letter tracking-widest text-emerald-300/80 mt-1">
                {dict.heroTitle}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <button
                key={link.id}
                id={`nav-link-${link.id}`}
                onClick={() => handleLinkClick(link.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 cursor-pointer ${
                  activeTab === link.id
                    ? "text-white bg-emerald-600/80 shadow-md shadow-emerald-900/50"
                    : "text-emerald-100 hover:text-white hover:bg-emerald-900/60"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Utilities (Favs, Theme, Notify, Profile) */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Supabase Connectivity Badge */}
            <button
              id="supabase-status-badge"
              onClick={() => setDbStatusModalOpen(true)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all duration-300 border shadow-md focus:outline-none cursor-pointer hover:scale-105 active:scale-95 ${
                dbStatus?.supabaseConnected
                  ? dbStatus.tablesExist
                    ? "bg-emerald-950/80 text-emerald-300 border-emerald-500/40 shadow-emerald-950/20"
                    : "bg-amber-950/80 text-amber-400 border-amber-500/40 shadow-amber-950/20 animate-pulse"
                  : "bg-slate-900/60 text-slate-400 border-slate-700/30 shadow-slate-950/20"
              }`}
              title="Click to view Supabase database tables and live status"
            >
              <Database className={`h-4 w-4 ${
                dbStatus?.supabaseConnected
                  ? dbStatus.tablesExist ? "text-emerald-400" : "text-amber-400"
                  : "text-slate-500"
              }`} />
              <span>
                {dbStatus?.supabaseConnected
                  ? dbStatus.tablesExist
                    ? "Supabase Live"
                    : "Setup Tables"
                  : "Supabase Fallback"}
              </span>
            </button>

            {/* Premium Language Pill Toggle */}
            <div className="flex items-center gap-1 bg-emerald-950/60 px-1 py-1 rounded-xl border border-emerald-800/40">
              <button
                id="lang-eng-btn"
                onClick={() => language !== "en" && onToggleLanguage()}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  language === "en"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-emerald-200/70 hover:text-white"
                }`}
              >
                ENG
              </button>
              <button
                id="lang-som-btn"
                onClick={() => language !== "so" && onToggleLanguage()}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-200 cursor-pointer ${
                  language === "so"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-emerald-200/70 hover:text-white"
                }`}
              >
                SOM
              </button>
            </div>

            {/* Favorites Icon */}
            <button
              id="favorites-shortcut"
              onClick={onViewFavorites}
              className="relative p-2.5 rounded-lg border border-emerald-700/50 hover:bg-emerald-905/40 text-emerald-100 hover:text-white transition-all duration-200 cursor-pointer"
              title="View Favorites"
            >
              <Heart className={`h-5 w-5 ${favoritesCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-emerald-900 animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Alerts & Notifications */}
            <div className="relative">
              <button
                id="notifications-button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-lg border border-emerald-700/50 hover:bg-emerald-905/40 text-emerald-100 hover:text-white transition-all duration-200 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-emerald-900 animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div 
                  id="notifications-dropdown" 
                  className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 p-4 border border-emerald-800/30 shadow-xl z-50 text-slate-800 dark:text-white"
                >
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-100 dark:border-slate-800">
                    <h4 className="font-display font-bold text-sm text-slate-800 dark:text-white flex items-center gap-1.5">
                      <Bell className="h-4 w-4 text-emerald-600" /> {dict.notifications}
                    </h4>
                    <span className="text-xs text-slate-400">{unreadNotifications.length} {dict.unread}</span>
                  </div>
                  <div className="space-y-2.5 max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-center py-6 text-slate-400">{dict.noAlerts}</p>
                    ) : (
                      notifications.map((notif) => (
                        <div 
                          key={notif.id}
                          className={`p-2.5 rounded-xl text-left border transition-all ${
                            notif.read 
                              ? "bg-slate-50/50 dark:bg-slate-950/30 border-transparent" 
                              : "bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-100/50 dark:border-emerald-950"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1 gap-1">
                            <span className="font-bold text-xs text-slate-800 dark:text-white leading-snug">{notif.title}</span>
                            {!notif.read && (
                              <button 
                                onClick={() => onMarkNotificationRead(notif.id)}
                                className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 p-0.5 rounded-md hover:bg-emerald-50 dark:hover:bg-slate-800"
                                title="Mark as read"
                              >
                                <Check className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">{notif.message}</p>
                          <div className="text-[9px] text-slate-400 dark:text-slate-500 mt-1">
                            {notif.createdAt ? new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : ""}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Portal Section */}
            <div className="relative">
              {currentUser ? (
                <>
                  <button
                    id="profile-dropdown-trigger"
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-emerald-700/50 hover:bg-emerald-905/40 cursor-pointer text-white transition-all"
                  >
                    <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold font-display text-sm shadow-inner">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left max-w-[100px] overflow-hidden">
                      <span className="text-xs font-semibold truncate leading-none text-white">{currentUser.name}</span>
                      <span className="text-[10px] text-emerald-300 uppercase font-mono mt-0.5 leading-none">{currentUser.role}</span>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-emerald-800/20 shadow-2xl z-50 p-2 overflow-hidden text-slate-800 dark:text-white">
                      <div className="px-3 py-2.5 border-b border-gray-50 dark:border-slate-800/80 mb-1">
                        <p className="text-[10px] text-slate-400 uppercase font-mono">{dict.signedInAs}</p>
                        <p className="text-xs font-bold text-slate-800 dark:text-white truncate">{currentUser.email}</p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab(currentUser.role === "admin" ? "admin-dash" : "user-dash");
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        {currentUser.role === "admin" ? (
                          <>
                            <ShieldAlert className="h-4 w-4 text-rose-500" />
                            <span>{dict.adminPortal}</span>
                          </>
                        ) : (
                          <>
                            <LayoutDashboard className="h-4 w-4 text-emerald-600" />
                            <span>{dict.myDashboard}</span>
                          </>
                        )}
                      </button>

                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-red-650 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>{dict.logout}</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  id="navbar-login-btn"
                  onClick={() => onOpenAuthModal("login")}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-white text-emerald-950 hover:bg-emerald-50 transition-all duration-200 font-bold text-sm cursor-pointer shadow-md shadow-emerald-950/20"
                >
                  <User className="h-4 w-4 text-emerald-750" />
                  <span>{dict.brokerLogin}</span>
                </button>
              )}
            </div>

          </div>

          {/* Mobile Menu Action Indicator */}
          <div className="flex items-center gap-2.5 lg:hidden">

            {/* Mobile Language Switcher Pill */}
            <div className="flex items-center bg-emerald-950/70 p-0.5 rounded-lg border border-emerald-800/40 shadow-sm">
              <button
                onClick={() => language !== "en" && onToggleLanguage()}
                className={`px-2 py-1 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-emerald-250 hover:text-white"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => language !== "so" && onToggleLanguage()}
                className={`px-2 py-1 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                  language === "so"
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "text-emerald-250 hover:text-white"
                }`}
              >
                SO
              </button>
            </div>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-trigger"
              className="p-2 rounded-lg border border-emerald-750/50 text-white hover:bg-emerald-905/40 cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Navigation Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="lg:hidden border-t border-gray-200/60 dark:border-slate-800 bg-white dark:bg-slate-900/95 p-4 space-y-3 shadow-xl transition-all duration-300">
          <div className="space-y-1">
            {navigationLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.id)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === link.id
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                    : "text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="pt-4 border-t border-gray-100 dark:border-slate-800 space-y-3">
            <button
              onClick={() => {
                onViewFavorites();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-gray-200/60 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-850"
            >
              <span className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-red-500 fill-red-500" /> {dict.savedProperties}
              </span>
              <span className="bg-red-500 text-white rounded-full text-xs font-bold px-2 py-0.5">{favoritesCount}</span>
            </button>

            {currentUser ? (
              <div className="space-y-2">
                <div className="px-4 py-2 bg-slate-50 dark:bg-slate-950 rounded-xl">
                  <p className="text-[10px] text-slate-400 uppercase font-mono">Broker Account</p>
                  <p className="text-xs font-bold text-slate-800 dark:text-white">{currentUser.name}</p>
                </div>
                <button
                  onClick={() => {
                    setActiveTab(currentUser.role === "admin" ? "admin-dash" : "user-dash");
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl bg-emerald-600 text-white font-medium text-sm hover:bg-emerald-500 bg-emerald-600 hover:bg-emerald-500"
                >
                  {currentUser.role === "admin" ? dict.adminPortal : dict.myDashboard}
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl border border-red-250 text-red-600 font-medium text-sm hover:bg-red-50"
                >
                  {dict.logout}
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuthModal("login");
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-medium text-sm transition-all"
              >
                <User className="h-4 w-4" />
                <span>{dict.brokerLogin}</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Supabase Integration Assistant Modal */}
      {dbStatusModalOpen && dbStatus && (
        <div id="supabase-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in text-slate-800 dark:text-slate-100">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-gray-150 dark:border-slate-800 shadow-2xl animate-scale-up">
            <div className={`p-6 border-b flex items-start justify-between relative ${dbStatus.supabaseConnected ? "bg-emerald-500/10 border-emerald-500/10" : "bg-amber-500/10 border-amber-500/10"}`}>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-2xl ${dbStatus.supabaseConnected ? "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" : "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400"}`}>
                  <Database className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg md:text-xl text-slate-900 dark:text-white leading-tight">
                    Supabase PostgreSQL Settings
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    State manager configuration for durable cloud data storage.
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setDbStatusModalOpen(false)}
                className="p-1 px-2.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase font-bold text-xs"
              >
                Close
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/60 border border-gray-150 dark:border-slate-850/60">
                <h4 className="text-sm font-bold flex items-center gap-1.5 text-slate-900 dark:text-white">
                  {dbStatus.supabaseConnected ? (
                    dbStatus.tablesExist ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wide text-xs">
                        <CheckCircle2 className="h-4 w-4" /> Live Supabase Database Connected & Ready
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wide text-xs">
                        <AlertTriangle className="h-4 w-4 animate-bounce" /> Connection Active (Tables Missing)
                      </span>
                    )
                  ) : (
                    <span className="flex items-center gap-1.5 text-amber-500 font-bold uppercase tracking-wide text-xs">
                      <AlertTriangle className="h-4 w-4" /> Database Unconfigured / Falling Back to local memory
                    </span>
                  )}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2">
                  {dbStatus.supabaseConnected
                    ? dbStatus.tablesExist
                      ? `Your app is syncing real-time queries directly into your Cloud Postgres instance. Cloud API target: ${dbStatus.supabaseUrl}`
                      : `Successfully connected to your Supabase project URL (${dbStatus.supabaseUrl}), but your PostgreSQL database tables are not set up yet! Please copy and execute the SQL migration script below in your Supabase SQL Editor to activate full cloud persistence.`
                    : "The app is currently running in a fully-functional in-memory cache mode for quick preview. To activate direct Cloud Persistence on both AI Studio (Node Express layout) and Netlify (Static CDN deployment), add these settings:"}
                </p>

                {/* Unified instructions on environment keys */}
                <div className="mt-4 space-y-3">
                  <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-gray-200 dark:border-slate-800 space-y-2">
                    <h5 className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
                      ⚡ For AI Studio Backend (Custom Express Server)
                    </h5>
                    <div className="font-mono text-[10px] text-slate-500 dark:text-slate-400 leading-tight space-y-1">
                      <div><span className="text-blue-500 font-bold">SUPABASE_URL</span> = your-supabase-project-url</div>
                      <div><span className="text-blue-500 font-bold">SUPABASE_SERVICE_ROLE_KEY</span> = your-service-role-secret</div>
                    </div>
                  </div>

                  <div className="p-3 bg-blue-50/50 dark:bg-slate-900/40 rounded-xl border border-blue-100 dark:border-slate-800 space-y-2">
                    <h5 className="text-[11px] font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide flex items-center gap-1">
                      🌐 For Netlify Production (Direct Client-Side Link)
                    </h5>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-normal">
                      Since Netlify hosts the client bundle as SPA, set these two environment variables under **Netlify Console ➜ Site Configuration ➜ Environment Variables** so the browser connects directly:
                    </p>
                    <div className="font-mono text-[10px] text-blue-600 dark:text-blue-400 leading-tight space-y-1">
                      <div><span className="font-bold">VITE_SUPABASE_URL</span> = your-supabase-project-endpoint</div>
                      <div><span className="font-bold">VITE_SUPABASE_ANON_KEY</span> = your-public-anon-key</div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-xs uppercase font-extrabold tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-1.5 font-sans">
                    PostgreSQL Bootstrapping SQL Schema
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(dbStatus.sqlSchema);
                      setSqlCopied(true);
                      setTimeout(() => setSqlCopied(false), 2500);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-sm focus:outline-none cursor-pointer uppercase tracking-wider text-[10px]"
                  >
                    {sqlCopied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                    <span>{sqlCopied ? "Copied!" : "Copy SQL"}</span>
                  </button>
                </div>

                <div className="p-3 bg-slate-900 text-emerald-400 font-mono text-[10px] rounded-2xl overflow-x-auto max-h-56 leading-relaxed border border-slate-800 select-all scrollbar-thin">
                  <pre>{dbStatus.sqlSchema}</pre>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 italic leading-relaxed">
                  💡 Tip: Open your Supabase Workspace, click on the **SQL Editor**, paste the code block above, and click **Run**. This establishes your PostgreSQL tables instantly so your live database registry is perfectly aligned with the applet UI!
                </p>
              </div>

              {dbStatus.supabaseConnected && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex gap-3 text-emerald-800 dark:text-emerald-250">
                  <LogoIcon className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <h5 className="font-bold text-xs uppercase tracking-wide">Live Hydration Active</h5>
                    <p className="text-[11px] mt-1 leading-relaxed text-slate-500 dark:text-slate-400">
                      All new inquiries, property photo submissions, broker registries and testimonials will persist permanently in your live database across all sessions without losing any offline efforts.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
