/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { Building2, Key, Star, Users, ArrowUpRight, TrendingUp } from "lucide-react";
import { Property, PropertyStatus } from "../types";
import { Language, translations } from "../localization";

interface StatsSectionProps {
  properties: Property[];
  registeredUsersCount: number;
  language?: Language;
}

export default function StatsSection({ properties, registeredUsersCount, language = "en" }: StatsSectionProps) {
  const totalCount = properties.length;
  const forRentCount = properties.filter(p => p.status === PropertyStatus.Rent).length;
  const forSaleCount = properties.filter(p => p.status === PropertyStatus.Sale).length;
  const dict = translations[language];

  const stats = [
    {
      id: "stat-total",
      label: language === "en" ? "Total Properties Listed" : "Dhammaan Guryaha Diiwaangashan",
      value: totalCount,
      icon: Building2,
      color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/40",
      change: language === "en" ? "+14% weekly" : "+14% usbuucii",
      desc: language === "en" ? "Verified local listings" : "Guryo rasmi ah oo la hubiyey"
    },
    {
      id: "stat-rent",
      label: language === "en" ? "Properties for Rent" : "Guryo Kiro ah",
      value: forRentCount,
      icon: Key,
      color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/40",
      change: language === "en" ? "Stable demand" : "Baahi joogto ah",
      desc: language === "en" ? "Apartments & duplexes" : "Guryo iyo qolal diyaarsan"
    },
    {
      id: "stat-sale",
      label: language === "en" ? "Properties for Sale" : "Guryaha Iibka ah",
      value: forSaleCount,
      icon: Star,
      color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/40",
      change: language === "en" ? "+5% last month" : "+5% bishii tagtay",
      desc: language === "en" ? "Premium houses & land" : "Guryo iyo Boosas dhul ah"
    },
    {
      id: "stat-users",
      label: language === "en" ? "Registered Local Brokers" : "Brokeriinta Sharciga ah",
      value: registeredUsersCount,
      icon: Users,
      color: "text-teal-600 bg-teal-50 dark:text-teal-400 dark:bg-teal-950/40",
      change: language === "en" ? "Active network" : "Wakiilo firfircoon",
      desc: language === "en" ? "Verified agent brokers" : "Wakiilo la hubiyey"
    }
  ];

  return (
    <section id="stats" className="py-16 bg-white dark:bg-slate-950 border-b border-gray-100 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Content */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-4">
          <div>
            <span className="text-[12px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest font-mono bg-emerald-500/10 dark:bg-emerald-400/10 px-3.5 py-1.5 rounded-full border border-emerald-500/20 shadow-sm">
              {language === "en" ? "Live Portal Activity" : "Xogta Rasmiga ah ee Suuqa"}
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl lg:text-6xl text-slate-950 dark:text-white mt-4 tracking-tighter">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-950 via-slate-800 to-emerald-600 dark:from-white dark:via-slate-200 dark:to-emerald-400">{dict.statsTitle}</span>
            </h2>
            <p className="text-sm sm:text-base text-slate-500 dark:text-slate-450 mt-3 max-w-xl font-medium leading-relaxed">
              {dict.statsSub}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 font-mono text-xs text-slate-500 dark:text-slate-400">
            <TrendingUp className="h-4 w-4 text-emerald-500" />
            <span>{language === "en" ? "Updated: Just Now" : "Cusboonaysiin: Hadda"}</span>
          </div>
        </div>

        {/* Highlight Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.id}
                id={item.id}
                className="relative overflow-hidden p-6 rounded-2xl bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 premium-shadow transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex justify-between items-start">
                  
                  {/* Icon Card component style */}
                  <div className={`p-3 rounded-xl ${item.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>

                  {/* Growth Rate tag */}
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50">
                    <ArrowUpRight className="h-3 w-3" />
                    <span>{item.change}</span>
                  </span>

                </div>

                {/* Statistic Value */}
                <div className="mt-5">
                  <span className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white font-mono tracking-tight leading-none">
                    {item.value}
                  </span>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mt-2">
                    {item.label}
                  </h3>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                    {item.desc}
                  </p>
                </div>

                {/* Decorative mesh effect */}
                <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-slate-100/10 to-transparent pointer-events-none" />

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
