/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { X, Lock, Mail, User, Phone, Briefcase, Unlock, CheckCircle, ShieldAlert } from "lucide-react";
import { User as UserType } from "../types";
import { Language } from "../localization";

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (user: UserType) => void;
  initialTab?: "login" | "register";
  language?: Language;
  onToggleLanguage?: () => void;
}

export default function AuthModal({
  onClose,
  onLoginSuccess,
  initialTab = "login",
  language = "en",
  onToggleLanguage
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"login" | "register" | "forgot">(initialTab);
  const [loginType, setLoginType] = useState<"agent" | "admin">("agent");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"agent" | "buyer">("agent");
  const [adminKey, setAdminKey] = useState(""); // If they want to register as admin (needs passcode "somali123")
  const [showAdminField, setShowAdminField] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Default fallback demo brokers so users can instantly logs in
  const handleQuickLogin = (roleType: "agent" | "admin" | "buyer") => {
    let mockUser: UserType;
    if (roleType === "admin") {
      mockUser = {
        id: "admin-ibnu",
        name: "Ibnuburhan Guud",
        email: "Ibnuburhan555@gmail.com",
        role: "admin",
        phone: "+252615555555",
        createdAt: new Date().toISOString()
      };
    } else if (roleType === "agent") {
      mockUser = {
        id: "user-agent-1",
        name: "Abdirahman Warsame (Real Estate Lead)",
        email: "abdirahman@realestate.so",
        role: "agent",
        phone: "+252615123456",
        createdAt: new Date().toISOString()
      };
    } else {
      mockUser = {
        id: "buyer-demo",
        name: "Deqo Salad",
        email: "deqo@gmail.com",
        role: "buyer",
        phone: "+252634443322",
        createdAt: new Date().toISOString()
      };
    }
    
    // Save current user to localStorage
    localStorage.setItem("sre_current_user", JSON.stringify(mockUser));
    onLoginSuccess(mockUser);
    onClose();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    // Check custom registrations in localStorage
    const savedUsersRaw = localStorage.getItem("sre_registered_users");
    let savedUsers: UserType[] = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];

    // Filter out duplicates from stored array if any exist
    const seenIds = new Set<string>();
    const seenEmails = new Set<string>();
    let cleanedSavedUsers: UserType[] = [];
    savedUsers.forEach((u) => {
      const emailLower = u.email.toLowerCase().trim();
      if (u.id && !seenIds.has(u.id) && !seenEmails.has(emailLower)) {
        seenIds.add(u.id);
        seenEmails.add(emailLower);
        cleanedSavedUsers.push(u);
      }
    });
    savedUsers = cleanedSavedUsers;

    // Fallback seed list to ensure standard demo roles are always loggable
    const SEED_LIST: UserType[] = [
      {
        id: "admin-ibnu",
        name: "Ibnuburhan Guud",
        email: "Ibnuburhan555@gmail.com",
        role: "admin",
        phone: "+252615555555",
        password: "Maalinle555",
        createdAt: new Date("2026-06-08").toISOString()
      },
      {
        id: "user-agent-1",
        name: "Abdirahman Warsame (Real Estate Lead)",
        email: "abdirahman@realestate.so",
        username: "abdirahman",
        role: "agent",
        phone: "+252615123456",
        password: "somali123",
        createdAt: new Date("2026-03-15").toISOString()
      },
      {
        id: "user-agent-2",
        name: "Sarah Yusuf (Horn Property Group)",
        email: "sarah@realestate.so",
        username: "sarah",
        role: "agent",
        phone: "+252634987654",
        password: "somali123",
        createdAt: new Date("2026-04-20").toISOString()
      }
    ];

    if (savedUsers.length === 0) {
      savedUsers = SEED_LIST;
    } else {
      // Sync SEED_LIST elements into savedUsers to enforce their correct attributes
      let changed = false;
      SEED_LIST.forEach((seedUser) => {
        const foundIdx = savedUsers.findIndex(
          (u) => u.email.toLowerCase().trim() === seedUser.email.toLowerCase().trim() || u.id === seedUser.id
        );
        if (foundIdx === -1) {
          savedUsers.push(seedUser);
          changed = true;
        } else {
          const current = savedUsers[foundIdx];
          if (
            current.id !== seedUser.id ||
            current.password !== seedUser.password ||
            current.role !== seedUser.role ||
            current.username !== seedUser.username ||
            current.name !== seedUser.name
          ) {
            savedUsers[foundIdx] = {
              ...current,
              id: seedUser.id,
              name: seedUser.name,
              password: seedUser.password,
              role: seedUser.role,
              username: seedUser.username,
              phone: seedUser.phone || current.phone
            };
            changed = true;
          }
        }
      });
      if (changed) {
        localStorage.setItem("sre_registered_users", JSON.stringify(savedUsers));
      }
    }

    const matchedUser = savedUsers.find((u) => {
      const searchVal = email.toLowerCase().trim();
      if (loginType === "admin") {
        return u.email.toLowerCase() === searchVal;
      } else {
        return (u.username?.toLowerCase() === searchVal) || (u.email.toLowerCase() === searchVal);
      }
    });

    if (!matchedUser) {
      if (loginType === "admin") {
        setFeedback({
          type: "error",
          msg: `❌ MAAMULE AAN DIIWAAN-GASHNAYN: Email-ka (${email}) uma diiwaan-gashna sidii MAAMULE GUUD (System Admin). Fadlan la xiriir Agaasime Ibnuburhan Guud si laguu siiyo fasax.`
        });
      } else {
        setFeedback({
          type: "error",
          msg: `❌ USER AAN DIIWAAN-GASHNAYN: Username-ka ama User-ka aad gelisay ee (${email}) kama diiwaan-gashna nidaamkayaga. Fadlan kala xiriir maamulka sare username-kaaga saxda ah.`
        });
      }
      return;
    }

    // Role-specific enforcement based on chosen division
    if (loginType === "admin" && matchedUser.role !== "admin") {
      setFeedback({
        type: "error",
        msg: `❌ DIIDMO MAAMUL: Email-ka (${email}) wuu jiraa laakiin MA LAHA xuquuqda Maamulaha Sare (Admin). Fadlan u beddel qaybta "Broker / Agent" si aad u gasho.`
      });
      return;
    }

    if (loginType === "agent" && matchedUser.role !== "agent" && matchedUser.role !== "buyer") {
      setFeedback({
        type: "error",
        msg: `❌ DIIDMO WAKIIL: User-ka (${email}) kuma diiwaan-gashna asii wakiil ama broker daryeela nidaamka. Fadlan u beddel qaybta "Admin Guud" si aad u gasho.`
      });
      return;
    }

    // Verify password alignment check
    const expectedPassword = (matchedUser as any).password || "somali123";
    if (password !== expectedPassword) {
      setFeedback({
        type: "error",
        msg: `❌ FURID LA DIIDAY: Passcode-ka ama password-ka aad gelisay ee xisaabta ${email} ma saxna. Fadlan isku day mar kale!`
      });
      return;
    }

    // Login approval match!
    setFeedback({
      type: "success",
      msg: `Guul! Xaqiijintaada waa la saxay. Waxaa laguu wareejinayaa Dashboard-ka...`
    });

    setTimeout(() => {
      localStorage.setItem("sre_current_user", JSON.stringify(matchedUser));
      onLoginSuccess(matchedUser);
      onClose();
    }, 1200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name || !phone) return;

    const assignedRole = showAdminField && adminKey === "somali123" ? "admin" : role;

    const newRegister: UserType & { password?: string } = {
      id: "registered-" + Math.random().toString(36).substr(2, 9),
      name,
      email,
      role: assignedRole as "admin" | "agent" | "buyer",
      phone,
      password,
      createdAt: new Date().toISOString()
    };

    // Store in registered users array
    const savedUsersRaw = localStorage.getItem("sre_registered_users");
    const savedUsers = savedUsersRaw ? JSON.parse(savedUsersRaw) : [];
    savedUsers.push(newRegister);
    localStorage.setItem("sre_registered_users", JSON.stringify(savedUsers));

    // Sign in instantly
    localStorage.setItem("sre_current_user", JSON.stringify(newRegister));
    
    // Set feedback
    setFeedback({
      type: "success",
      msg: `Account registered successfully as a verified ${assignedRole}! Logging you in...`
    });

    setTimeout(() => {
      onLoginSuccess(newRegister);
      onClose();
    }, 2000);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setFeedback({
      type: "success",
      msg: `Excellent! Complete instructions to reset your passcode have been dispatched to "${email}".`
    });

    setTimeout(() => {
      setFeedback(null);
      setActiveTab("login");
    }, 4000);
  };

  return (
    <div 
      id="auth-modal-overlay" 
      className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all"
    >
      <div 
        id="auth-modal-card" 
        className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-gray-100 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden transition-colors"
      >
        
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Brand header */}
        <div className="text-center mb-6">
          <div className="inline-flex h-12 w-12 bg-emerald-100 dark:bg-emerald-950 rounded-2xl items-center justify-center text-emerald-600 dark:text-emerald-400 mb-2 font-display font-black">
            SRH
          </div>
          <h2 className="font-display font-bold text-xl text-slate-900 dark:text-white">
            {activeTab === "login" && (loginType === "agent" 
              ? "🏢 Broker & Agent Portal" 
              : "👑 General Admin Portal")}
            {activeTab === "register" && "Create Broker Account"}
            {activeTab === "forgot" && "Reset Passcode Authority"}
          </h2>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {activeTab === "login" && (loginType === "agent" 
              ? "Sign in to manage your rental and sale listings" 
              : "Administrative console to check land deeds and broker approvals")}
            {activeTab === "register" && "Verify your credentials to join our local broker grid"}
            {activeTab === "forgot" && "Recover your registered real estate credentials"}
          </p>
        </div>

        {/* Tab switchers if not in forgot page */}
        {activeTab !== "forgot" && (
          <div className="flex bg-slate-50 dark:bg-slate-950 border border-gray-100 dark:border-slate-850 p-1.5 rounded-xl mb-6">
            <button
              onClick={() => { setActiveTab("login"); setFeedback(null); }}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                activeTab === "login"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-white shadow-sm font-black"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              🔑 Log In
            </button>
            <button
              onClick={() => { setActiveTab("register"); setFeedback(null); }}
              className={`flex-1 py-2 text-xs font-black rounded-lg transition-all cursor-pointer ${
                activeTab === "register"
                  ? "bg-white dark:bg-slate-800 text-emerald-600 dark:text-white shadow-sm font-black"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              📝 Sign Up
            </button>
          </div>
        )}

        {/* Global Feedback Panel */}
        {feedback && (
          <div className={`p-4 rounded-xl text-xs flex gap-2 items-start mb-6 border ${
            feedback.type === "success" 
              ? "bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-900 dark:text-emerald-400"
              : "bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-950/20 dark:border-rose-900/40 dark:text-rose-400"
          }`}>
            {feedback.type === "success" ? (
              <CheckCircle className="h-4.5 w-4.5 flex-shrink-0 mt-0.5 text-emerald-600 dark:text-emerald-450" />
            ) : (
              <ShieldAlert className="h-4.5 w-4.5 flex-shrink-0 mt-0.5 text-rose-500 dark:text-rose-450" />
            )}
            <span>{feedback.msg}</span>
          </div>
        )}

        {/* Login Form Layout */}
        {activeTab === "login" && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            
            {/* Split Switcher inside Login Portal */}
            <div className="space-y-1.5 p-1 bg-slate-50 dark:bg-slate-950/80 border border-gray-100 dark:border-slate-850/80 rounded-2xl">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block text-center py-1">
                Portal Access Type
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setLoginType("agent");
                    setEmail("");
                    setPassword("");
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer border ${
                    loginType === "agent"
                      ? "bg-emerald-600 text-white border-emerald-500 shadow-md scale-[1.01]"
                      : "bg-white dark:bg-slate-900 text-slate-400 border-gray-150 dark:border-slate-805 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Briefcase className="h-4 w-4" />
                  <span className="text-[10px] font-extrabold uppercase">Broker / Agent</span>
                  <span className="text-[8px] opacity-80">Property Agent</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLoginType("admin");
                    setEmail("Ibnuburhan555@gmail.com");
                    setPassword("Maalinle555");
                  }}
                  className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-1 transition-all text-center cursor-pointer border ${
                    loginType === "admin"
                      ? "bg-rose-700 text-white border-rose-600 shadow-md scale-[1.01]"
                      : "bg-white dark:bg-slate-900 text-slate-400 border-gray-150 dark:border-slate-805 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Lock className="h-4 w-4" />
                  <span className="text-[10px] font-extrabold uppercase">Admin Portal</span>
                  <span className="text-[8px] opacity-80">System Admin</span>
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                {loginType === "admin" ? "Admin Email Address" : "Broker Username"}
              </label>
              <div className="relative">
                {loginType === "admin" ? (
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                ) : (
                  <User className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                )}
                <input
                  type={loginType === "admin" ? "email" : "text"}
                  placeholder={loginType === "admin" ? "ibnuburhan555@gmail.com" : "e.g. abdirahman"}
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 text-sm outline-none focus:border-emerald-500 font-sans font-medium"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Passcode (password)</label>
                <button
                  type="button"
                  onClick={() => setActiveTab("forgot")}
                  className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
                >
                  Forgot passcode?
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className={`w-full py-3 text-white font-black text-sm rounded-xl transition-all shadow-md cursor-pointer hover:scale-[1.01] uppercase tracking-wide ${
                loginType === "admin"
                  ? "bg-rose-700 hover:bg-rose-850 dark:bg-rose-650 dark:hover:bg-rose-550 shadow-rose-955/20"
                  : "bg-slate-900 hover:bg-slate-800 dark:bg-emerald-600 dark:hover:bg-emerald-500 shadow-emerald-500/10"
              }`}
            >
              {loginType === "admin" ? "🔓 Enter Admin Console" : "🏢 Enter Broker Portal"}
            </button>

          </form>
        )}

        {/* Register Form Layout */}
        {activeTab === "register" && (
          <div className="space-y-4 py-2 text-left">
            <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-slate-800 dark:text-amber-200 text-xs space-y-2.5">
              <div className="flex gap-2 items-center text-amber-600 dark:text-amber-400 font-extrabold text-[13px]">
                <ShieldAlert className="h-4.5 w-4.5 shrink-0 animate-bounce text-amber-500" />
                <span>Public Registration is Locked</span>
              </div>
              <p className="leading-relaxed">
                Due to quality assurance and land title verification (Title-Deeds Vetting), <strong>direct registration is not open to the public.</strong>
              </p>
              <p className="leading-relaxed font-mono text-[10px] text-slate-500 dark:text-slate-400">
                Brokers, agents, and housing managers are registered directly by the administration <strong>(Admin Console ONLY)</strong> to ensure absolute compliance.
              </p>
              <div className="pt-2 border-t border-amber-500/15 text-[11px] font-sans text-slate-600 dark:text-slate-300">
                📞 For more information or if you are a new broker, please contact the Administration Team (Ibnuburhan Guud).
              </div>
            </div>

            {/* Overriding Administrative Option */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850/80 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-400">Administrative Key Override</h4>
                <span className="text-[9px] bg-rose-500/10 text-rose-500 px-2 py-0.5 rounded-full font-bold">Admin Privileges</span>
              </div>
              
              <p className="text-[11px] text-slate-500 leading-relaxed">
                If you are an administrator wishing to register a new agent, please enter the override password (e.g. <code>somali123</code>):
              </p>

              <div className="space-y-3 animate-fade-in">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Enter administrator key (somali123)"
                    value={adminKey}
                    onChange={(e) => {
                      setAdminKey(e.target.value);
                      if (e.target.value === "somali123") {
                        setRole("agent");
                        setShowAdminField(true);
                      }
                    }}
                    className="w-full bg-white dark:bg-slate-900 pl-10 pr-4 py-2.5 rounded-xl border border-gray-150 dark:border-slate-800 text-xs outline-none focus:border-rose-500 font-mono text-center text-rose-500"
                  />
                </div>

                {/* Show form only if admin override key matches */}
                {adminKey === "somali123" ? (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-855 text-left animate-fade-in">
                    <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase rounded-lg text-center tracking-wider">
                      ✓ Access Approved: You can create a new account!
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Full Name</label>
                      <input
                        type="text"
                        placeholder="Ahmed Warsame"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                        <input
                          type="email"
                          placeholder="name@domain.so"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Phone</label>
                        <input
                          type="tel"
                          placeholder="+252615..."
                          required
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full bg-white dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Privilege Role</label>
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as "agent" | "buyer")}
                        className="w-full bg-white dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs cursor-pointer font-sans"
                      >
                        <option value="agent">Licensed Property Agent / Broker</option>
                        <option value="buyer">Individual Buyer / Home Searcher</option>
                        <option value="admin">System Administration</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Access Password</label>
                      <input
                        type="password"
                        placeholder="Set account password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-white dark:bg-slate-900 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-550 text-white font-black text-xs rounded-xl uppercase tracking-wider transition-all shadow cursor-pointer mt-2"
                    >
                      Create Account
                    </button>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab("login")}
                    className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all block text-center cursor-pointer uppercase tracking-wider"
                  >
                    Return to Log In
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Forgot Form Layout */}
        {activeTab === "forgot" && (
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <input
                  type="email"
                  placeholder="broker@domain.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 pl-10 pr-4 py-3 rounded-xl border border-gray-100 dark:border-slate-800 text-sm outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className="flex-1 py-3 border border-gray-200 hover:bg-slate-50 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350"
              >
                Go Back
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-555 text-white rounded-xl text-xs font-bold uppercase cursor-pointer"
              >
                Send Recovery Code
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}
