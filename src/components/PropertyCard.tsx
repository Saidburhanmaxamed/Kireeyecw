/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Heart, MapPin, Bed, Bath, Maximize2, Tag, CheckCircle } from "lucide-react";
import { Property, PropertyStatus } from "../types";
import { Language } from "../localization";

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onViewDetails: (id: string) => void;
  language?: Language;
}

export default function PropertyCard({
  property,
  isFavorite,
  onToggleFavorite,
  onViewDetails,
  language = "en"
}: PropertyCardProps) {
  // Format numbers nicely, e.g. $450,000 or $1,550/mo
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(property.price);

  const getCategoryLabel = (cat: string) => {
    if (language === "en") return cat;
    const cats: Record<string, string> = {
      "Villa": "Fiilla",
      "Apartment": "Aqal/Filaatiko",
      "HouseRent": "Kiro",
      "HouseSale": "Iib",
      "Commercial": "Ganacsi",
      "Land": "Dhul/Boos"
    };
    return cats[cat] || cat;
  };

  return (
    <div 
      id={`property-card-${property.id}`}
      onClick={() => onViewDetails(property.id)}
      className="group flex flex-col h-full bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-2xl overflow-hidden premium-shadow cursor-pointer hover:border-emerald-500/30 transition-all duration-300"
    >
      
      {/* Property Image Container */}
      <div className="relative aspect-video w-full overflow-hidden bg-slate-100 dark:bg-slate-850">
        
        {/* Actual Image */}
        <img
          src={property.images[0]}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Status Badge (Rent/Sale) */}
        <span className={`absolute top-4 left-4 z-10 px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider shadow ${
          property.status === PropertyStatus.Sale
            ? "bg-emerald-600 text-white"
            : "bg-blue-600 text-white"
        }`}>
          {property.status === PropertyStatus.Sale
            ? (language === "en" ? "For Sale" : "Iib")
            : (language === "en" ? "For Rent" : "Kiro")}
        </span>

        {/* Best Choice Highlight Badge */}
        {property.featured && (
          <span className="absolute top-4 left-24 md:left-26 z-10 py-1.5 px-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1 font-sans animate-pulse">
            ★ {language === "en" ? "Best Choice" : "Ugu Habboon"}
          </span>
        )}

        {/* Category Highlight */}
        <span className="absolute bottom-4 left-4 z-10 py-1 px-2.5 rounded bg-slate-900/85 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider">
          {getCategoryLabel(property.category)}
        </span>

        {/* Interactive Favorite Icon Overlay */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id, e);
          }}
          className="absolute top-4 right-4 z-10 p-2 rounded-xl bg-white/90 dark:bg-slate-950/80 backdrop-blur-md shadow-md text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 transition-colors cursor-pointer"
          title={isFavorite 
            ? (language === "en" ? "Remove from favorites" : "Ka saar kuwa la jecelyahay") 
            : (language === "en" ? "Save to favorites" : "Ku dar kuwa la jecelyahay")}
        >
          <Heart className={`h-4.5 w-4.5 transition-colors ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </button>

      </div>

      {/* Property Information Content */}
      <div className="p-5 flex flex-col flex-1 justify-between gap-4">
        
        <div className="space-y-2">
          {/* Rating, Vetted Stamp or Verified Flag */}
          <div className="flex justify-between items-center text-xs gap-2 flex-wrap">
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 font-bold font-mono uppercase text-[9px] flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> {language === "en" ? "Vetted Title-Deeds" : "Mulkiyad la Hubiyey"}
            </span>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 font-black tracking-wide text-[11px] uppercase shadow-sm flex items-center gap-1">
              <span className="animate-pulse">📍</span> {property.region}
            </span>
          </div>

          {/* Title Header with readable high-contrast typography */}
          <h3 className="font-display font-bold text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {property.title}
          </h3>

          {/* Price Layout */}
          <div className="flex items-baseline gap-1 pt-1">
            <span className="text-lg font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">
              {formattedPrice}
            </span>
            {property.status === PropertyStatus.Rent && (
              <span className="text-slate-400 dark:text-slate-500 text-xs font-medium font-sans">
                {language === "en" ? "/ month" : "/ bishii"}
              </span>
            )}
          </div>

          {/* Location details */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 pt-1">
            <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">{property.location}</span>
          </div>

          {/* Rent availability date (Taariikhda) */}
          {property.status === PropertyStatus.Rent && (
            <div className="mt-2 text-emerald-700 dark:text-emerald-400 text-[10px] font-extrabold flex items-center gap-1 bg-emerald-500/10 dark:bg-emerald-500/5 px-2 py-1 rounded-md w-fit">
              <span>📅 {language === "en" ? "Available:" : "Taariikhda:"} {property.availableDate || (language === "en" ? "Available Now" : "Hadda diyaar ah")}</span>
            </div>
          )}
        </div>

        {/* Interactive specs row */}
        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-gray-100 dark:border-slate-800/80 text-slate-500 dark:text-slate-400">
          
          <div className="flex items-center gap-1.5 justify-center">
            <Bed className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold">
              {property.bedrooms > 0 
                ? (language === "en" ? `${property.bedrooms} Beds` : `${property.bedrooms} Qolal`) 
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 justify-center border-l border-r border-gray-100 dark:border-slate-850">
            <Bath className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold">
              {property.bathrooms > 0 
                ? (language === "en" ? `${property.bathrooms} Baths` : `${property.bathrooms} Musqul`) 
                : "N/A"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 justify-center">
            <Maximize2 className="h-4 w-4 text-slate-400" />
            <span className="text-xs font-semibold">{property.areaSize} m²</span>
          </div>

        </div>

        {/* View Details Button link */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewDetails(property.id);
          }}
          className="w-full text-center py-2.5 rounded-xl text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 border border-emerald-600 hover:border-emerald-700 font-bold text-xs tracking-wider uppercase transition-all duration-200 cursor-pointer shadow-sm shadow-emerald-500/15"
        >
          {language === "en" ? "Details & Contact Broker" : "Faahfaahin & La Xiriir Broker"}
        </button>

      </div>

    </div>
  );
}
