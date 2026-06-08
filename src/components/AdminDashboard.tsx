/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldAlert, 
  CheckCircle, 
  X, 
  Trash2, 
  Building2, 
  Users, 
  MessageSquare, 
  AlertTriangle,
  CheckCircle2,
  Plus,
  Edit,
  Search,
  Mail,
  Phone,
  UserPlus,
  AlertCircle,
  HelpCircle,
  Shield,
  Briefcase,
  UserCheck
} from "lucide-react";
import { Property, User as UserType, Inquiry } from "../types";
import { Language } from "../localization";

interface AdminDashboardProps {
  properties: Property[];
  onApproveProperty: (id: string) => void;
  onDeleteProperty: (id: string) => void;
  users: UserType[];
  onDeleteUser: (id: string, deleteProperties?: boolean) => void;
  onUpdateUser: (updatedUser: UserType) => void;
  onCreateUser: (newUser: UserType) => void;
  inquiries: Inquiry[];
  onDeleteInquiry: (id: string) => void;
  language?: Language;
}

export default function AdminDashboard({
  properties,
  onApproveProperty,
  onDeleteProperty,
  users,
  onDeleteUser,
  onUpdateUser,
  onCreateUser,
  inquiries,
  onDeleteInquiry,
  language = "en"
}: AdminDashboardProps) {
  const [adminTab, setAdminTab] = useState<"pending" | "properties" | "users" | "inquiries">("pending");
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Search filter states
  const [searchQueryUsers, setSearchQueryUsers] = useState("");
  const [searchQueryProperties, setSearchQueryProperties] = useState("");
  const [searchQueryInquiries, setSearchQueryInquiries] = useState("");

  // Create User states
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cUsername, setCUsername] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cRole, setCRole] = useState<"admin" | "agent" | "buyer">("agent");
  const [cPassword, setCPassword] = useState("somali123");

  // Edit User states
  const [editingUser, setEditingUser] = useState<UserType | null>(null);
  const [eName, setEName] = useState("");
  const [eEmail, setEEmail] = useState("");
  const [eUsername, setEUsername] = useState("");
  const [ePhone, setEPhone] = useState("");
  const [eRole, setERole] = useState<"admin" | "agent" | "buyer">("agent");
  const [ePassword, setEPassword] = useState("");

  // Custom Iframe-Safe Confirmation Modals states
  const [propertyToDelete, setPropertyToDelete] = useState<Property | null>(null);
  const [userToDelete, setUserToDelete] = useState<UserType | null>(null);
  const [deleteUserCascade, setDeleteUserCascade] = useState(false);
  const [inquiryToDelete, setInquiryToDelete] = useState<Inquiry | null>(null);

  const pendingProperties = properties.filter(p => !p.approved);
  const approvedProperties = properties.filter(p => p.approved);

  const stats = [
    { label: language === "en" ? "Pending Vettings" : "Hubinta Sugaya", value: pendingProperties.length, icon: AlertTriangle, color: "text-amber-500 bg-amber-50 dark:bg-amber-950/40", tab: "pending" as const },
    { label: language === "en" ? "Active Listings" : "Guryaha Idman (Live)", value: approvedProperties.length, icon: Building2, color: "text-emerald-500 bg-emerald-50 dark:bg-emerald-900/10", tab: "properties" as const },
    { label: language === "en" ? "Vetted Brokers" : "Wakiilada Diiwaangashan", value: users.length, icon: Users, color: "text-blue-500 bg-blue-50 dark:bg-blue-950/40", tab: "users" as const },
    { label: language === "en" ? "Contact Inquiries" : "Fariimaha Macmiilka", value: inquiries.length, icon: MessageSquare, color: "text-purple-500 bg-purple-50 dark:bg-purple-950/40", tab: "inquiries" as const }
  ];

  // Global success/error notification helper
  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 3500);
  };

  const triggerError = (msg: string) => {
    setErrorMsg(msg);
    setTimeout(() => setErrorMsg(""), 3500);
  };

  const triggerApprove = (id: string) => {
    onApproveProperty(id);
    triggerSuccess("Property approved and successfully synchronized with the public directories!");
  };

  // Property Deletion Handling
  const handleConfirmDeleteProperty = () => {
    if (propertyToDelete) {
      onDeleteProperty(propertyToDelete.id);
      setPropertyToDelete(null);
      triggerSuccess("Property listing permanently removed from the public portal registries.");
    }
  };

  // User Deletion (Broker Suspend) Handling
  const handleConfirmDeleteUser = () => {
    if (userToDelete) {
      onDeleteUser(userToDelete.id, deleteUserCascade);
      setUserToDelete(null);
      setDeleteUserCascade(false);
      triggerSuccess("Broker registry status successfully revoked from the centralized database.");
    }
  };

  // Inquiry Deletion Handling
  const handleConfirmDeleteInquiry = () => {
    if (inquiryToDelete) {
      onDeleteInquiry(inquiryToDelete.id);
      setInquiryToDelete(null);
      triggerSuccess("Contact inquiry ticket deleted from admin operations dashboard.");
    }
  };

  // Create User Action
  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cName.trim() || (!cUsername.trim() && !cEmail.trim())) {
      triggerError("Name and Username or Email are required fields!");
      return;
    }
    const usernameVal = cUsername.trim() ? cUsername.trim().toLowerCase() : cEmail.trim().split("@")[0].toLowerCase();
    const emailVal = cEmail.trim() ? cEmail.trim().toLowerCase() : `${usernameVal}@realestate.so`;

    const newUser: UserType = {
      id: "u-usr-" + Date.now(),
      name: cName.trim(),
      email: emailVal,
      username: usernameVal,
      phone: cPhone.trim() || "+252615000000",
      role: cRole,
      password: cPassword.trim() || "somali123",
      createdAt: new Date().toISOString()
    };
    onCreateUser(newUser);
    triggerSuccess(`Successfully registered ${newUser.name} (User: ${usernameVal}, Password: ${newUser.password}).`);
    
    // Reset fields
    setCName("");
    setCEmail("");
    setCUsername("");
    setCPhone("");
    setCRole("agent");
    setCPassword("somali123");
    setIsCreatingUser(false);
  };

  // Edit User Action
  const handleStartEditUser = (usr: UserType) => {
    setEditingUser(usr);
    setEName(usr.name);
    setEEmail(usr.email);
    setEUsername(usr.username || usr.email.split("@")[0]);
    setEPhone(usr.phone);
    setERole(usr.role);
    setEPassword(usr.password || "somali123");
  };

  const handleUpdateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    if (!eName.trim() || (!eUsername.trim() && !eEmail.trim())) {
      triggerError("Name and Username are strictly required fields!");
      return;
    }
    const usernameVal = eUsername.trim() ? eUsername.trim().toLowerCase() : eEmail.trim().split("@")[0].toLowerCase();
    const emailVal = eEmail.trim() ? eEmail.trim().toLowerCase() : `${usernameVal}@realestate.so`;

    const updatedUser: UserType = {
      ...editingUser,
      name: eName.trim(),
      email: emailVal,
      username: usernameVal,
      phone: ePhone.trim(),
      role: eRole,
      password: ePassword.trim() || "somali123"
    };

    onUpdateUser(updatedUser);
    triggerSuccess(`Registry updated for broker ${updatedUser.name}.`);
    setEditingUser(null);
  };

  // Search Filtering functions
  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQueryUsers.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQueryUsers.toLowerCase()) ||
    u.role.toLowerCase().includes(searchQueryUsers.toLowerCase())
  );

  const filteredApprovedProperties = approvedProperties.filter(p =>
    p.title.toLowerCase().includes(searchQueryProperties.toLowerCase()) ||
    p.region.toLowerCase().includes(searchQueryProperties.toLowerCase()) ||
    p.category.toLowerCase().includes(searchQueryProperties.toLowerCase()) ||
    p.ownerName.toLowerCase().includes(searchQueryProperties.toLowerCase())
  );

  const filteredInquiries = inquiries.filter(i =>
    i.name.toLowerCase().includes(searchQueryInquiries.toLowerCase()) ||
    i.propertyTitle.toLowerCase().includes(searchQueryInquiries.toLowerCase()) ||
    i.email.toLowerCase().includes(searchQueryInquiries.toLowerCase()) ||
    i.message.toLowerCase().includes(searchQueryInquiries.toLowerCase())
  );

  return (
    <div id="admin-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-gray-100 dark:border-slate-800 mb-8 gap-4">
        <div>
          <span className="text-[11px] font-bold text-red-500 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-full uppercase tracking-wider font-mono">
            System Administrator Operations
          </span>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-2.5 tracking-tight flex items-center gap-2">
            <ShieldAlert className="h-7 w-7 text-red-500 animate-pulse" /> Kireeye Control Panel
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Global directories management, broker registries, cascading suspensions, and database verification queues.
          </p>
        </div>

        {/* Global activity indicator */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 font-mono text-[10px] text-slate-400">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Active Central Console</span>
        </div>
      </div>

      {/* Admin stats widgets - Interactive Clicking */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {stats.map((st) => {
          const Icon = st.icon;
          const isActive = adminTab === st.tab;
          return (
            <button
              key={st.label} 
              onClick={() => setAdminTab(st.tab)}
              className={`p-5 bg-white dark:bg-slate-900 border text-center transition-all rounded-2xl shadow-sm min-w-full hover:scale-[1.02] cursor-pointer text-left focus:outline-none ${
                isActive 
                  ? "border-emerald-500 ring-1 ring-emerald-500/50 scale-[1.01]" 
                  : "border-gray-100 dark:border-slate-850"
              }`}
            >
              <div className={`p-2.5 rounded-xl inline-flex mb-3 ${st.color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white leading-none">{st.value}</p>
              <h4 className="text-xs font-semibold text-slate-400 mt-2 flex items-center justify-center gap-1">
                {st.label}
                {isActive && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 ml-1" />}
              </h4>
            </button>
          );
        })}
      </div>

      {/* Message alerts */}
      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs flex gap-2 items-center border border-emerald-100/50 mb-6 animate-fade-in font-bold">
          <CheckCircle className="h-5 w-5 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-xs flex gap-2 items-center border border-red-100/50 mb-6 animate-fade-in font-bold">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main console splits */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation block */}
        <div className="lg:col-span-1 space-y-2">
          <div className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 pb-1 font-mono">
            Command Center Map
          </div>
          
          <button
            onClick={() => setAdminTab("pending")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex justify-between items-center transition-all cursor-pointer ${
              adminTab === "pending"
                ? "bg-amber-600 text-white shadow-md shadow-amber-500/10"
                : "bg-white dark:bg-slate-905 text-slate-600 hover:bg-slate-50 border border-gray-100 dark:border-slate-850 dark:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              <span>Pending Vetting</span>
            </span>
            <span className="bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full">
              {pendingProperties.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab("properties")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex justify-between items-center transition-all cursor-pointer ${
              adminTab === "properties"
                ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-905 text-slate-600 hover:bg-slate-50 border border-gray-100 dark:border-slate-850 dark:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              <span>Approved Directory</span>
            </span>
            <span className="bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full">
              {approvedProperties.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab("users")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex justify-between items-center transition-all cursor-pointer ${
              adminTab === "users"
                ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-905 text-slate-600 hover:bg-slate-50 border border-gray-100 dark:border-slate-850 dark:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Broker Registries</span>
            </span>
            <span className="bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full">
              {users.length}
            </span>
          </button>

          <button
            onClick={() => setAdminTab("inquiries")}
            className={`w-full text-left py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold flex justify-between items-center transition-all cursor-pointer ${
              adminTab === "inquiries"
                ? "bg-slate-900 dark:bg-emerald-600 text-white shadow-md"
                : "bg-white dark:bg-slate-905 text-slate-600 hover:bg-slate-50 border border-gray-100 dark:border-slate-850 dark:text-slate-300"
            }`}
          >
            <span className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              <span>Inquiries Console</span>
            </span>
            <span className="bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-300 font-mono text-[10px] px-2 py-0.5 rounded-full">
              {inquiries.length}
            </span>
          </button>
        </div>

        {/* Content displays */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-905 border border-gray-100 dark:border-slate-850 p-6 sm:p-8 rounded-3xl min-h-[450px] shadow-sm relative">
          
          {/* TAB 1: PENDING VETTING LISTINGS */}
          {adminTab === "pending" && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100 dark:border-slate-850">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Municipal Vetting Queue</h3>
                <p className="text-xs text-slate-400 mt-1">Properties pending absolute title deed verification before published display.</p>
              </div>

              {pendingProperties.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic text-sm">
                  <CheckCircle2 className="h-10 w-10 text-emerald-500 mx-auto mb-3" />
                  All listed properties have been certified. Vetting queue is clean!
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="p-4 rounded-2xl bg-amber-500/5 border border-amber-200/30 dark:border-amber-950/20 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4"
                    >
                      <div className="flex gap-4 items-center">
                        <img src={prop.images[0]} className="h-12 w-16 object-cover rounded-lg bg-slate-100 dark:bg-slate-800" alt="Pending" />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{prop.title}</h4>
                          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold uppercase">{prop.category} in {prop.region}</span>
                          <p className="text-[10px] font-mono mt-0.5 text-slate-400">Author: {prop.ownerName} ({prop.ownerPhone})</p>
                        </div>
                      </div>

                      <div className="flex gap-2 w-full md:w-auto self-end md:self-auto">
                        <button
                          onClick={() => triggerApprove(prop.id)}
                          className="flex-1 md:flex-initial py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold uppercase tracking-wider cursor-pointer text-center whitespace-nowrap"
                        >
                          Approve Listing
                        </button>
                        <button
                          onClick={() => setPropertyToDelete(prop)}
                          className="flex-1 md:flex-initial py-1.5 px-3 bg-red-100 hover:bg-red-200 dark:bg-red-950/40 dark:text-red-400 text-red-700 rounded-lg text-xs font-bold cursor-pointer text-center"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: ACTIVE APPROVED PROPERTIES DIRECTORY */}
          {adminTab === "properties" && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Active Approved Portal Listings</h3>
                  <p className="text-xs text-slate-400 mt-1">Manage, audit, and remove active published properties.</p>
                </div>
                
                {/* Search Bar for properties */}
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search properties, regions..."
                    value={searchQueryProperties}
                    onChange={(e) => setSearchQueryProperties(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 py-2 pl-9 pr-4 text-xs rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200"
                  />
                  {searchQueryProperties && (
                    <button onClick={() => setSearchQueryProperties("")} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {filteredApprovedProperties.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic text-sm">
                  {searchQueryProperties ? "No listings matched your criteria." : "No approved properties live in the directory."}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredApprovedProperties.map((prop) => (
                    <div
                      key={prop.id}
                      className="flex gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <img src={prop.images[0]} className="h-12 w-16 object-cover rounded-lg bg-slate-100 shrink-0" alt="Active" />
                        <div className="min-w-0">
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1 truncate">{prop.title}</h4>
                          <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">{prop.region}</p>
                          <p className="text-[9px] text-slate-400 font-mono mt-0.5">${prop.price.toLocaleString()} • Owner: {prop.ownerName.split(" ")[0]}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => setPropertyToDelete(prop)}
                        className="p-1.5 bg-red-550/10 hover:bg-red-500 hover:text-white text-red-500 dark:bg-red-950/30 dark:hover:bg-red-900 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer"
                        title="Remove Listing"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: REGISTERED BROKER REGISTRY */}
          {adminTab === "users" && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Central Broker & Users Console</h3>
                  <p className="text-xs text-slate-400 mt-1">Authorize new agencies, amend credentials, or execute user suspension pipelines.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                  {/* Search Bar for Users */}
                  <div className="relative w-full sm:w-48">
                    <Search className="absolute left-3 top-2.5 h-3 w-3 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search brokers..."
                      value={searchQueryUsers}
                      onChange={(e) => setSearchQueryUsers(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 py-1.5 pl-8 pr-4 text-xs rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200"
                    />
                    {searchQueryUsers && (
                      <button onClick={() => setSearchQueryUsers("")} className="absolute right-3 top-2.5 text-slate-400">
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>

                  {/* Add Broker Switch Button */}
                  <button
                    onClick={() => {
                      setIsCreatingUser(!isCreatingUser);
                      setEditingUser(null);
                    }}
                    className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                  >
                    {isCreatingUser ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                    <span>{isCreatingUser ? "Cancel Add" : "New Broker"}</span>
                  </button>
                </div>
              </div>

              {/* In-Line Create User Form Component */}
              {isCreatingUser && (
                <form onSubmit={handleCreateUserSubmit} className="p-5 bg-emerald-50/20 border border-emerald-500/20 rounded-2xl space-y-3 animate-fade-in text-left">
                  <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 pb-2 border-b border-emerald-500/10">
                    <UserPlus className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Create Verified Broker Profile</span>
                  </div>                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Broker Full Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Nimco Jama"
                        value={cName}
                        onChange={(e) => setCName(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-emerald-600 dark:text-emerald-400">Username / User-ka 🔑</label>
                      <input
                        type="text"
                        placeholder="e.g. nimco"
                        value={cUsername}
                        onChange={(e) => setCUsername(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-emerald-300 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500 font-mono font-bold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email (Optional)</label>
                      <input
                        type="email"
                        placeholder="e.g. nimco@agency.so"
                        value={cEmail}
                        onChange={(e) => setCEmail(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Phone for WhatsApp</label>
                      <input
                        type="tel"
                        placeholder="e.g. +252615443322"
                        value={cPhone}
                        onChange={(e) => setCPhone(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Assigned Platform Role</label>
                      <select
                        value={cRole}
                        onChange={(e) => setCRole(e.target.value as "admin" | "agent" | "buyer")}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500"
                      >
                        <option value="agent">Broker / Agent</option>
                        <option value="buyer">Registered Buyer / Guest</option>
                        <option value="admin">System Administration</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password / Pasword-ka</label>
                      <input
                        type="text"
                        placeholder="Maalinle555"
                        value={cPassword}
                        onChange={(e) => setCPassword(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-emerald-500 font-mono font-bold text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsCreatingUser(false)}
                      className="py-1.5 px-3 hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-850 rounded-lg text-xs font-semibold"
                    >
                      Dismount Form
                    </button>
                    <button
                      type="submit"
                      className="py-1.5 px-4 bg-emerald-600 hover:bg-emerald-555 text-white rounded-lg text-xs font-bold"
                    >
                      Approve & Register Broker
                    </button>
                  </div>
                </form>
              )}

              {/* In-Line Edit User Form Component */}
              {editingUser && (
                <form onSubmit={handleUpdateUserSubmit} className="p-5 bg-blue-50/20 border border-blue-500/20 rounded-2xl space-y-3 animate-fade-in text-left">
                  <div className="flex items-center gap-2 text-blue-700 dark:text-blue-400 pb-2 border-b border-blue-500/10">
                    <Edit className="h-4.5 w-4.5" />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Modifying Details: {editingUser.name}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">FullName</label>
                      <input
                        type="text"
                        value={eName}
                        onChange={(e) => setEName(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 font-mono text-blue-600 dark:text-blue-400">Username / User-ka 🔑</label>
                      <input
                        type="text"
                        value={eUsername}
                        onChange={(e) => setEUsername(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-blue-300 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono font-bold"
                        required
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Email (Optional)</label>
                      <input
                        type="email"
                        value={eEmail}
                        onChange={(e) => setEEmail(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">WhatsApp / Hot Phone</label>
                      <input
                        type="tel"
                        value={ePhone}
                        onChange={(e) => setEPhone(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Portal Role Privilege</label>
                      <select
                        value={eRole}
                        onChange={(e) => setERole(e.target.value as "admin" | "agent" | "buyer")}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="agent">Broker / Agent</option>
                        <option value="buyer">Registered Buyer / Guest</option>
                        <option value="admin">System Administration</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Password / Pasword-ka</label>
                      <input
                        type="text"
                        value={ePassword}
                        onChange={(e) => setEPassword(e.target.value)}
                        className="p-2.5 bg-white dark:bg-slate-950 border border-gray-200 dark:border-slate-800 rounded-lg text-xs focus:outline-none focus:border-blue-500 font-mono font-bold text-slate-800 dark:text-slate-100"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="py-1.5 px-3 hover:bg-slate-100 text-slate-500 dark:hover:bg-slate-850 rounded-lg text-xs font-semibold"
                    >
                      Dismiss Editing
                    </button>
                    <button
                      type="submit"
                      className="py-1.5 px-4 bg-blue-600 hover:bg-blue-555 text-white rounded-lg text-xs font-bold"
                    >
                      Save Amendments
                    </button>
                  </div>
                </form>
              )}

              {/* Roster list */}
              {filteredUsers.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic text-sm">
                  No matching registered brokers found.
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredUsers.map((usr) => {
                    // Count how many properties listing this broker currently owns
                    const countOwnProperties = properties.filter(p => p.ownerId === usr.id).length;
                    
                    return (
                      <div
                        key={usr.id}
                        className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-850 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 hover:border-emerald-500/10 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 shrink-0 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold flex items-center justify-center text-sm font-display">
                            {usr.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                              {usr.name}
                              {usr.role === "admin" && <Shield className="h-3 w-3 text-rose-500 fill-rose-500/10" />}
                              {usr.role === "agent" && <Briefcase className="h-3 w-3 text-emerald-500" />}
                            </h4>
                            <p className="text-[10px] text-slate-400 flex flex-wrap items-center gap-1.5 mt-1">
                              <span className="bg-emerald-100 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-400 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                                👤 user: {usr.username || usr.email.split("@")[0]}
                              </span>
                              <span className="text-slate-200 dark:text-slate-800">•</span>
                              {usr.email && !usr.email.endsWith("@realestate.so") && (
                                <>
                                  <span className="flex items-center gap-0.5"><Mail className="h-2.5 w-2.5" /> {usr.email}</span>
                                  <span className="text-slate-200 dark:text-slate-800">•</span>
                                </>
                              )}
                              <span className="flex items-center gap-0.5"><Phone className="h-2.5 w-2.5" /> {usr.phone}</span>
                              <span className="text-slate-200 dark:text-slate-800">•</span>
                              <span className="bg-amber-100 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold">
                                🔑 password: {usr.password || "somali123"}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-0 pt-3 md:pt-0 border-slate-100 dark:border-slate-850">
                          <div className="text-left md:text-right">
                            <span className={`text-[8px] font-bold font-mono px-2 py-0.5 rounded uppercase tracking-wider ${
                              usr.role === "admin" ? "bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400" : (usr.role === "agent" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400")
                            }`}>
                              {usr.role}
                            </span>
                            <div className="text-[9px] text-slate-400 font-mono mt-1">
                              Properties listed: <span className="font-bold text-slate-700 dark:text-slate-300">{countOwnProperties}</span>
                            </div>
                          </div>

                          <div className="flex gap-1.5">
                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => handleStartEditUser(usr)}
                              className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg text-slate-500 dark:text-slate-300 cursor-pointer"
                              title="Edit Broker Details"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>

                            {/* Delete Button */}
                            {usr.id !== "admin-ibnu" && (
                              <button
                                type="button"
                                onClick={() => {
                                  setUserToDelete(usr);
                                  // Pre-check cascade delete if they have listings
                                  setDeleteUserCascade(countOwnProperties > 0);
                                }}
                                className="p-1.5 bg-red-105 hover:bg-red-500 hover:text-white text-red-650 dark:bg-red-950/30 dark:hover:bg-red-900 rounded-lg cursor-pointer transition-colors"
                                title="Suspend Broker Account"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            )}
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUBMITTED INQUIRIES CONSOLE */}
          {adminTab === "inquiries" && (
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100 dark:border-slate-850 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Customer Contact & Inquiries Console</h3>
                  <p className="text-xs text-slate-400 mt-1">Audit customer messages, inspect dispatch timelines, and dismiss expired lead requests.</p>
                </div>

                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search messages, names..."
                    value={searchQueryInquiries}
                    onChange={(e) => setSearchQueryInquiries(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 py-2 pl-9 pr-4 text-xs rounded-xl focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-200"
                  />
                  {searchQueryInquiries && (
                    <button onClick={() => setSearchQueryInquiries("")} className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600">
                      <X className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>

              {filteredInquiries.length === 0 ? (
                <div className="text-center py-20 text-slate-400 italic text-sm">
                  {searchQueryInquiries ? "No inquiries match your query filter." : "Central inquiry inbox is completely empty."}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800/80 text-left relative flex flex-col justify-between gap-3"
                    >
                      <button
                        onClick={() => setInquiryToDelete(inq)}
                        className="absolute right-4 top-4 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg cursor-pointer"
                        title="Dismiss Inquiry Ticket"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>

                      <div className="pr-8">
                        <span className="text-[9px] font-bold font-mono px-2 py-0.5 rounded bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-400 uppercase tracking-wider">
                          Ticket ID: {inq.id}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 dark:text-white mt-1.5 flex items-center gap-1 flex-wrap">
                          <span>{inq.name}</span>
                          <span className="text-slate-350 dark:text-slate-500 text-[10px] font-normal font-sans">({inq.email} • {inq.phone})</span>
                        </h4>
                        <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono mt-0.5">
                          Target Listing: <span className="font-bold font-sans text-slate-700 dark:text-slate-300">{inq.propertyTitle || "Unknown Asset"}</span>
                        </div>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-gray-100 dark:border-slate-850 text-xs italic text-slate-600 dark:text-slate-300 relative prose max-w-none">
                        "{inq.message}"
                      </div>

                      {inq.date && (
                        <div className="text-[9px] text-slate-400 text-right mt-1 font-mono">
                          Dispatched: {new Date(inq.date).toLocaleString()}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>

      </div>

      {/* ==================== CUSTOM MODAL OVERLAYS (IFRAME-SAFE DELETES) ==================== */}

      {/* Property Deletion Custom Confirmation Modal Overlay */}
      {propertyToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="h-12 w-12 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Delete Property Listing?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                You are about to permanently delete <strong>"{propertyToDelete.title}"</strong>. This will unpublish the catalog entry.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPropertyToDelete(null)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Cancel Keep
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteProperty}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Broker Deletion (Cascading Drop) Custom Confirmation Modal Overlay */}
      {userToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl max-w-md w-full text-left space-y-4 shadow-xl">
            <div className="flex items-center gap-2 pb-2 border-b border-gray-100 dark:border-slate-800">
              <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-950/40 text-red-600 dark:text-red-400 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display font-bold text-sm text-slate-900 dark:text-white">Suspend & Delete Broker Account</h3>
                <p className="text-[10px] text-slate-450">Decommissioning: {userToDelete.name}</p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-xs text-slate-500 dark:text-slate-350 leading-relaxed">
                You are deleting this broker registry. They will no longer be authorized to connect, submit, or manage listing requests on the Kireeye network.
              </p>

              {/* Conditional cascade controls */}
              {properties.filter(p => p.ownerId === userToDelete.id).length > 0 && (
                <div className="p-3 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-200/50 dark:border-rose-950/20 rounded-xl text-xs space-y-2">
                  <p className="font-semibold text-rose-700 dark:text-rose-400 flex items-center gap-1 font-mono text-[10px]">
                    <AlertTriangle className="h-3.5 w-3.5" /> List Contrib Alert!
                  </p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    This broker is listed as the primary title holder of <strong>{properties.filter(p => p.ownerId === userToDelete.id).length} active property catalog entries</strong>.
                  </p>
                  
                  <label className="flex items-center gap-2 mt-2 pt-2 border-t border-rose-200/40 dark:border-rose-950/10 select-none cursor-pointer">
                    <input
                      type="checkbox"
                      checked={deleteUserCascade}
                      onChange={(e) => setDeleteUserCascade(e.target.checked)}
                      className="rounded border-rose-300 dark:border-rose-900 text-red-600 focus:ring-red-550 h-3 w-3"
                    />
                    <span className="text-[11px] font-bold text-red-700 dark:text-red-400">
                      Cascade delete all {properties.filter(p => p.ownerId === userToDelete.id).length} properties listed by them
                    </span>
                  </label>
                  {!deleteUserCascade && (
                    <p className="text-[9px] text-slate-400 italic">
                      If unchecked, listings will be preserved in the public directory but marked as orphan assets.
                    </p>
                  )}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2 justify-end/stretch">
              <button
                type="button"
                onClick={() => {
                  setUserToDelete(null);
                  setDeleteUserCascade(false);
                }}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer text-center"
              >
                No, Keep Broker
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteUser}
                className="flex-1 py-2 px-3 bg-red-650 hover:bg-red-600 text-white rounded-xl text-xs font-bold cursor-pointer text-center"
              >
                Permanently Decommission
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inquiry Deletion Custom Confirmation Modal Overlay */}
      {inquiryToDelete && (
        <div className="fixed inset-0 bg-slate-950/60 dark:bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-3xl max-w-sm w-full text-center space-y-4 shadow-xl">
            <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center justify-center mx-auto">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Delete Inquiry Ticket?</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                This will discharge customer lead ticket <strong>{inquiryToDelete.id}</strong> submitted by {inquiryToDelete.name}.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
                className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Abort
              </button>
              <button
                type="button"
                onClick={handleConfirmDeleteInquiry}
                className="flex-1 py-2 px-3 bg-red-600 hover:bg-red-500 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Delete Ticket
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
