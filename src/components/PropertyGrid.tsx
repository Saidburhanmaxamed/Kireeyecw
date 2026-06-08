/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Sparkles, Building2 } from "lucide-react";
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
  language = "en"
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
    if (!cat) return language === "en" ? "All Properties" : "Dhammaan";
    if (language === "en") return cat;
    const cats: Record<string, string> = {
      "Villa": "Fillooyinka 🏰",
      "Apartment": "Aqalka/Filaatiko 🏢",
      "HouseRent": "Guryaha Kirada 🔑",
      "HouseSale": "Guryaha Iibka 💰",
      "Commercial": "Meelaha Ganacsiga 🛍️",
      "Land": "Dhulka/Boosaska 🗺️"
    };
    return cats[cat] || cat;
  };

  const categoriesList = [
    { label: getCategoryLabel(""), value: "" },
    ...Object.values(PropertyCategory).map(cat => ({ label: getCategoryLabel(cat), value: cat }))
  ];

  return (
    <section id="properties" className="py-20 bg-slate-50 dark:bg-slate-900/40 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Module Title */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
            {language === "en" ? "Kireeye Catalogue" : "Guryaha Kireeye"}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {dict.featuredProperties}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {language === "en" 
              ? "Every listing has been validated through municipal deeds registry structures for complete diaspora safety."
              : "Dhammaan guryaha halkan ku qoran waxaa lagu hubiyey maamulka dhulka si aad u sugto amnigaaga."}
          </p>
        </div>

        {/* Dynamic Category Pill Tabs Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categoriesList.map((catSpec) => (
            <button
              key={catSpec.label}
              onClick={() => setSelectedCategory(catSpec.value)}
              className={`px-4.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                selectedCategory === catSpec.value
                  ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-md"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-gray-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {catSpec.label}
            </button>
          ))}
        </div>

        {/* Sorting and Results count header panel */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 p-4 rounded-2xl mb-8 gap-4 shadow-sm">
          
          <div className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">
            {language === "en" ? "Showing" : "Hadda waxaa muuqda"} <span className="text-emerald-600 dark:text-emerald-400 font-mono font-bold">{sortedProperties.length}</span> {language === "en" ? "listed properties" : "guri oo la hubiyey"}
            {selectedCategory && (
              <span> in <span className="text-slate-900 dark:text-white">{getCategoryLabel(selectedCategory)}</span></span>
            )}
            {bestOnly && (
              <span className="ml-1 px-2 py-0.5 rounded bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold text-[10px] uppercase">★ Best Collection active</span>
            )}
          </div>

          {/* Controls Panel */}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 w-full md:w-auto justify-end">
            
            {/* Best Choice Filter Toggle */}
            <button
              type="button"
              onClick={() => setBestOnly(!bestOnly)}
              className={`w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 border cursor-pointer ${
                bestOnly 
                  ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 border-amber-400 font-black shadow-md shadow-amber-500/15" 
                  : "bg-slate-50 dark:bg-slate-950 text-slate-700 dark:text-slate-300 border-gray-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900"
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
              <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono whitespace-nowrap">
                <ArrowUpDown className="h-3.5 w-3.5" /> {language === "en" ? "Sort:" : "U kala Sg:"}
              </span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 text-xs font-bold py-2 px-3 rounded-lg border border-gray-100 dark:border-slate-800 outline-none focus:border-emerald-500"
              >
                <option value="newest" className="bg-slate-100 dark:bg-slate-950">{language === "en" ? "Newest Listings" : "Kuwa ugu Cusub"}</option>
                <option value="price-asc" className="bg-slate-100 dark:bg-slate-950">{language === "en" ? "Price: Low to High" : "Qiimo: Hoose ilaa Sare"}</option>
                <option value="price-desc" className="bg-slate-100 dark:bg-slate-950">{language === "en" ? "Price: High to Low" : "Qiimo: Sare ilaa Hoose"}</option>
                <option value="size-desc" className="bg-slate-100 dark:bg-slate-950">{language === "en" ? "Area Size: Largest" : "Baaxad: Ugu Baaxad weyn"}</option>
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
