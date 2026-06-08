/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { SAMPLE_FAQS } from "../data";
import { Language } from "../localization";

interface FAQProps {
  language?: Language;
}

const FAQS_SO = [
  {
    id: "faq-1",
    question: "Sideen u xaqiijiyaa lahaanshaha rasmiga ah ama u diwaangaliyaa dhulalka Caabudwaaq?",
    answer: "Guryaha ku yaal Caabudwaaq, wareejinta waxaa laga diwaangeliyaa waaxda dhulka ee Dawladda Hoose ee Caabudwaaq, waxaana aqoonsada Maxkamadda Gobolka Galgaduud. Wakiilada ku jira madalkeenna waxay kaa caawinayaan dhammaystirka dhammaan dukumeentiyada lagama maarmaanka ah."
  },
  {
    id: "faq-2",
    question: "Ma jiraan fursado ku habboon qurbajoogta doonaya inay guryo ka iibsadaan dibadda?",
    answer: "Haa, inta badan guryaha ku jira Caabudwaaq waxaa loo dhisay si gaar ah loogu adeego qoysaska qurbajoogta ah ee ku soo laabanaya dalka. Waxaad wakiil ka dhigi kartaa ehelkaaga deegaanka ama waxaad ku xiriiri kartaa wakiilada WhatsApp si aad u hesho muuqaalo toos ah iyo khariidadaha saxda ah."
  },
  {
    id: "faq-3",
    question: "Waa maxay amniga xaafadaha guryaha ee Caabudwaaq?",
    answer: "Inta badan guryaha ku yaal xaafadaha caanka ah (sida Waabari, Amaana, ama October) waxay leeyihiin guryo deyr leh, nalalka cadceedda ee habeenkii shidma, dammaanad buuxda oo deegaanka ah, iyo ceelal biyood gaar ah."
  },
  {
    id: "faq-4",
    question: "Sidee bay u shaqeeyaan lacagaha kirada, mase loo baahan yahay deebaaji?",
    answer: "Sida caadiga ah, heshiisyada kirada ee Caabudwaaq waxaa loo qoraa 6 ilaa 12 bilood, iyadoo la bixinayo deebaaji dhan 1 ilaa 2 bilood. Lacagaha waxaa lagu bixiyaa nidaamka Hormuud EVC Plus ama xawilaad bangi."
  },
  {
    id: "faq-5",
    question: "Ma soo galin karaa gurigayga si bilaash ah?",
    answer: "Haa! Waxaad iska diwaangelin kartaa bogga adoo dooranaya Agent ama Milkiile. Wakiilada la diwaangeliyey waxay guryo galiyaan bilaash si toos ahna dusha kala socdaan fariimaha. Maamulka Kireeye ayaa hubiya dhammaan guryaha cusub ka hor intaan la soo bandhigin."
  }
];

export default function FAQ({ language = "en" }: FAQProps) {
  const [expandedId, setExpandedId] = useState<string | null>("faq-1");

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const activeFaqs = language === "en" ? SAMPLE_FAQS : FAQS_SO;

  return (
    <section id="faq" className="py-24 bg-slate-50 dark:bg-slate-900/40 border-b border-gray-100 dark:border-slate-850 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        
        {/* Header Block */}
        <div className="text-center mb-16">
          <h2 className="font-display font-bold text-3xl text-slate-900 dark:text-white mt-1.5 tracking-tight flex items-center justify-center gap-2">
            <HelpCircle className="h-7 w-7 text-emerald-500" /> {language === "en" ? "Frequently Asked Questions" : "Su'aalaha Badanaa la Is Weydiiyo"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xl mx-auto">
            {language === "en"
              ? "Everything you need to know about purchasing, renting, and listing property on Kireeye."
              : "Wax kasta oo aad u baahan tahay inaad ka ogaato iibsashada, kiraynta, iyo ku soo daabicidda hantidaada Kireeye."}
          </p>
        </div>

        {/* Accordion List Container */}
        <div className="space-y-4">
          {activeFaqs.map((faq) => {
            const isExpanded = expandedId === faq.id;
            return (
              <div
                key={faq.id}
                id={faq.id}
                className="rounded-2xl border transition-all duration-300 overflow-hidden bg-white dark:bg-slate-900 border-gray-100 dark:border-slate-800"
              >
                
                {/* Accordion header button */}
                <button
                  onClick={() => toggleExpand(faq.id)}
                  className="w-full flex justify-between items-center p-5 text-left font-semibold text-slate-900 dark:text-white cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/20 text-sm sm:text-base"
                >
                  <span className="pr-4">{faq.question}</span>
                  {isExpanded ? (
                    <ChevronUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {/* Accordion body panel */}
                {isExpanded && (
                  <div className="p-5 pt-0 text-xs sm:text-sm text-slate-500 dark:text-slate-400 border-t border-gray-50 dark:border-slate-850 leading-relaxed font-sans bg-slate-50/50 dark:bg-slate-950/20">
                    <p className="pt-3">{faq.answer}</p>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
