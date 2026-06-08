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
  Check
} from "lucide-react";
import { User as UserType, AppNotification } from "../types";
import { translations, Language } from "../localization";

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
  onToggleLanguage
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read);
  const dict = translations[language];

  const navigationLinks = [
    { id: "home", label: dict.home },
    { id: "properties", label: dict.properties },
    { id: "contact", label: dict.contactUs }
  ];

  const handleLinkClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    // Smooth scroll to element if on home page
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  return (
    <header id="header-root" className="sticky top-0 z-50 w-full transition-all duration-300 border-b border-gray-200/50 dark:border-slate-800/50 glass-effect">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Brand */}
          <div 
            id="brand-logo" 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => handleLinkClick("home")}
          >
            <div className="p-2.5 bg-emerald-600 dark:bg-emerald-500 rounded-xl text-white group-hover:scale-105 transition-transform duration-300 shadow-md shadow-emerald-600/20">
              <Building2 className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white leading-none">
                Kire<span className="text-emerald-600 dark:text-emerald-400">eye</span>
              </span>
              <span className="text-[10px] uppercase font-semibold letter tracking-widest text-slate-400 dark:text-slate-500 mt-1">
                Reliable Properties, Gated Homes
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
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                  activeTab === link.id
                    ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40"
                    : "text-slate-600 hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800/40"
                }`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Action Utilities (Favs, Theme, Notify, Profile) */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Premium Language Pill Toggle */}
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-slate-800 px-1 py-1 rounded-xl border border-gray-200/40 dark:border-slate-850">
              <button
                id="lang-eng-btn"
                onClick={() => language !== "en" && onToggleLanguage()}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-255 cursor-pointer ${
                  language === "en"
                    ? "bg-white dark:bg-slate-900 text-emerald-655 dark:text-emerald-400 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                ENG
              </button>
              <button
                id="lang-som-btn"
                onClick={() => language !== "so" && onToggleLanguage()}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold tracking-wider transition-all duration-255 cursor-pointer ${
                  language === "so"
                    ? "bg-white dark:bg-slate-900 text-emerald-655 dark:text-emerald-400 shadow-sm ring-1 ring-black/5"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                }`}
              >
                SOM
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              id="theme-toggler"
              onClick={onToggleTheme}
              className="p-2.5 rounded-lg border border-gray-200/60 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-200 cursor-pointer"
              title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
            >
              {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* Favorites Icon */}
            <button
              id="favorites-shortcut"
              onClick={onViewFavorites}
              className="relative p-2.5 rounded-lg border border-gray-200/60 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-200 cursor-pointer"
              title="View Favorites"
            >
              <Heart className={`h-5 w-5 ${favoritesCount > 0 ? "fill-red-500 text-red-500" : ""}`} />
              {favoritesCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {favoritesCount}
                </span>
              )}
            </button>

            {/* Alerts & Notifications */}
            <div className="relative">
              <button
                id="notifications-button"
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-lg border border-gray-200/60 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition-all duration-200 cursor-pointer"
              >
                <Bell className="h-5 w-5" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-slate-900 animate-bounce">
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {notificationsOpen && (
                <div 
                  id="notifications-dropdown" 
                  className="absolute right-0 mt-3 w-80 rounded-2xl bg-white dark:bg-slate-900 p-4 border border-gray-100 dark:border-slate-800 shadow-xl z-50"
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
                            {new Date(notif.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
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
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200/50 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 cursor-pointer text-slate-700 dark:text-slate-200 transition-all"
                  >
                    <div className="h-8 w-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold font-display text-sm">
                      {currentUser.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex flex-col text-left max-w-[100px] overflow-hidden">
                      <span className="text-xs font-semibold truncate leading-none">{currentUser.name}</span>
                      <span className="text-[10px] text-slate-400 uppercase font-mono mt-0.5 leading-none">{currentUser.role}</span>
                    </div>
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 shadow-2xl z-50 p-2 overflow-hidden">
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
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-left text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all"
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
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 transition-all duration-200 font-medium text-sm cursor-pointer shadow-md shadow-emerald-900/10"
                >
                  <User className="h-4 w-4" />
                  <span>{dict.brokerLogin}</span>
                </button>
              )}
            </div>

          </div>

          {/* Mobile Menu Action Indicator */}
          <div className="flex items-center gap-2.5 lg:hidden">

            {/* Mobile Language Switcher Pill */}
            <div className="flex items-center bg-slate-100/90 dark:bg-slate-800 p-0.5 rounded-lg border border-gray-205 dark:border-slate-800 shadow-sm">
              <button
                onClick={() => language !== "en" && onToggleLanguage()}
                className={`px-2 py-1 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                  language === "en"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                EN
              </button>
              <button
                onClick={() => language !== "so" && onToggleLanguage()}
                className={`px-2 py-1 rounded text-[10px] font-bold tracking-tight transition-all cursor-pointer ${
                  language === "so"
                    ? "bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm"
                    : "text-slate-400 dark:text-slate-500"
                }`}
              >
                SO
              </button>
            </div>

            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border border-gray-200/50 dark:border-slate-800 text-slate-500 dark:text-slate-400"
            >
              {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-trigger"
              className="p-2 rounded-lg border border-gray-200/50 dark:border-slate-800 text-slate-700 dark:text-slate-200"
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
    </header>
  );
}
