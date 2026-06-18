/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  X, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize2, 
  MessageSquare, 
  Mail, 
  Phone, 
  Heart, 
  Share2, 
  CheckCircle2, 
  UserCheck, 
  AlertCircle,
  Send,
  Star
} from "lucide-react";
import { Property, Inquiry, PropertyStatus, PropertyCategory, Agency } from "../types";
import { Language, translations } from "../localization";

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSendInquiry: (inquiry: Omit<Inquiry, "id" | "date">) => void;
  agencies?: Agency[];
  language?: Language;
}

export default function PropertyDetailModal({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSendInquiry,
  agencies = [],
  language = "en"
}: PropertyDetailModalProps) {
  const agency = agencies.find(a => a.id === property.agencyId);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  
  const dict = translations[language];
  const initialMsg = language === "en"
    ? `Hi ${property.ownerName.split(" ")[0]}, I am heavily interested in your listed property "${property.title}" in ${property.region}. Please arrange an inspection slot.`
    : `Salaam ${property.ownerName.split(" ")[0]}, Aad ayaan u danaynayaa guriga halkan ku xusan "${property.title}" ee ${property.region}. Fadlan ii sheeg goorta aan arki karo.`;

  const [inquiryMsg, setInquiryMsg] = useState(initialMsg);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(property.price);

  // Deep Link WhatsApp configuration text template
  const encodedWhatsappText = encodeURIComponent(
    language === "en"
      ? `Salaam ${property.ownerName.split(" ")[0]}, I saw your premium property "${property.title}" listed for ${formattedPrice} on Kireeye. Is it still available for inspection?`
      : `Salaam ${property.ownerName.split(" ")[0]}, Waxaan arkay gurigaada "${property.title}" ee qiimahiisu yahay ${formattedPrice} ee ku jira Kireeye. Ma diyaar baa hadda in aan arko?`
  );
  const whatsappUrl = `https://wa.me/${property.ownerWhatsapp}?text=${encodedWhatsappText}`;

  const handleSubmitInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inquiryName || !inquiryEmail || !inquiryPhone) return;

    onSendInquiry({
      propertyId: property.id,
      propertyTitle: property.title,
      name: inquiryName,
      email: inquiryEmail,
      phone: inquiryPhone,
      message: inquiryMsg
    });

    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setInquiryName("");
      setInquiryEmail("");
      setInquiryPhone("");
    }, 3000);
  };

  return (
    <div 
      id="property-detail-overlay" 
      className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex justify-center items-center p-2 sm:p-4 overflow-y-auto"
    >
      <div 
        id="property-detail-body" 
        className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl overflow-y-auto lg:overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[95vh] lg:max-h-[92vh] transition-colors"
      >
        
        {/* Modal Close Floating Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-25 p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-white backdrop-blur-md cursor-pointer"
          title="Close details"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Left Section: Image gallery, description, details, custom interactive map */}
        <div className="flex-1 lg:overflow-y-auto p-4 sm:p-8 space-y-6 sm:space-y-8 h-auto lg:h-[92vh]">
          
          {/* Main Title Banner */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold uppercase tracking-wider text-[10px]">
                {property.status === PropertyStatus.Sale
                  ? (language === "en" ? "For Sale" : "Iib")
                  : (language === "en" ? "For Rent" : "Kiro")}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                {language === "en" ? (
                  property.category === "House" || property.category === "Properties" ? "Properties" : property.category
                ) : (
                  property.category === "Villa" || property.category === "Villas" ? "Fiilla" :
                  property.category === "Apartment" || property.category === "Apartments" ? "Aqal/Filaatiko" :
                  property.category === "House" || property.category === "Properties" ? "Guryaha" :
                  property.category === "Commercial" || property.category === "Commercial Buildings" ? "Ganacsi" : "Dhul/Boos"
                )}
              </span>
              {property.hasTitleDeed && (
                <span className="px-2.5 py-1 rounded bg-amber-400 text-slate-950 font-black uppercase tracking-wider text-[10px]">
                  📜 {language === "en" ? "Title Deed Ready" : "Waraaqo Diyaar"}
                </span>
              )}
            </div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-slate-900 dark:text-white leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-emerald-600" />
              <span>{property.location}</span>
            </div>
          </div>

          {/* Instant Top Broker Contact Bar (Near details) */}
          <div className="bg-emerald-500/10 dark:bg-emerald-500/5 border border-emerald-500/15 p-3.5 sm:p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 self-start sm:self-auto w-full sm:w-auto">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-display font-black text-sm uppercase shadow-sm flex-shrink-0">
                  {property.ownerName.charAt(0)}
                </div>
                <div className="text-left">
                  <span className="text-[9px] font-black text-emerald-650 dark:text-emerald-450 uppercase tracking-widest block">
                    {language === "en" ? "VERIFIED BROKER" : "BROKER LA HUUBIYEY"}
                  </span>
                  <span className="font-extrabold text-slate-900 dark:text-white text-sm block">
                    {property.ownerName}
                  </span>
                </div>
              </div>

              {agency && (
                <div className="flex items-center gap-2 border-t sm:border-t-0 sm:border-l border-emerald-500/20 dark:border-emerald-500/10 pt-2.5 sm:pt-0 sm:pl-4">
                  <div className="h-9 w-9 rounded-lg overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs shrink-0">
                    <img src={agency.logo} alt={agency.name} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
                  </div>
                  <div className="text-left">
                    <span className="text-[9px] font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider block uppercase">
                      {language === "en" ? "REPRESENTING AGENCY" : "WAKAALADDA MATALEYSA"}
                    </span>
                    <span className="text-xs font-black text-emerald-650 dark:text-emerald-400 truncate max-w-[150px] block">
                      {agency.name}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* WhatsApp Button */}
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] sm:text-xs tracking-tight uppercase shadow-xs transition-colors cursor-pointer text-center"
              >
                <MessageSquare className="h-3.5 w-3.5 fill-white/10 flex-shrink-0" />
                <span>WhatsApp</span>
              </a>

              {/* Call Button */}
              <a
                href={`tel:${property.ownerPhone}`}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-[10px] sm:text-xs tracking-tight uppercase transition-colors cursor-pointer border border-slate-700/30 text-center"
              >
                <Phone className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                <span>{language === "en" ? `Call` : `Wac`} ({property.ownerPhone})</span>
              </a>
            </div>
          </div>

          {/* Large Image Frame & Thumbs Grid */}
          <div className="space-y-3">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-gray-100 dark:border-slate-800">
              <img
                src={property.images[activeImageIndex]}
                alt={property.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-all duration-300"
              />
              <span className="absolute bottom-4 right-4 bg-slate-950/75 backdrop-blur-md px-3 py-1.5 rounded-lg text-white font-mono text-xs">
                {activeImageIndex + 1} of {property.images.length}
              </span>
            </div>

            {/* Thumbnail horizontal scroller */}
            {property.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1">
                {property.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative w-24 aspect-[4/3] rounded-xl overflow-hidden border-2 flex-shrink-0 cursor-pointer transition-all ${
                      activeImageIndex === index 
                        ? "border-emerald-500 ring-2 ring-emerald-500/20" 
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} referrerPolicy="no-referrer" className="w-full h-full object-cover" alt="Property Thumb" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick core metrics dashboard */}
          <div className="grid grid-cols-3 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850/80 text-center">
            
            {property.category === PropertyCategory.LandSale ? (
              <>
                {/* Land specific columns */}
                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-lg mb-1">📐</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Dimensions" : "Cabbirka"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1 truncate max-w-full px-1">
                    {property.dimensions || `${property.areaSize} m²`}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2 border-l border-r border-gray-100 dark:border-slate-900">
                  <span className="text-lg mb-1">📜</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Title Deed" : "Warqadda"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.hasTitleDeed ? (language === "en" ? "Available" : "Waa Diyaar") : (language === "en" ? "Unverified" : "La Hubinayo")}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-lg mb-1">🗺️</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Land Use" : "Nooca"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1 uppercase text-[10px] tracking-wider">
                    {property.zoning || "General"}
                  </span>
                </div>
              </>
            ) : property.category === PropertyCategory.Commercial ? (
              <>
                {/* Commercial specific columns */}
                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-lg mb-1">🏢</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Shop Rooms" : "Dukaamada"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.numShops ? `${property.numShops} Rooms` : "N/A"}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2 border-l border-r border-gray-100 dark:border-slate-900">
                  <span className="text-lg mb-1">🚗</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Parking" : "Baarkinka"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.hasParking ? (language === "en" ? "Yes" : "Haa, diyaar") : (language === "en" ? "No" : "Maya")}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <Maximize2 className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Area Size" : "Baaxadda"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.areaSize} m²
                  </span>
                </div>
              </>
            ) : property.category === PropertyCategory.CarSale ? (
              <>
                {/* Car specific columns */}
                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-lg mb-1">🚗</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Make & Model" : "Nooca"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1 uppercase text-[10px] tracking-wider truncate max-w-full px-1">
                    {property.carMake ? `${property.carMake} ${property.carModel || ""}` : "Vehicle"}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2 border-l border-r border-gray-100 dark:border-slate-900">
                  <span className="text-lg mb-1">⚙️</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Transmission" : "Giriig"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.carTransmission || "Automatic"}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <span className="text-lg mb-1">⛽</span>
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Fuel type" : "Shidaalka"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.carFuelType || "Petrol"}
                  </span>
                </div>
              </>
            ) : (
              <>
                {/* Standard property columns */}
                <div className="flex flex-col items-center justify-center py-2">
                  <Bed className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Bedrooms" : "Qolalka"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.bedrooms > 0 ? (language === "en" ? `${property.bedrooms} Beds` : `${property.bedrooms} Qol`) : "N/A"}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2 border-l border-r border-gray-100 dark:border-slate-900">
                  <Bath className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Bathrooms" : "Musqulaha"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.bathrooms > 0 ? (language === "en" ? `${property.bathrooms} Baths` : `${property.bathrooms} Musqul`) : "N/A"}
                  </span>
                </div>

                <div className="flex flex-col items-center justify-center py-2">
                  <Maximize2 className="h-5 w-5 text-emerald-600 mb-1" />
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">{language === "en" ? "Area Size" : "Baaxadda"}</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-white mt-1">
                    {property.areaSize} m²
                  </span>
                </div>
              </>
            )}

          </div>

          {/* Car Specific Full technical parameters */}
          {property.category === PropertyCategory.CarSale && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-emerald-500/[0.02] dark:bg-emerald-500/[0.01] border border-emerald-500/10 text-xs">
              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-base">🚘</span>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Brand / Make" : "Shirkadda"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.carMake || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-base">✨</span>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Model" : "Moodalka"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.carModel || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-base">📅</span>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Year" : "Sannadka"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.carYear || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-base">⚙️</span>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Transmission" : "Giriig"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.carTransmission || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-base">⛽</span>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Fuel Type" : "Nooca Shidaalka"}</span>
                  <span className="font-bold text-slate-900 dark:text-white">{property.carFuelType || "N/A"}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <span className="text-base">🛣️</span>
                <div className="text-left">
                  <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Mileage" : "Socodka (KM)"}</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{property.carMileage ? `${property.carMileage.toLocaleString()} KM` : "N/A"}</span>
                </div>
              </div>
            </div>
          )}

          {/* Status Specific (Rent vs Buy) Advanced Overview badges */}
          {(property.status === PropertyStatus.Rent || property.paymentInstallments) && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 text-xs">
              {property.status === PropertyStatus.Rent ? (
                <>
                  {property.rentalDeposit !== undefined && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-base">🔒</span>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Security deposit" : "Daba-gal / Deposit"}</span>
                        <span className="font-extrabold text-amber-600 dark:text-amber-400 font-mono">${property.rentalDeposit}</span>
                      </div>
                    </div>
                  )}
                  {property.includedUtilities && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-base">💡</span>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Included Utilities" : "Adeegyada ku jira Kirada"}</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">{property.includedUtilities}</span>
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                    <span className="text-base">💳</span>
                    <div>
                      <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Payment terms" : "Habraaca lacag bixinta"}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {property.paymentInstallments ? (language === "en" ? "Installments Accepted" : "Qayb-qayb / Installments") : (language === "en" ? "Cash buyout only" : "Caddaan oo buuxa")}
                      </span>
                    </div>
                  </div>
                  {property.paymentInstallments && property.downPaymentAmount !== undefined && (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                      <span className="text-base">🏁</span>
                      <div>
                        <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">{language === "en" ? "Required down payment" : "Lacagta hordhaca ah"}</span>
                        <span className="font-extrabold text-blue-605 dark:text-blue-400 font-mono">${property.downPaymentAmount}</span>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Property full narrative description & Easy Contact Panel */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-emerald-500/10 dark:border-emerald-500/15 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-200 dark:border-slate-800">
              <div>
                <h3 className="font-display font-extrabold text-base text-slate-950 dark:text-white">
                  {language === "en" ? "Property Description" : "Faahfaahinta Guriga"}
                </h3>
                <p className="text-[10px] text-slate-400 font-sans">{language === "en" ? "Read full specifications & structural details" : "Akhri oo dhuux dhamaan faahfaahinta dhismaha"}</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[8px] tracking-widest uppercase font-mono animate-pulse">
                {language === "en" ? "⚡ VETTED DIRECT BROKER" : "⚡ BROKER LA HUUBIYEY"}
              </span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {property.description}
            </p>

            {/* Direct Instant Contact Methods */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-900 space-y-4">
              <p className="font-sans font-bold text-[11px] text-slate-900 dark:text-white uppercase tracking-wider">
                {language === "en" ? "Instant Contact & Inquiry Channels" : "Kanaalada Xiriirka Degdegga ah"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Instant WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-[10px] sm:text-[11px] tracking-tight uppercase shadow-md hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer text-center"
                >
                  <MessageSquare className="h-3.5 w-3.5 flex-shrink-0" />
                  <span>{language === "en" ? "WhatsApp" : "Kala xiriir WhatsApp"}</span>
                </a>

                {/* Direct Phone Call / Hotline Shortcut */}
                <a
                  href={`tel:${property.ownerPhone}`}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-extrabold text-[10px] sm:text-[11px] tracking-tight uppercase shadow-sm transition-all duration-200 cursor-pointer text-center"
                >
                  <Phone className="h-3.5 w-3.5 text-emerald-400 flex-shrink-0" />
                  <span>{language === "en" ? `Call` : `Wac`} ({property.ownerPhone})</span>
                </a>
              </div>

              <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-2">
                <span className="flex items-center gap-1">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-500" /> {language === "en" ? "Broker Name:" : "Magaca Broker:"} <strong className="text-slate-700 dark:text-slate-300">{property.ownerName}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Specifications list */}
          <div className="space-y-4">
            <h3 className="font-display font-bold text-base text-slate-900 dark:text-white pb-2 border-b border-gray-100 dark:border-slate-800">
              {language === "en" ? "Overview Specifications" : "Sifooyinka Guud"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[11px] font-medium text-slate-700 dark:text-slate-300">
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-slate-400">{language === "en" ? "Unique Ref ID" : "Aqoonsiga Guri (ID)"}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{property.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-slate-400">{language === "en" ? "Category Type" : "Nooca Guriga"}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {language === "en" ? (
                    property.category === "House" || property.category === "Properties" ? "Properties" : property.category
                  ) : (
                    property.category === "Villa" || property.category === "Villas" ? "Fiilla" :
                    property.category === "Apartment" || property.category === "Apartments" ? "Aqal/Filaatiko" :
                    property.category === "House" || property.category === "Properties" ? "Guryaha" :
                    property.category === "Commercial" || property.category === "Commercial Buildings" ? "Ganacsi" : "Dhul/Boos"
                  )}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-slate-400">{language === "en" ? "Property Status" : "Heerka (Xaaladda)"}</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  {property.status === PropertyStatus.Sale
                    ? (language === "en" ? "For Sale" : "Iib")
                    : (language === "en" ? "For Rent" : "Kiro")}
                </span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-slate-400">{language === "en" ? "Registration Status" : "Mulkiyad (Diiwaanka)"}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 inline" /> {language === "en" ? "Fully Certified" : "Waa La Diiwaan-galiyey"}
                </span>
              </div>
            </div>
          </div>



        </div>

        {/* Right Section: Premium Broker Card, Pricing Details Panel, & Interactive Contact Inquiry Form */}
        <div id="premium-broker-sidebar" className="w-full lg:w-[420px] bg-slate-50 dark:bg-slate-950 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-850 p-5 sm:p-8 space-y-6 flex flex-col justify-between h-auto lg:h-[92vh] lg:overflow-y-auto">
          
          <div className="space-y-6 text-left">
            
            {/* Price display and favorites/share buttons */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-5 rounded-2xl shadow-sm text-center space-y-4">
              <div>
                <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                  {language === "en" ? "REPRESENTATIVE PRICE" : "QIIMAHA GURIGA"}
                </span>
                <span className="text-2xl font-extrabold text-slate-900 dark:text-emerald-400 font-mono tracking-tight block mt-1">
                  {formattedPrice}
                  {property.status === PropertyStatus.Rent ? (
                    <span className="text-xs font-semibold text-slate-400 lowercase">
                      {language === "en" ? " / month" : " / bishii"}
                    </span>
                  ) : (
                    <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-500 uppercase tracking-wider ml-1">
                      {language === "en" ? "Full Ownership" : "Teeda Iib"}
                    </span>
                  )}
                </span>
              </div>

              {property.status === PropertyStatus.Rent && (
                <div className="px-3 py-2 bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">
                    {language === "en" ? "AVAILABLE FROM" : "DIYAAR AH LAGA BILAABO"}
                  </span>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                    📅 {property.availableDate || (language === "en" ? "Immediate Booking" : "Hadda")}
                  </span>
                </div>
              )}



            </div>

            {/* Premium Broker Profile block */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-5 rounded-3xl shadow-sm space-y-4">
              
              <div className="flex justify-between items-center pb-3 border-b border-gray-100 dark:border-slate-800/85">
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-450 tracking-wider">
                    {language === "en" ? "EXCLUSIVE PARTNER" : "WAKIILKA MADAX-BANNAN"}
                  </span>
                  <h4 className="font-display font-extrabold text-[10px] sm:text-xs text-slate-700 dark:text-slate-350 uppercase tracking-widest mt-0.5">
                    {language === "en" ? "Authorized Broker" : "Broker Qorran"}
                  </h4>
                </div>
                <span className="px-2.5 py-1 rounded bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 text-[8px] font-black uppercase font-mono flex items-center gap-1 border border-yellow-505/20">
                  <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-600" /> 
                  <span>{language === "en" ? "VERIFIED" : "LA HUUBIYE"}</span>
                </span>
              </div>

              {/* Broker Profile details & Ratings */}
              <div className="flex items-start gap-3.5">
                <div className="h-14 w-14 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-white flex items-center justify-center font-display font-black text-xl shadow-md uppercase relative flex-shrink-0">
                  {property.ownerName.charAt(0)}
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900 flex items-center justify-center" title="Active on mobile">
                    <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping"></span>
                  </span>
                </div>
                <div className="space-y-1">
                  <h5 className="font-extrabold text-slate-950 dark:text-white text-xs sm:text-sm tracking-tight flex items-center gap-1.5">
                    {property.ownerName}
                  </h5>
                  
                  {/* Trust Badge and Rating */}
                  <div className="flex items-center gap-1 text-[10px] text-yellow-500">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500 stroke-0" />
                      ))}
                    </div>
                    <span className="font-bold text-slate-600 dark:text-slate-300 ml-1">4.9/5</span>
                    <span className="text-slate-400 text-[9px]">({language === "en" ? "48 Reviews" : "48 Qiimeyn"})</span>
                  </div>

                  <p className="text-[9px] text-slate-400 font-mono flex items-center gap-1">
                    🟢 {language === "en" ? "Response time: <15 mins" : "Jawaabta: <15 daqiiqo"}
                  </p>
                </div>
              </div>

              {/* Quick Spec Metrics of Broker */}
              <div className="grid grid-cols-2 gap-2 bg-slate-50 dark:bg-slate-950/40 p-2.5 rounded-2xl border border-slate-100 dark:border-slate-800 text-[10px] text-slate-500 font-medium">
                <div>
                  <span className="text-slate-450 block">{language === "en" ? "Brokerage Area" : "Heerka Deegaan"}</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">{language === "en" ? "Caabudwaaq Elite" : "Caabudwaaq & Agagaarka"}</span>
                </div>
                <div>
                  <span className="text-slate-450 block">{language === "en" ? "Active Listings" : "Guryaha Kireysan"}</span>
                  <span className="font-bold text-slate-705 dark:text-slate-300">{language === "en" ? "14 Properties" : "14 Dhismo"}</span>
                </div>
              </div>

              {/* Primary Direct CTAs */}
              <div className="space-y-2 pt-1">
                {/* Instant WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-555 dark:hover:bg-emerald-455 text-white font-extrabold text-[10px] sm:text-[11px] tracking-tight uppercase shadow-md hover:shadow-emerald-505/20 transition-all cursor-pointer"
                >
                  <MessageSquare className="h-3 w-3 fill-white/20 flex-shrink-0" />
                  <span>{language === "en" ? "WhatsApp" : "Kala xiriir WhatsApp"}</span>
                </a>

                {/* Direct Phone communication */}
                <a
                  href={`tel:${property.ownerPhone}`}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-extrabold text-[10px] sm:text-[11px] tracking-tight uppercase transition-all cursor-pointer border border-slate-700/30"
                >
                  <Phone className="h-3 w-3 text-emerald-400 flex-shrink-0" />
                  <span>{language === "en" ? `Call` : `Wac`} ({property.ownerPhone})</span>
                </a>
              </div>

            </div>

            {/* Direct Interactive In-App Inquiry Form */}
            <div className="bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-850 p-5 rounded-3xl shadow-sm space-y-4">
              <div className="border-b border-gray-100 dark:border-slate-800 pb-2">
                <h4 className="font-sans font-extrabold text-[11px] uppercase text-slate-805 dark:text-slate-200 tracking-wider flex items-center gap-2">
                  <Mail className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{language === "en" ? "Instant In-App Message" : "Fariin Toos Ah"}</span>
                </h4>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  {language === "en" ? "Skip calling. Send secure inquiry ticket directly to broker." : "Halkii aad ka wici lahayd, u dir warbixintaan durbadiiba wakiilka."}
                </p>
              </div>

              {isSubmitted ? (
                <div className="py-8 text-center space-y-3 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-2xl border border-emerald-500/20">
                  <div className="h-12 w-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto shadow-md">
                    <CheckCircle2 className="h-6 w-6 stroke-[3px]" />
                  </div>
                  <div className="space-y-1 px-4">
                    <h5 className="font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider">
                      {language === "en" ? "Inquiry Sent Successfully!" : "Fariintaada Waa La Diray!"}
                    </h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      {language === "en" 
                        ? `The broker ${property.ownerName} has been notified and will reach out to you within minutes.`
                        : `Wakiilka guriga ${property.ownerName} ayaa helay fariintaada, wuxuuna kula soo xiriiri doonaa dhowr daqiiqo gudahood.`}
                    </p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitInquiry} className="space-y-3.5 text-xs">
                  {/* Sender Name */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {language === "en" ? "Your Name" : "Magacaaga Buuxa"} <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={inquiryName}
                      onChange={(e) => setInquiryName(e.target.value)}
                      placeholder={language === "en" ? "e.g., Ahmed Ali" : "Tusaale: Ahmed Cali"}
                      className="w-full bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans font-medium text-xs"
                    />
                  </div>

                  {/* Sender Contacts row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                        {language === "en" ? "Phone Number" : "Taleefankaaga"} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={inquiryPhone}
                        onChange={(e) => setInquiryPhone(e.target.value)}
                        placeholder="e.g., +25261..."
                        className="w-full bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans font-medium text-xs"
                      />
                    </div>
                    <div className="space-y-1 text-left">
                      <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                        {language === "en" ? "Email Address" : "E-mail-kaaga"}
                      </label>
                      <input
                        type="email"
                        value={inquiryEmail}
                        onChange={(e) => setInquiryEmail(e.target.value)}
                        placeholder="optional@gmail.com"
                        className="w-full bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans font-medium text-xs"
                      />
                    </div>
                  </div>

                  {/* Inquiry details text-area */}
                  <div className="space-y-1 text-left">
                    <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {language === "en" ? "Inquiry Message Details" : "Qoraalka Fariinta"} <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={inquiryMsg}
                      onChange={(e) => setInquiryMsg(e.target.value)}
                      placeholder={language === "en" ? "Introduce yourself and describe your proposal details" : "U qor faahfaahinta aad ubaahan tahay..."}
                      className="w-full bg-slate-50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 py-2.5 px-3.5 rounded-xl border border-slate-200 dark:border-slate-808 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all font-sans font-medium text-xs resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs tracking-wider uppercase cursor-pointer transition-all shadow-md hover:shadow-emerald-500/10"
                  >
                    <Send className="h-3.5 w-3.5" />
                    <span>{language === "en" ? "Send Secure Inquiry" : "U Dir Fariinta Broker-ka"}</span>
                  </button>
                </form>
              )}

            </div>

          </div>

          {/* Quick Safety Notice Warning block */}
          <div className="flex gap-2.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-[10px] text-amber-700 dark:text-amber-400 mt-6 leading-relaxed">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5 text-amber-500" />
            <div className="space-y-0.5">
              <span className="font-bold uppercase tracking-wider block">
                🚨 {language === "en" ? "Warning Notice" : "Digniin Ammaan"}
              </span>
              <span>
                {language === "en" 
                  ? "Never pay electronic cash transfers or make deposits before physically inspecting the property with the verified broker."
                  : "Waligaa lacag ha u xawilin ama dalab lacageed ha dhigin ka hor inta aadan indhahaaga ku arkin guriga oo aadan la kulmin broker-ka."}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
