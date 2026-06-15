/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Search, MapPin, Home, RefreshCw, Key, Coins, Building2, Check } from "lucide-react";
import { PropertyStatus, PropertyCategory } from "../types";
import { SOMALI_REGIONS } from "../data";
import { Language, translations } from "../localization";

interface HeroProps {
  onSearch: (filters: SearchFilters) => void;
  onResetSearch: () => void;
  language?: Language;
  onShowNewEntries?: () => void;
  newEntriesCount?: number;
}

export interface SearchFilters {
  status: PropertyStatus | "";
  region: string;
  category: string;
  minPrice: string;
  maxPrice: string;
  bedrooms: string;
  bathrooms: string;
  hasTitleDeed: string;
}

const INITIAL_FILTERS: SearchFilters = {
  status: "",
  region: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: "",
  hasTitleDeed: "all"
};

export default function Hero({ onSearch, onResetSearch, language = "en", onShowNewEntries, newEntriesCount }: HeroProps) {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const dict = translations[language];

  const getCategoryLabel = (cat: string) => {
    if (!cat) return language === "en" ? "All Types/Nooc kasta" : "Nooc kasta";
    if (language === "en") {
      if (cat === "House" || cat === "Properties") return "Properties";
      if (cat === "LandSale" || cat === "Land for Sale") return "Land for Sale";
      if (cat === "Apartment" || cat === "Apartments") return "Apartments";
      if (cat === "Commercial" || cat === "Commercial Buildings") return "Commercial Buildings";
      if (cat === "Villa" || cat === "Villas") return "Villas";
      if (cat === "CarSale" || cat === "Cars for Sale") return "Cars for Sale";
      return cat;
    }
    const cats: Record<string, string> = {
      "Villa": "Fillooyinka 🏰",
      "Apartment": "Aqalka/Filaatiko 🏢",
      "House": "Guryaha 🏠",
      "Commercial": "Meelaha Ganacsiga 🛍️",
      "Land": "Dhulka/Boosaska 🗺️",
      "LandSale": "Dhulka/Boosaska 🗺️",
      "Villas": "Fillooyinka 🏰",
      "Apartments": "Aqalka/Filaatiko 🏢",
      "Properties": "Guryaha 🏠",
      "Commercial Buildings": "Meelaha Ganacsiga 🛍️",
      "Land for Sale": "Dhulka/Boosaska 🗺️",
      "CarSale": "Gaadiidka / Cars 🚗",
      "Cars for Sale": "Gaadiidka / Cars 🚗"
    };
    return cats[cat] || cat;
  };

  // Quick tag selection helper
  const handleQuickRegion = (region: string) => {
    const updated = { ...filters, region };
    setFilters(updated);
    onSearch(updated);
  };

  const handleStatusChange = (status: PropertyStatus | "") => {
    const updated = { ...filters, status };
    setFilters(updated);
    onSearch(updated);
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const handleReset = () => {
    setFilters(INITIAL_FILTERS);
    onResetSearch();
  };

  return (
    <div id="hero-section" className="relative bg-gradient-to-b from-[#012a18] via-[#023e25] to-[#01180e] overflow-hidden py-24 sm:py-32 md:py-40 border-b border-[#034d2d]/30">
      {/* Decorative premium asset background (abstract shapes & dots) */}
      <div className="absolute inset-0 z-0 opacity-30 mix-blend-overlay">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover" 
          alt="Premium Real Estate Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#01180e] via-[#023e25]/80 to-[#012a18]/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Display Typography Title */}
        <h1 className="font-sans font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-8xl tracking-tighter text-white mb-6 max-w-5xl mx-auto leading-none uppercase drop-shadow-lg animate-fade-in">
          {language === "en" ? (
            <>Find Houses & Shops in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-teal-400 drop-shadow-md">Abudwak</span></>
          ) : (
            <>Raadi Guryaha & Dukaamada <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-yellow-300 to-teal-400 drop-shadow-md">Caabudwaaq</span></>
          )}
        </h1>
        
        <p className="font-sans text-sm sm:text-base lg:text-lg text-emerald-100/90 mb-8 max-w-2xl mx-auto font-light leading-relaxed">
          {dict.heroSub}
        </p>

        {/* Live Notification Pillow Button */}
        {onShowNewEntries && (
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mb-6">
            <button
               id="new-entries-notification-pill"
               onClick={onShowNewEntries}
               className="group inline-flex items-center gap-3 px-5 py-2.5 bg-emerald-950/80 border border-emerald-500/30 hover:border-emerald-400 text-emerald-200 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer hover:bg-emerald-950 shadow-md shadow-emerald-500/5"
               title={language === "en" ? "Filter All New Entries" : "Shaandhee Guryaha Cusub"}
            >
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/25">
                <span>NEWS</span>
                <span className="text-[9px]">•</span>
                <span>08-JUN-2026</span>
              </span>
              
              <span className="text-white group-hover:text-emerald-400 transition-colors text-xs font-sans">
                {language === "en"
                  ? `View ${newEntriesCount || 4} recent entries in Abudwak →`
                  : `Eeg ${newEntriesCount || 4} guri oo dhawaan ku soo kordhay →`}
              </span>
            </button>

            <button
               id="hero-contact-scroll-btn"
               onClick={() => {
                 const el = document.getElementById("contact");
                 if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
               }}
               className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 hover:border-emerald-400 text-white text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer shadow-md"
               title={language === "en" ? "Contact Us" : "Nala Soo Xiriir"}
            >
              <span>📞</span>
              <span>{language === "en" ? "Contact Us / Support" : "Nala Soo Xiriir"}</span>
            </button>
          </div>
        )}

        {/* Sleek Minimalist Search Bar at Home */}
        <div id="home-search-bar" className="max-w-4xl mx-auto mt-10">
          <form onSubmit={handleApplyFilters} className="bg-emerald-950/90 border border-emerald-500/30 p-2.5 rounded-2xl backdrop-blur-md shadow-2xl flex flex-col md:flex-row gap-2.5 items-center">
            
            {/* 1. Neighborhood Selector */}
            <div className="relative w-full md:w-1/3">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <select
                id="search-region-dropdown"
                value={filters.region}
                onChange={(e) => {
                  const updated = { ...filters, region: e.target.value };
                  setFilters(updated);
                  onSearch(updated);
                }}
                className="w-full bg-transparent text-white pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-0 focus:outline-none text-xs font-bold tracking-wide transition-all cursor-pointer"
              >
                <option value="" className="bg-[#01180e] text-emerald-250">
                  {language === "en" ? "Select Neighborhood (All)" : "Kala dooro Xaafada (Dhammaan)"}
                </option>
                {SOMALI_REGIONS.map(reg => (
                  <option key={reg} value={reg} className="bg-[#01180e] text-white font-bold">{reg}</option>
                ))}
              </select>
            </div>

            <div className="hidden md:block h-6 w-[1px] bg-emerald-800/50" />

            {/* 2. Category Selector */}
            <div className="relative w-full md:w-1/3">
              <Home className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <select
                id="search-category-dropdown"
                value={filters.category}
                onChange={(e) => {
                  const updated = { ...filters, category: e.target.value };
                  setFilters(updated);
                  onSearch(updated);
                }}
                className="w-full bg-transparent text-white pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-0 focus:outline-none text-xs font-bold tracking-wide transition-all cursor-pointer"
              >
                <option value="" className="bg-[#01180e] text-emerald-250">
                  {language === "en" ? "Property Type (All)" : "Nooca guryaha (Dhammaan)"}
                </option>
                {Object.values(PropertyCategory).map(cat => (
                  <option key={cat} value={cat} className="bg-[#01180e] text-white font-bold">
                    {getCategoryLabel(cat)}
                  </option>
                ))}
              </select>
            </div>

            <div className="hidden md:block h-6 w-[1px] bg-emerald-800/50" />

            {/* 3. Status/Listing Type Selector */}
            <div className="relative w-full md:w-1/3">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400" />
              <select
                id="search-status-dropdown"
                value={filters.status}
                onChange={(e) => {
                  const updated = { ...filters, status: e.target.value as PropertyStatus | "" };
                  setFilters(updated);
                  onSearch(updated);
                }}
                className="w-full bg-transparent text-white pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-0 focus:outline-none text-xs font-bold tracking-wide transition-all cursor-pointer"
              >
                <option value="" className="bg-[#01180e] text-emerald-255">
                  {language === "en" ? "Listing Status (All)" : "Kiro ama Iib (Dhammaan)"}
                </option>
                <option value={PropertyStatus.Rent} className="bg-[#01180e] text-white font-bold">
                  {language === "en" ? "For Rent" : "Kiro (Rent)"}
                </option>
                <option value={PropertyStatus.Sale} className="bg-[#01180e] text-white font-bold">
                  {language === "en" ? "For Sale" : "Iib (Sale)"}
                </option>
              </select>
            </div>

            {/* Search Submit button */}
            <button
              id="search-submit-home-btn"
              type="submit"
              className="w-full md:w-auto px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md hover:shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer h-[48px] shrink-0"
            >
              <Search className="h-4 w-4" />
              <span>{language === "en" ? "Search" : "Baar Hadda"}</span>
            </button>

          </form>

          {/* Quick action triggers/indicators */}
          {(filters.region !== "" || filters.category !== "" || filters.status !== "") && (
            <button 
              id="search-clear-home-btn"
              type="button" 
              onClick={handleReset}
              className="mt-3 text-xs text-emerald-300 hover:text-white transition-all underline cursor-pointer font-medium"
            >
              {language === "en" ? "Clear Search filters / Show All" : "Eeg Dhammaan / Kala bixi"}
            </button>
          )}
        </div>

      </div>

    </div>
  );
}
