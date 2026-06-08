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
}

const INITIAL_FILTERS: SearchFilters = {
  status: "",
  region: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  bedrooms: "",
  bathrooms: ""
};

export default function Hero({ onSearch, onResetSearch, language = "en", onShowNewEntries, newEntriesCount }: HeroProps) {
  const [filters, setFilters] = useState<SearchFilters>(INITIAL_FILTERS);
  const dict = translations[language];

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
    <div id="hero-section" className="relative bg-slate-900 overflow-hidden py-24 sm:py-32">
      {/* Decorative premium asset background (abstract shapes & dots) */}
      <div className="absolute inset-0 z-0 opacity-45 mix-blend-overlay">
        <img 
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1920&q=80" 
          className="w-full h-full object-cover" 
          alt="Premium Real Estate Banner"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/90 to-slate-950/80" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Display Typography Title */}
        <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 max-w-4xl mx-auto leading-none">
          {language === "en" ? (
            <>Find houses, shops rent in <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">abudwak</span></>
          ) : (
            <>Raadi guryaha, dukaamada kirada ah ee <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-green-400">abudwak</span></>
          )}
        </h1>
        
        <p className="font-sans text-base sm:text-lg lg:text-xl text-slate-300 mb-6 max-w-2xl mx-auto font-light leading-relaxed">
          {dict.heroSub}
        </p>

        {/* Live Notification Pillow Button */}
        {onShowNewEntries && (
          <div className="flex justify-center mb-8">
            <button
              id="new-entries-notification-pill"
              onClick={onShowNewEntries}
              className="group inline-flex items-center gap-3 px-4 py-2 bg-slate-900 border border-emerald-500/30 hover:border-emerald-400 text-slate-350 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer hover:bg-slate-850 shadow-md shadow-emerald-500/5"
              title={language === "en" ? "Filter All New Entries" : "Shaandhee Guryaha Cusub"}
            >
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-400 px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-wider uppercase border border-emerald-500/25">
                <span>NEWS</span>
                <span className="text-[9px]">•</span>
                <span>08-JUN-2026</span>
              </span>
              
              <span className="text-slate-200 group-hover:text-emerald-400 transition-colors text-[11px] sm:text-xs font-sans">
                {language === "en"
                  ? `View ${newEntriesCount || 4} recent entries in Abudwak →`
                  : `Eeg ${newEntriesCount || 4} guri oo dhawaan ku soo kordhay →`}
              </span>
            </button>
          </div>
        )}

        {/* Search & Filter Glass Box Container */}
        <div id="search-box-container" className="max-w-5xl mx-auto bg-slate-950/85 border-2 border-emerald-500/20 p-6 sm:p-8 rounded-3xl backdrop-blur-2xl shadow-2xl relative">
          
          {/* Quick Tab - Rent / Sale Switch with Maximum Visibility */}
          <div className="flex flex-col gap-3.5 mb-8 border-b border-white/10 pb-6">
            <div className="text-left">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest font-mono">1. DOORO NOOCA / CHOOSE STATUS</span>
              <h3 className="text-sm font-extrabold text-white">
                {language === "en" ? "Looking for a rental or to buy?" : "Ma doonaysaa Kiro mise Iib?"}
              </h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5 w-full">
              {/* All Properties Button */}
              <button
                type="button"
                onClick={() => handleStatusChange("")}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  filters.status === ""
                    ? "bg-white text-slate-950 border-white shadow-xl scale-[1.03]"
                    : "bg-slate-900/60 text-slate-350 border-white/10 hover:bg-slate-900 hover:border-white/20"
                }`}
              >
                <Building2 className={`h-4.5 w-4.5 ${filters.status === "" ? "text-slate-950" : "text-slate-400"}`} />
                <span>{language === "en" ? "All Listings" : "Dhammaan Guryaha"}</span>
              </button>

              {/* For Rent Button (Kiro) */}
              <button
                type="button"
                onClick={() => handleStatusChange(PropertyStatus.Rent)}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  filters.status === PropertyStatus.Rent
                    ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/40 scale-[1.03] ring-2 ring-emerald-500/30"
                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                }`}
              >
                <Key className="h-4.5 w-4.5 animate-pulse" />
                <span>{language === "en" ? "Kiro / For Rent" : "Kiro (Rent)"}</span>
                {filters.status === PropertyStatus.Rent && <Check className="h-4 w-4 stroke-[3px]" />}
              </button>

              {/* Xaafadda (Neighborhood selector / active region button) - INSTANTLY VISIBLE BETWEEN RENT AND SELL */}
              <div className="relative">
                {filters.region ? (
                   <button
                    type="button"
                    onClick={() => {
                      const updated = { ...filters, region: "" };
                      setFilters(updated);
                      onSearch(updated);
                    }}
                    className="w-full h-full flex items-center justify-center gap-1.5 py-4 px-4 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 border bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/35 scale-[1.03] cursor-pointer ring-2 ring-amber-500/30"
                  >
                    <MapPin className="h-4.5 w-4.5 text-slate-950 animate-bounce" />
                    <span className="truncate">{language === "en" ? "Area" : "Xaafadda"}: {filters.region}</span>
                    <span className="bg-slate-950/25 rounded-full h-4.5 w-4.5 flex items-center justify-center text-[10px] font-black leading-none pb-0.5">×</span>
                  </button>
                ) : (
                  <div className="relative h-full">
                    <select
                      value={filters.region}
                      onChange={(e) => {
                        const updated = { ...filters, region: e.target.value };
                        setFilters(updated);
                        onSearch(updated);
                      }}
                      className="w-full h-full min-h-[56px] appearance-none flex items-center justify-center gap-2 py-4 pl-9 pr-6 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-amber-400 bg-amber-550/10 border border-amber-550/20 hover:bg-amber-550/20 hover:border-amber-400 transition-all duration-300 text-center cursor-pointer font-sans"
                    >
                      <option value="" className="bg-slate-950 text-slate-300">📍 {language === "en" ? "Select Area" : "📍 Dooro Xaafadda"}</option>
                      {SOMALI_REGIONS.map(reg => (
                        <option key={reg} value={reg} className="bg-slate-950 text-slate-200">{reg}</option>
                      ))}
                    </select>
                    <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-amber-400">
                      <MapPin className="h-4 w-4 animate-pulse" />
                    </div>
                  </div>
                )}
              </div>

              {/* For Sale Button (Iib) */}
              <button
                type="button"
                onClick={() => handleStatusChange(PropertyStatus.Sale)}
                className={`flex items-center justify-center gap-2 py-4 px-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider transition-all duration-300 border cursor-pointer ${
                  filters.status === PropertyStatus.Sale
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-500 shadow-lg shadow-blue-600/40 scale-[1.03] ring-2 ring-blue-500/30"
                    : "bg-blue-600/10 text-blue-400 border-blue-650/20 hover:bg-blue-600/20 hover:border-blue-650/40"
                }`}
              >
                <Coins className="h-4.5 w-4.5" />
                <span>{language === "en" ? "Iib / For Sale" : "Iib (Sale)"}</span>
                {filters.status === PropertyStatus.Sale && <Check className="h-4 w-4 stroke-[3px]" />}
              </button>
            </div>
          </div>

          <form onSubmit={handleApplyFilters} className="space-y-6">
            
            {/* Primary Grid Filter Criteria */}
            <div className="space-y-5 text-left">
              
              {/* Region Column (Xaafadda Location Selector) - Extreme Premium Visibility Grid */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-1">
                  <div>
                    <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-emerald-400 animate-bounce" /> {language === "en" ? "Select Caabudwaaq Neighborhood" : "Dooro Xaafadda Caabudwaaq"}
                    </h3>
                  </div>
                  {filters.region && (
                    <button
                      type="button"
                      onClick={() => {
                        const updated = { ...filters, region: "" };
                        setFilters(updated);
                        onSearch(updated);
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold font-mono py-1 px-2.5 rounded bg-emerald-500/10 border border-emerald-550/20 hover:bg-emerald-500/20"
                    >
                      {language === "en" ? "Clear Area selection ×" : "Kala dooro dhammaan ×"}
                    </button>
                  )}
                </div>

                {/* Instant clickable buttons for each Caabudwaaq Neighborhood */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2.5">
                  {SOMALI_REGIONS.map((reg) => {
                    const isSelected = filters.region === reg;
                    return (
                      <button
                        key={reg}
                        type="button"
                        onClick={() => {
                          const updated = { ...filters, region: isSelected ? "" : reg };
                          setFilters(updated);
                          onSearch(updated);
                        }}
                        className={`p-3.5 rounded-2xl text-xs font-black transition-all duration-200 flex flex-col items-center justify-center gap-1.5 border text-center cursor-pointer ${
                          isSelected
                            ? "bg-gradient-to-b from-emerald-500 to-emerald-650 text-white border-emerald-400 shadow-md shadow-emerald-500/30 ring-2 ring-emerald-500/40 scale-[1.04]"
                            : "bg-slate-900/60 text-slate-300 border-white/5 hover:bg-slate-900 hover:border-white/20"
                        }`}
                      >
                        <span className="font-mono text-[9px] uppercase tracking-wider text-slate-400">
                          {isSelected ? "● ACTIVE" : "LOCAL AREA"}
                        </span>
                        <span className="text-sm tracking-tight">{reg}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Optional Fallback styled selector tool */}
                <div className="relative mt-1">
                  <select
                    value={filters.region}
                    onChange={(e) => {
                      const updated = { ...filters, region: e.target.value };
                      setFilters(updated);
                      onSearch(updated);
                    }}
                    className="w-full h-full min-h-[44px] bg-slate-900 border border-white/10 hover:border-white/20 focus:outline-none focus:border-emerald-500 text-xs rounded-xl text-slate-200 py-3.5 px-4 font-bold transition-all"
                  >
                    <option value="">{language === "en" ? "Or choose via dropdown selection" : "Ama ka dooro halkan list-a"}</option>
                    {SOMALI_REGIONS.map(reg => (
                      <option key={reg} value={reg}>{reg}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Property Category Column and Price Options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                    3. {language === "en" ? "CHOOSE SPECS (PROPERTY TYPE)" : "DOORO NOOCA CADAYNTA"}
                  </label>
                  <div className="relative">
                    <select
                      value={filters.category}
                      onChange={(e) => setFilters({ ...filters, category: e.target.value })}
                      className="w-full bg-slate-900 text-slate-250 py-3.5 px-4 rounded-xl border border-white/10 hover:border-white/20 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-xs font-bold transition-all"
                    >
                      <option value="">{language === "en" ? "All Categories" : "Dhammaan Noocyada"}</option>
                      {Object.values(PropertyCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="flex flex-col justify-end">
                  <div className="flex gap-3 w-full">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3.5 bg-slate-900/60 hover:bg-slate-900 text-slate-350 hover:text-white rounded-xl text-xs font-bold transition-all border border-white/5"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      <span>{language === "en" ? "Reset" : "Kala bixi filters-ka"}</span>
                    </button>
                    <button
                      type="submit"
                      className="flex-[1.5] flex items-center justify-center gap-2 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm rounded-xl transition-all shadow-lg hover:shadow-emerald-500/20 border border-emerald-500 uppercase tracking-wider cursor-pointer"
                    >
                      <Search className="h-4 w-4" />
                      <span>{language === "en" ? "Search" : "Baadi Goob"}</span>
                    </button>
                  </div>
                </div>
              </div>

            </div>

          </form>

        </div>

        {/* Quick Suggestion Regions tag buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
          <span className="text-xs text-slate-400 font-mono">
            {language === "en" ? "Neighborhoods:" : "Xaafadaha Caabudwaaq:"}
          </span>
          {SOMALI_REGIONS.map((region) => (
            <button
              key={region}
              onClick={() => handleQuickRegion(region)}
              className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white/5 text-slate-200 border border-white/10 hover:bg-white/10 hover:border-emerald-400 transition-all cursor-pointer"
            >
              {region}
            </button>
          ))}
        </div>

      </div>

    </div>
  );
}
