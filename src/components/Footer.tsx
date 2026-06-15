/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Facebook, Twitter, Instagram, Linkedin, ArrowUpRight, ShieldCheck, HelpCircle } from "lucide-react";

import { Language } from "../localization";
import LogoIcon from "./LogoIcon";

interface FooterProps {
  onNavigate: (tabId: string) => void;
  language?: Language;
}

export default function Footer({ onNavigate, language = "en" }: FooterProps) {
  const handleLogoClick = () => {
    onNavigate("home");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleLink = (id: string) => {
    if (id === "properties" || id === "contact") {
      onNavigate("home");
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 150);
    } else {
      onNavigate(id);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  };

  const currentYear = new Date().getFullYear();

  return (
    <footer id="footer-section" className="bg-slate-950 text-slate-300 transition-colors border-t border-slate-900">
      
      {/* Primary columns block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-8">
        
        {/* Brand column */}
        <div className="md:col-span-5 space-y-5">
          
          <div 
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="p-2 bg-emerald-600 dark:bg-emerald-500 rounded-lg text-white">
              <LogoIcon className="h-5 w-5" />
            </div>
            <span className="font-display font-bold text-lg sm:text-xl tracking-tight text-white">
              Kireeye<span className="text-emerald-500">Cw</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-400 font-sans leading-relaxed max-w-sm">
            {language === "en" 
              ? "KireeyeCw is a premium platform where you can find properties, rentals, and commercial/business shops in Caabudwaaq." 
              : "KireeyeCw waa madal aad ka heli karto guryaha, iyo dukaamada kirada iyo ganacsiga ah ee Caabudwaaq."}
          </p>

          {/* Social media connections */}
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-900 hover:border-emerald-500 hover:text-emerald-400 rounded-lg text-slate-500 transition-all">
              <Facebook className="h-4 w-4" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-900 hover:border-emerald-500 hover:text-emerald-400 rounded-lg text-slate-500 transition-all">
              <Twitter className="h-4 w-4" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-900 hover:border-emerald-500 hover:text-emerald-400 rounded-lg text-slate-500 transition-all">
              <Instagram className="h-4 w-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 border border-slate-900 hover:border-emerald-500 hover:text-emerald-400 rounded-lg text-slate-500 transition-all">
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

        </div>

        {/* Directory links column */}
        <div className="md:col-span-3 space-y-4">
          <h4 className="font-display font-bold text-xs uppercase tracking-widest text-emerald-500 font-mono">
            {language === "en" ? "Marketplace Guides" : "Hagaha Suuqa"}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => handleLink("home")} className="hover:text-white flex items-center gap-1 cursor-pointer text-left">
                <span>{language === "en" ? "Browse Home" : "Aad Bogga Hore"}</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleLink("properties")} className="hover:text-white flex items-center gap-1 cursor-pointer text-left">
                <span>{language === "en" ? "Vetted Properties" : "Tusaha Guryaha la Hubiyey"}</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleLink("stats")} className="hover:text-white flex items-center gap-1 cursor-pointer text-left">
                <span>{language === "en" ? "Portal StatisticsMatrix" : "Tirakoobka Guryaha"}</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleLink("faq")} className="hover:text-white flex items-center gap-1 cursor-pointer text-left">
                <span>{language === "en" ? "Frequently Asked Questions" : "Su'aalaha Badanaa la Is Weydiiyo"}</span>
              </button>
            </li>
            <li>
              <button onClick={() => handleLink("contact")} className="hover:text-white flex items-center gap-1 cursor-pointer text-left">
                <span>{language === "en" ? "Email & Office Coordinates" : "Email-ka & Xafiisyada"}</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Somali Regions Directory column */}
        <div className="md:col-span-4 space-y-4">
          <h4 className="font-display font-bold text-xs uppercase tracking-widest text-emerald-500 font-mono">
            {language === "en" ? "Caabudwaaq neighborhoods" : "Xaafadaha Caabudwaaq"}
          </h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button onClick={() => handleLink("properties")} className="text-left hover:text-white flex items-center gap-1 text-left">
              <span>Horseed</span>
            </button>
            <button onClick={() => handleLink("properties")} className="text-left hover:text-white flex items-center gap-1 text-left">
              <span>October</span>
            </button>
            <button onClick={() => handleLink("properties")} className="text-left hover:text-white flex items-center gap-1 text-left">
              <span>1 Luuliyo</span>
            </button>
            <button onClick={() => handleLink("properties")} className="text-left hover:text-white flex items-center gap-1 text-left">
              <span>Amaana</span>
            </button>
            <button onClick={() => handleLink("properties")} className="text-left hover:text-white flex items-center gap-1 text-left">
              <span>Waabari</span>
            </button>
            <button onClick={() => handleLink("properties")} className="text-left hover:text-white flex items-center gap-1 text-left">
              <span>Ubax</span>
            </button>
          </div>

          <div className="p-3 bg-white/5 border border-white/10 rounded-xl space-y-1 mt-4">
            <p className="text-[10px] uppercase font-bold text-emerald-500 font-mono flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" /> {language === "en" ? "100% VETTED DEEDS" : "100% MULKIYAD HUUBIYE"}
            </p>
            <p className="text-[10px] text-slate-400">
              {language === "en" 
                ? "All properties listed must prove certified title validation before approvals are granted." 
                : "Dhammaan guryaha la soo dhigo waa in la xaqiijiyo mulkiyadooda ka hor intaan la ansixinin."}
            </p>
          </div>
        </div>

      </div>

      {/* Under-footer copy row with disclaimer notes */}
      <div className="bg-slate-900 py-6 border-t border-slate-950/50 text-slate-500 text-[10px] sm:text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-center">
          <p>
            {language === "en" 
              ? `© ${currentYear} KireeyeCw. All rights reserved. Built with pride for returnees and local families.` 
              : `© ${currentYear} KireeyeCw. Xuquuqda oo dhan waa tiisa. Ka dhisay jacayl qurba-joogta iyo dadka deegaanka.`}
          </p>
          <div className="flex gap-4 font-mono">
            <a href="https://www.kireeyecw.com/privacy" className="hover:text-slate-400">
              {language === "en" ? "Privacy Protocols" : "Amniga & Xogta"}
            </a>
            <span>•</span>
            <a href="https://www.kireeyecw.com/terms" className="hover:text-slate-400">
              {language === "en" ? "Broker Terms" : "Shuruudaha Broker-ka"}
            </a>
          </div>
        </div>
      </div>

    </footer>
  );
}
