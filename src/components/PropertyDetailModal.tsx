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
  AlertCircle 
} from "lucide-react";
import { Property, Inquiry, PropertyStatus } from "../types";
import { Language, translations } from "../localization";

interface PropertyDetailModalProps {
  property: Property;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onSendInquiry: (inquiry: Omit<Inquiry, "id" | "date">) => void;
  language?: Language;
}

export default function PropertyDetailModal({
  property,
  onClose,
  isFavorite,
  onToggleFavorite,
  onSendInquiry,
  language = "en"
}: PropertyDetailModalProps) {
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
        className="relative w-full max-w-6xl bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[92vh] transition-colors"
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
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-8 max-h-none lg:max-h-[92vh]">
          
          {/* Main Title Banner */}
          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 items-center text-xs">
              <span className="px-2.5 py-1 rounded bg-emerald-600 text-white font-bold uppercase tracking-wider text-[10px]">
                {property.status === PropertyStatus.Sale
                  ? (language === "en" ? "For Sale" : "Iib")
                  : (language === "en" ? "For Rent" : "Kiro")}
              </span>
              <span className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-850 text-slate-700 dark:text-slate-200 font-bold uppercase tracking-wider text-[10px]">
                {language === "en" ? property.category : (
                  property.category === "Villa" ? "Fiilla" :
                  property.category === "Apartment" ? "Aqal/Filaatiko" :
                  property.category === "HouseRent" ? "Kiro" :
                  property.category === "HouseSale" ? "Iib" :
                  property.category === "Commercial" ? "Ganacsi" : "Dhul/Boos"
                )}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white leading-tight">
              {property.title}
            </h1>
            <div className="flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400">
              <MapPin className="h-4 w-4 text-emerald-600" />
              <span>{property.location}</span>
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
            
            <div className="flex flex-col items-center justify-center py-2">
              <Bed className="h-5 w-5 text-emerald-600 mb-1" />
              <span className="text-xs text-slate-400 font-mono">{language === "en" ? "Bedrooms" : "Qolalka Jiifka"}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white mt-1">
                {property.bedrooms > 0 ? (language === "en" ? `${property.bedrooms} Beds` : `${property.bedrooms} Qol`) : "N/A"}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-2 border-l border-r border-gray-100 dark:border-slate-900">
              <Bath className="h-5 w-5 text-emerald-600 mb-1" />
              <span className="text-xs text-slate-400 font-mono">{language === "en" ? "Bathrooms" : "Musqulaha"}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white mt-1">
                {property.bathrooms > 0 ? (language === "en" ? `${property.bathrooms} Baths` : `${property.bathrooms} Musqul`) : "N/A"}
              </span>
            </div>

            <div className="flex flex-col items-center justify-center py-2">
              <Maximize2 className="h-5 w-5 text-emerald-600 mb-1" />
              <span className="text-xs text-slate-400 font-mono">{language === "en" ? "Area Size" : "Baaxadda"}</span>
              <span className="text-sm font-bold text-slate-800 dark:text-white mt-1">
                {property.areaSize} m²
              </span>
            </div>

          </div>

          {/* Property full narrative description & Easy Contact Panel */}
          <div className="p-6 md:p-8 rounded-3xl bg-slate-50 dark:bg-slate-950 border-2 border-emerald-500/10 dark:border-emerald-500/15 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pb-3 border-b border-gray-200 dark:border-slate-800">
              <div>
                <h3 className="font-display font-extrabold text-lg text-slate-950 dark:text-white">
                  {language === "en" ? "Property Description" : "Faahfaahinta Guriga"}
                </h3>
                <p className="text-[11px] text-slate-400 font-sans">{language === "en" ? "Read full specifications & structural details" : "Akhri oo dhuux dhamaan faahfaahinta dhismaha"}</p>
              </div>
              <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] tracking-widest uppercase font-mono animate-pulse">
                {language === "en" ? "⚡ VETTED DIRECT BROKER" : "⚡ BROKER LA HUUBIYEY"}
              </span>
            </div>
            
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans whitespace-pre-line">
              {property.description}
            </p>

            {/* Direct Instant Contact Methods */}
            <div className="pt-4 border-t border-gray-100 dark:border-slate-900 space-y-4">
              <p className="font-sans font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider">
                {language === "en" ? "Instant Contact & Inquiry Channels" : "Kanaalada Xiriirka Degdegga ah"}
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Instant WhatsApp */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs tracking-wider uppercase shadow-md hover:shadow-emerald-500/10 transition-all duration-200 cursor-pointer text-center"
                >
                  <MessageSquare className="h-4.5 w-4.5" />
                  <span>{language === "en" ? "Contact via WhatsApp" : "Kala xiriir WhatsApp"}</span>
                </a>

                {/* Direct Phone Call / Hotline Shortcut */}
                <a
                  href={`tel:${property.ownerPhone}`}
                  className="flex items-center justify-center gap-2.5 py-3.5 px-5 rounded-2xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-850 dark:hover:bg-slate-800 text-white font-bold text-xs tracking-wider uppercase shadow-sm transition-all duration-200 cursor-pointer text-center"
                >
                  <Phone className="h-4.5 w-4.5 text-emerald-400" />
                  <span>{language === "en" ? `Call ${property.ownerPhone}` : `Wac ${property.ownerPhone}`}</span>
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
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white pb-2 border-b border-gray-100 dark:border-slate-800">
              {language === "en" ? "Overview Specifications" : "Sifooyinka Guud"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-medium text-slate-700 dark:text-slate-300">
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-slate-400">{language === "en" ? "Unique Ref ID" : "Aqoonsiga Guri (ID)"}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">{property.id.toUpperCase()}</span>
              </div>
              <div className="flex justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-950">
                <span className="text-slate-400">{language === "en" ? "Category Type" : "Nooca Guriga"}</span>
                <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                  {language === "en" ? property.category : (
                    property.category === "Villa" ? "Fiilla" :
                    property.category === "Apartment" ? "Aqal/Filaatiko" :
                    property.category === "HouseRent" ? "Kiro" :
                    property.category === "HouseSale" ? "Iib" :
                    property.category === "Commercial" ? "Ganacsi" : "Dhul/Boos"
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

        {/* Right Section: Broker Card, Pricing Details Panel, Contact Forms */}
        <div className="w-full lg:w-[420px] bg-slate-50 dark:bg-slate-950 border-t lg:border-t-0 lg:border-l border-gray-100 dark:border-slate-850 p-6 sm:p-8 space-y-6 flex flex-col justify-between max-h-none lg:max-h-[92vh] overflow-y-auto">
          
          <div className="space-y-6">
            
            {/* Price display and favorites/share buttons */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm text-center">
              
              {property.status === PropertyStatus.Rent && (
                <div className="mb-4 px-3 py-2 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100/60 dark:border-emerald-950 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest block">{language === "en" ? "AVAILABLE FROM" : "DIYAAR AH LAGA BILAABO"}</span>
                  <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                    📅 {property.availableDate || (language === "en" ? "Available Now" : "Hadda")}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                {/* Save to favs */}
                <button
                  onClick={(e) => onToggleFavorite(property.id, e)}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
                  <span>{isFavorite ? (language === "en" ? "Saved" : "Kaydsan") : (language === "en" ? "Save List" : "Kaydi") }</span>
                </button>
                {/* Share property */}
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert(language === "en" ? "Property link copied to clipboard for direct sharing!" : "Link-ga guriga waa la koobiyey si aad ula wadaagto asxaabta!");
                  }}
                  className="flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-gray-200/60 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                >
                  <Share2 className="h-4 w-4" />
                  <span>{language === "en" ? "Share" : "Wadaag"}</span>
                </button>
              </div>

            </div>

            {/* Broker Agency Bio profile block */}
            <div className="bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-850 p-5 rounded-2xl shadow-sm space-y-4">
              
              <div className="flex justify-between items-center pb-2 border-b border-gray-100 dark:border-slate-800">
                <h4 className="font-display font-bold text-xs uppercase text-slate-400 tracking-wider">{language === "en" ? "Authorized Broker" : "Broker Saxda ah"}</h4>
                <span className="px-2 py-0.5 rounded text-[8px] font-bold font-mono bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 flex items-center gap-1">
                  <UserCheck className="h-2.5 w-2.5" /> {language === "en" ? "VERIFIED AGENT" : "AGENT LA HUUBIYE"}
                </span>
              </div>

              {/* Broker Profile detail */}
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center font-display font-bold text-emerald-700 dark:text-emerald-300 text-lg">
                  {property.ownerName.charAt(0)}
                </div>
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm">{property.ownerName}</h5>
                  <p className="text-[11px] text-slate-400">{language === "en" ? "Kireeye Partner" : "Bahwadaagta Kireeye"}</p>
                </div>
              </div>

              {/* Action Buttons for communication */}
              <div className="space-y-2 pt-2">
                
                {/* Direct WhatsApp CTA Button */}
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-bold text-xs tracking-wider uppercase shadow-md animate-pulse cursor-pointer"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>{language === "en" ? "Contact via WhatsApp" : "Kala xiriir WhatsApp"}</span>
                </a>

                {/* Direct Phone communication */}
                <div className="flex items-center justify-center gap-2 text-xs py-2 text-slate-600 dark:text-slate-300 font-mono">
                  <Phone className="h-3.5 w-3.5 text-slate-400" />
                  <span>{property.ownerPhone}</span>
                </div>

              </div>

            </div>

          </div>

          {/* Quick Notice */}
          <div className="flex gap-2 p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-[10px] text-amber-600 dark:text-amber-400 mt-6 leading-relaxed">
            <AlertCircle className="h-4.5 w-4.5 flex-shrink-0" />
            <span>
              {language === "en" 
                ? "Never pay cash transfers or make deposits before conducting a face-to-face inspection with verified brokers."
                : "Waligaa lacag ha u xawilin ama dalab ha dhigin ka hor inta aadan fool-ka-fool u arkin guriga oo aadan la kulmin broker-ka saxda ah."}
            </span>
          </div>

        </div>

      </div>
    </div>
  );
}
