/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Star, Quote } from "lucide-react";
import { Language } from "../localization";

interface TestimonialsProps {
  language?: Language;
}

export default function Testimonials({ language = "en" }: TestimonialsProps) {
  const testimonials = [
    {
      id: "test-1",
      name: "Ahmed Duale",
      role: language === "en" ? "Returning Diaspora Buyer (US)" : "Qurbajoog ka soo laabtay (US)",
      comment: language === "en" 
        ? "Kireeye completely changed how my family settled back home in Caabudwaaq! The neighborhood filtering for October was incredibly accurate, and contacting the property manager through WhatsApp was instant." 
        : "Kireeye gbi ahaanba wuxuu beddelay nidaamkii aan guryaha ku raadin jirnay aniga iyo qoyskaygu markaan Caabudwaaq ku soo laabannay! Xaafadaha October si sax ah ayaa loo kala sifeeyay, wada hadalka WhatsApp-kana wuxuu ahaa mid toos ah.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      id: "test-2",
      name: "Filsan Haji",
      role: language === "en" ? "Business Developer, Caabudwaaq" : "Ganacsade ka tirsan Caabudwaaq",
      comment: language === "en" 
        ? "Listing my commercial shops and depots on this hub gave me quality corporate leads in weeks! The dashboard allows me to manage properties effortlessly and see active inquiries instantly." 
        : "Ku soo bandhigista dukaamadayda iyo meelaha ganacsiga ee portal-kan waxay ii keentay macaamiil badan dhowr usbuuc gudahood! Dashboard-ku wuxuu ii sahlayaa inaan si fudud u maamulo guryahayga oo aan arko cid kasta oo fariin ii soo dirtay.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
      rating: 5
    },
    {
      id: "test-3",
      name: "Dr. Liban Abdi",
      role: language === "en" ? "Clinic Coordinator, Caabudwaaq" : "Isku-duwaha Caafimaadka, Caabudwaaq",
      comment: language === "en" 
        ? "I searched for secure development plots in 1 Luuliyo neighborhood for months with no luck. Then I found a certified listing with perfect boundary details on this hub. Within three hours I was in direct contact with the owner." 
        : "Muddo bilooyin ah ayaan Caabudwaaq ka raadinayey dhul rasmi ah oo la dhisayo xaafadda 1 Luuliyo laakiin ma helin. Intaa kadib waxaan helay xogta saxda ah ee ku dhex qoran madal-kan, saddex saacadood gudahood kaddib waxaan toos ula xiriiray milkiilihii.",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      rating: 5
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-850 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
            {language === "en" ? "Client Success Stories" : "Sheekooyinka Macaamiisheena"}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1.5 tracking-tight animate-fade-in">
            {language === "en" ? "Loved by Diaspora & Locals Alike" : "Waxaa Jecel Qurbajoogta & Dadka Deegaanka"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto font-sans">
            {language === "en"
              ? "See how returnees from Europe, America, and the Gulf regions secure premium verified real estate investments effortlessly."
              : "Eeg sida walaalaha ka soo laabtay Yurub, Ameerika, iyo wadamada Khaliijka u helaan maalgashi guryo la hubiyey oo ammaan ah."}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className="relative p-8 rounded-3xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 hover:shadow-xl hover:shadow-emerald-500/[0.02] transition-all duration-300 flex flex-col justify-between"
            >
              
              {/* Quote icon tag */}
              <Quote className="absolute top-6 right-8 h-8 w-8 text-emerald-500/10 dark:text-emerald-400/10" />

              <div className="space-y-4">
                
                {/* Rating score stars */}
                <div className="flex gap-1 text-amber-500">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < t.rating ? "fill-amber-500 text-amber-500" : "text-gray-300 dark:text-slate-700"}`}
                    />
                  ))}
                </div>

                {/* Narrative comment text */}
                <p className="font-sans text-sm text-slate-600 dark:text-slate-350 leading-relaxed italic">
                  "{t.comment}"
                </p>

              </div>

              {/* Customer Avatar & Bio details */}
              <div className="flex items-center gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-slate-800">
                <img
                  src={t.avatar}
                  alt={t.name}
                  className="h-11 w-11 rounded-full object-cover bg-slate-100 ring-2 ring-emerald-500/20"
                />
                <div className="text-left">
                  <h4 className="font-bold text-xs sm:text-sm text-slate-950 dark:text-white leading-none">{t.name}</h4>
                  <span className="text-[10px] uppercase font-semibold text-emerald-600 dark:text-emerald-400 mt-1 block pr-2">
                    {t.role}
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
