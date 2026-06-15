/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Sparkles, Building2, Home, Map, Briefcase, Gem, Car } from "lucide-react";
import { Property, PropertyCategory } from "../types";
import PropertyCard from "./PropertyCard";
import { Language, translations } from "../localization";

interface PropertyGridProps {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (id: string) => void;
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  onClearFilters: () => void;
  language?: Language;
  regionFilter?: string;
}

type SortOption = "newest" | "price-asc" | "price-desc" | "size-desc";

export default function PropertyGrid({
  properties,
  favorites,
  onToggleFavorite,
  onViewDetails,
  selectedCategory,
  setSelectedCategory,
  onClearFilters,
  language = "en",
  regionFilter = ""
}: PropertyGridProps) {
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [bestOnly, setBestOnly] = useState<boolean>(false);
  const dict = translations[language];

  // Filter properties based on the category tabs
  const categoryFiltered = selectedCategory
    ? properties.filter(p => p.category === selectedCategory)
    : properties;

  // Filter to show only featured (best) properties if enabled
  const bestFiltered = bestOnly
    ? categoryFiltered.filter(p => p.featured)
    : categoryFiltered;

  // Now apply sorting option
  const sortedProperties = [...bestFiltered].sort((a, b) => {
    if (sortOption === "price-asc") {
      return a.price - b.price;
    }
    if (sortOption === "price-desc") {
      return b.price - a.price;
    }
    if (sortOption === "size-desc") {
      return b.areaSize - a.areaSize;
    }
    // "newest" -> assume ISO date ordering
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const getCategoryLabel = (cat: string) => {
    if (!cat) return language === "en" ? "All" : "Dhammaan";
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

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case "Properties":
      case "House":
        return Home;
      case "Land for Sale":
      case "LandSale":
        return Map;
      case "Apartments":
      case "Apartment":
        return Building2;
      case "Commercial Buildings":
      case "Commercial":
        return Briefcase;
      case "Villas":
      case "Villa":
        return Gem;
      case "Cars for Sale":
      case "CarSale":
        return Car;
      default:
        return Sparkles;
    }
  };

  const categoriesList = [
    { label: getCategoryLabel(""), value: "" },
    ...Object.values(PropertyCategory).map(cat => ({ label: getCategoryLabel(cat), value: cat }))
  ];

  return (
    <section id="properties" className="pt-12 pb-20 bg-gradient-to-b from-slate-50 via-slate-100 to-slate-50 dark:from-slate-900 dark:via-slate-850 dark:to-slate-900 transition-all border-b border-emerald-500/10 dark:border-emerald-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Title */}
        <div className="text-center max-w-4xl mx-auto mb-10">
          <span className="text-[12px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-mono bg-emerald-500/10 dark:bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
            {language === "en" ? "Kireeye Catalogue" : "Guryaha Kireeye"}
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-950 dark:text-white mt-4 tracking-tighter flex items-center justify-center gap-2.5 flex-wrap">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-emerald-800 to-emerald-600 dark:from-white dark:via-emerald-400 dark:to-teal-300 drop-shadow-sm">{dict.featuredProperties}</span>
            {regionFilter && (
              <span className="text-emerald-600 dark:text-emerald-400 text-3xl sm:text-4xl lg:text-5xl font-extrabold animate-fade-in animate-duration-300">
                • {regionFilter}
              </span>
            )}
          </h2>
        </div>

        {/* Sorting and Results count header panel */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white/95 dark:bg-[#0c130f]/95 border border-emerald-500/10 dark:border-emerald-500/15 p-5 rounded-2xl mb-10 gap-4 shadow-md backdrop-blur-md">
          
          <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 flex-wrap">
            <span>{language === "en" ? "Showing" : "Hadda waxaa muuqda"}</span>
            <span className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400 px-2 py-0.5 rounded-md font-mono font-black">{sortedProperties.length}</span>
            <span>{language === "en" ? "listed properties in" : "guri oo la hubiyey kuna yaala"}</span>
            <span className="bg-emerald-500/10 text-emerald-700 dark:bg-emerald-400/10 dark:text-emerald-400 px-2.5 py-1 rounded-md font-extrabold text-[11px] uppercase tracking-wider">
              {regionFilter ? regionFilter : (language === "en" ? "All Areas" : "Dhammaan Xaafadaha")}
            </span>
            {selectedCategory && (
              <span>{language === "en" ? "under" : "ee qeybta"} <span className="text-slate-900 dark:text-white font-black underline decoration-emerald-500/30 decoration-2">{getCategoryLabel(selectedCategory)}</span></span>
            )}
            {bestOnly && (
              <span className="ml-1 px-2.5 py-1 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 font-extrabold text-[10px] uppercase border border-amber-500/10">★ Best Collection active</span>
            )}
          </div>

          {/* Controls Panel */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto justify-end">
            
            {/* Best Choice Filter Toggle */}
            <button
              type="button"
              onClick={() => setBestOnly(!bestOnly)}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-black transition-all duration-200 border cursor-pointer ${
                bestOnly 
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 shadow-md shadow-amber-500/15" 
                  : "bg-stone-50 dark:bg-[#111c16] text-slate-800 dark:text-slate-350 border-slate-200 dark:border-emerald-500/10 hover:bg-stone-100 dark:hover:bg-[#15241d]"
              }`}
            >
              <span className={`${bestOnly ? "text-slate-950 animate-pulse" : "text-amber-500 font-bold"}`}>★</span>
              <span>
                {bestOnly 
                  ? (language === "en" ? "Show All Listings" : "Muuji Dhammaan ×") 
                  : (language === "en" ? "Best Collection (★)" : "Kuwa ugu Wanaagsan (★)")}
              </span>
            </button>

            {/* Sort Controller Trigger */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <span className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 font-mono whitespace-nowrap">
                <ArrowUpDown className="h-3.5 w-3.5" /> {language === "en" ? "Sort:" : "U kala Sg:"}
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-stone-50 dark:bg-[#111c16] text-slate-800 dark:text-slate-200 text-xs font-bold py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-emerald-500/10 outline-none focus:border-emerald-500 cursor-pointer"
              >
                <option value="newest" className="bg-white dark:bg-[#0c130f]">{language === "en" ? "Newest Listings" : "Kuwa ugu Cusub"}</option>
                <option value="price-asc" className="bg-white dark:bg-[#0c130f]">{language === "en" ? "Price: Low to High" : "Qiimo: Hoose ilaa Sare"}</option>
                <option value="price-desc" className="bg-white dark:bg-[#0c130f]">{language === "en" ? "Price: High to Low" : "Qiimo: Sare ilaa Hoose"}</option>
                <option value="size-desc" className="bg-white dark:bg-[#0c130f]">{language === "en" ? "Area Size: Largest" : "Baaxad: Ugu Baaxad weyn"}</option>
              </select>
            </div>
            
          </div>

        </div>

        {/* Property Grid Container */}
        {sortedProperties.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 rounded-3xl p-8 max-w-lg mx-auto">
            <div className="h-16 w-16 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 dark:text-emerald-400 mx-auto mb-6">
              <Building2 className="h-8 w-8" />
            </div>
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
              {language === "en" ? "No Matching Properties Found" : "Wax Guryo Ah Looma Helin"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
              {dict.noPropertiesFound}
            </p>
            <div className="flex gap-3 justify-center mt-6">
              <button 
                onClick={onClearFilters}
                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-650 dark:hover:bg-emerald-550 text-white font-bold text-xs rounded-xl cursor-pointer shadow-md"
              >
                <RefreshCw className="h-3.5 w-3.5" /> {language === "en" ? "Reset All Filters" : "Kala bixi dhamaan filters-ka ×"}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedProperties.map((prop) => (
              <div key={prop.id} className="animate-fade-in-up">
                <PropertyCard
                  property={prop}
                  isFavorite={favorites.includes(prop.id)}
                  onToggleFavorite={onToggleFavorite}
                  onViewDetails={onViewDetails}
                  language={language}
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
