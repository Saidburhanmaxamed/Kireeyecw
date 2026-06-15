/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2, Globe, Clock } from "lucide-react";
import { Language } from "../localization";

interface ContactPageProps {
  language?: Language;
}

export default function ContactPage({ language = "en" }: ContactPageProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;

    // Simulate sending contact email
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setEmail("");
      setPhone("");
      setSubject("");
      setMessage("");
    }, 4000);
  };

  const offices = [
    {
      city: language === "en" ? "Caabudwaaq Headquarters" : "Xarunta Dhexe ee Caabudwaaq",
      address: language === "en" ? "Waddada October, Caabudwaaq, Somalia" : "Waddada October, Caabudwaaq, Soomaaliya",
      phone: "+252 61 826 9053",
      hours: language === "en" ? "Saturday - Thursday: 8:00 AM - 5:00 PM" : "Sabti - Khamiis: 8:00 Subaxnimo - 5:00 Galabnimo"
    },
    {
      city: language === "en" ? "Caabudwaaq Branch Office" : "Laanta Labaad ee Caabudwaaq",
      address: language === "en" ? "Waddada Amaana, Caabudwaaq, Somalia" : "Waddada Amaana, Caabudwaaq, Soomaaliya",
      phone: "+252 61 691 9670",
      hours: language === "en" ? "Saturday - Thursday: 8:00 AM - 5:00 PM" : "Sabti - Khamiis: 8:00 Subaxnimo - 5:00 Galabnimo"
    }
  ];

  return (
    <section id="contact" className="py-10 bg-white dark:bg-slate-950 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest font-mono">
            {language === "en" ? "Get In Touch" : "Nala Soo Xiriir"}
          </span>
          <h2 className="font-display font-bold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-1.5 tracking-tight">
            {language === "en" ? "We'd Love to Hear From You" : "Waa Diyaar in aan ku Caawino"}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto font-sans">
            {language === "en" 
              ? "Contact our specialized broker networks directly for customized property inspection sheets."
              : "La xiriir wakiiladeenna rasmiga ah si aad u hesho waraaqaha kormeerka guryaha ee aad doonayso."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Panel: Contact information boards */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick hotlines board */}
            <div className="bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl space-y-6">
              
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                {language === "en" ? "Contact Directory" : "Tusaha Xiriirka"}
              </h3>

              <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{language === "en" ? "General Support Email" : "Isku-duwaha Guud ee Email-ka"}</p>
                    <p className="font-mono mt-0.5 font-semibold">Kireeyecw@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{language === "en" ? "Director Eng Burhaani" : "Agaasime Eng Burhaani"}</p>
                    <p className="font-mono mt-0.5 font-semibold">+252 61 826 9053</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-[#10b981] dark:text-emerald-450 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{language === "en" ? "Manager Saido Axmed Farah" : "Maamule Saido Axmed Farah"}</p>
                    <p className="font-mono mt-0.5 font-semibold">+252 61 691 9670</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Globe className="h-5 w-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{language === "en" ? "Our Portal URL" : "Mareegta Internetka"}</p>
                    <p className="font-mono mt-0.5 font-semibold">Www.kireeyecw.com</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Geographical Office locations boards */}
            <div className="space-y-4 text-left">
              <h4 className="font-display font-bold text-sm uppercase tracking-wider text-slate-400 pr-2">{language === "en" ? "Head Office Locations" : "Goobta Xafiiskeena Guud"}</h4>
              <div className="grid grid-cols-1 gap-4">
                {offices.map((off) => (
                  <div
                    key={off.city}
                    className="p-5 border border-gray-100 dark:border-slate-850 bg-white dark:bg-slate-900/60 rounded-2xl space-y-2"
                  >
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                      <MapPin className="h-4.5 w-4.5 text-emerald-600" /> {off.city}
                    </h5>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{off.address}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-1 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 inline text-slate-450" /> {off.hours}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Panel: Active email submission form */}
          <div className="lg:col-span-7 bg-slate-50 dark:bg-slate-900 border-2 border-gray-100 dark:border-slate-800 p-6 sm:p-8 rounded-3xl">
            
            <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white pb-3 border-b border-gray-100 dark:border-slate-800 mb-6 text-left">
              {language === "en" ? "Write Us an Instant Message" : "Noogu Qor Fariin Halkan"}
            </h3>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-center space-y-3 max-w-md mx-auto border border-emerald-100/50">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400 mx-auto" />
                <h4 className="font-bold text-sm">{language === "en" ? "Message Sent Successfully!" : "Fariinta waa la diray!"}</h4>
                <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed font-sans">
                  {language === "en" 
                    ? "We have catalogued your query. One of our local coordinators in Caabudwaaq will answer your query in under three hours."
                    : "Waa la kaydiyey fariintaada. Mid ka mid ah wakiiladeenna Caabudwaaq ayaa kugula soo xiriiri doona muddo ka yar saddex saacadood."}
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-left text-xs text-slate-700 dark:text-slate-300">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">{language === "en" ? "Your Name" : "Magacaaga"}</label>
                    <input
                      type="text"
                      placeholder={language === "en" ? "e.g. Deqo Salad" : "tusaale. Deeqo Salaad"}
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-3 rounded-xl border border-gray-200/60 dark:border-slate-850 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">{language === "en" ? "Email Address" : "Email-kaaga"}</label>
                    <input
                      type="email"
                      placeholder="e.g. deqo@gmail.com"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-3 rounded-xl border border-gray-200/60 dark:border-slate-850 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">{language === "en" ? "Contact Number (Optional)" : "Taleefankaaga (Ikhiyaari)"}</label>
                    <input
                      type="tel"
                      placeholder="e.g. +252 61 555 4444"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-3 rounded-xl border border-gray-200/60 dark:border-slate-850 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">{language === "en" ? "Subject Topic" : "Aqoonta Mawduuca"}</label>
                    <input
                      type="text"
                      placeholder={language === "en" ? "e.g. Inspect Land Plots" : "tusaale. Boosaska Dhulka"}
                      required
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-3 rounded-xl border border-gray-200/60 dark:border-slate-850 text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wider block mb-1">{language === "en" ? "Message Narrative Details" : "Faahfaahinta Fariinta"}</label>
                  <textarea
                    rows={4}
                    placeholder={language === "en" 
                      ? "We'd love to assist you. Detail your desired size, budget range, and timeline parameters."
                      : "Fadlan qor faahfaahinta dhismaha ama dhulka aad rabto, miisaaniyadaada (budget), iyo waqtiga aad u baahantahay."}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 p-4 rounded-xl border border-gray-200/60 dark:border-slate-850 resize-none font-sans text-xs text-slate-900 dark:text-white outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
                >
                  <Send className="h-4 w-4" />
                  <span>{language === "en" ? "Send Secure Message" : "Dir Fariintaada"}</span>
                </button>

              </form>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}
