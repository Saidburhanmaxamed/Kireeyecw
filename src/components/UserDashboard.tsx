/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Plus, 
  Trash2, 
  Edit, 
  MessageSquare, 
  Heart, 
  User, 
  Bell, 
  Home, 
  DollarSign, 
  MapPin, 
  Maximize, 
  ChevronRight, 
  AlertCircle, 
  Upload, 
  CheckCircle,
  Phone,
  Bed,
  Bath,
  Mail,
  Award,
  Star,
  Search,
  Filter,
  ArrowLeft
} from "lucide-react";
import { Property, User as UserType, Inquiry, AppNotification, PropertyStatus, PropertyCategory, Testimonial } from "../types";
import { SOMALI_REGIONS } from "../data";
import { Language, translations } from "../localization";

interface UserDashboardProps {
  currentUser: UserType;
  properties: Property[];
  onAddProperty: (prop: Omit<Property, "id" | "ownerId" | "ownerName" | "ownerPhone" | "ownerWhatsapp" | "approved" | "createdAt">) => void;
  onUpdateProperty: (id: string, prop: Partial<Property>) => void;
  onDeleteProperty: (id: string) => void;
  inquiries: Inquiry[];
  notifications: AppNotification[];
  favorites: Property[];
  onRemoveFavorite: (id: string, e: React.MouseEvent) => void;
  onUpdateCurrentUser?: (user: UserType) => void;
  onAddTestimonial?: (testimonial: Omit<Testimonial, "id">) => void;
  language?: Language;
}

// Pre-defined elegant villa pictures so creating properties looks gorgeous instantly
const PRESET_MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
];

export default function UserDashboard({
  currentUser,
  properties,
  onAddProperty,
  onUpdateProperty,
  onDeleteProperty,
  inquiries,
  notifications,
  favorites,
  onRemoveFavorite,
  onUpdateCurrentUser,
  onAddTestimonial,
  language = "en"
}: UserDashboardProps) {
  const [activeTab, setActiveTab] = useState<"listings" | "add-form" | "inquiries" | "favorites" | "profile">("listings");
  const [editingId, setEditingId] = useState<string | null>(null);

  const getCategoryLabel = (cat: string) => {
    if (!cat) return language === "en" ? "All" : "Dhammaan";
    if (language === "en") {
      if (cat === "House" || cat === "Properties") return "Properties";
      if (cat === "LandSale" || cat === "Land for Sale") return "Land for Sale";
      if (cat === "Apartment" || cat === "Apartments") return "Apartments";
      if (cat === "Commercial" || cat === "Commercial Buildings") return "Commercial Buildings";
      if (cat === "Villa" || cat === "Villas") return "Villas";
      if (cat === "CarSale" || cat === "Cars for Sale") return "Cars for Sale";
      return cat;
    }
    const cats: Record<string, string> = {
      "Villa": "Fillooyinka 🏰",
      "Apartment": "Aqalka/Filaatiko 🏢",
      "House": "Guryaha 🏠",
      "Commercial": "Meelaha Ganacsiga 🛍️",
      "Land": "Dhulka/Boosaska 🗺️",
      "LandSale": "Dhulka/Boosaska 🗺️",
      "Villas": "Fillooyinka 🏰",
      "Apartments": "Aqalka/Filaatiko 🏢",
      "Properties": "Guryaha 🏠",
      "Commercial Buildings": "Meelaha Ganacsiga 🛍️",
      "Land for Sale": "Dhulka/Boosaska 🗺️",
      "CarSale": "Gaadiidka / Cars 🚗",
      "Cars for Sale": "Gaadiidka / Cars 🚗"
    };
    return cats[cat] || cat;
  };

  // Profile forms states for broker customization
  const [profName, setProfName] = useState(currentUser.name);
  const [profEmail, setProfEmail] = useState(currentUser.email);
  const [profPhone, setProfPhone] = useState(currentUser.phone);

  // Sync profile editing fields when currentUser changes
  React.useEffect(() => {
    setProfName(currentUser.name);
    setProfEmail(currentUser.email);
    setProfPhone(currentUser.phone);
  }, [currentUser]);

  // Scroll to top of dashboard when active tab changes
  React.useEffect(() => {
    const el = document.getElementById("user-dashboard-root");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [activeTab]);

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profName || !profEmail || !profPhone) return;
    if (onUpdateCurrentUser) {
      onUpdateCurrentUser({
        ...currentUser,
        name: profName,
        email: profEmail,
        phone: profPhone
      });
      setSuccessFeedback(language === "en" ? "Broker profile details updated successfully!" : "Macluumaadkaaga Broker-ka waa la cusbooneysiiyey!");
      setTimeout(() => setSuccessFeedback(""), 3000);
    }
  };

  // Advanced dashboard listing dashboard search and filter controllers
  const [dashSearch, setDashSearch] = useState("");
  const [dashStatus, setDashStatus] = useState<string>("All"); // "All", "Rent", "Sale"
  const [dashCategory, setDashCategory] = useState<string>("All"); // "All", "Villa", "Apartment", "Commercial", "Land"

  // Form states matching a complete listing posting form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<PropertyCategory>(PropertyCategory.Villa);
  const [price, setPrice] = useState("");
  const [location, setLocation] = useState("");
  const [region, setRegion] = useState("October");
  const [status, setStatus] = useState<PropertyStatus>(PropertyStatus.Sale);
  const [bedrooms, setBedrooms] = useState("3");
  const [bathrooms, setBathrooms] = useState("2");
  const [areaSize, setAreaSize] = useState("200");
  const [formImages, setFormImages] = useState<string[]>([PRESET_MOCK_IMAGES[0], "", "", "", ""]);
  const [formImageIndex, setFormImageIndex] = useState<number>(0);
  const [successFeedback, setSuccessFeedback] = useState("");
  const [availableDate, setAvailableDate] = useState("");

  // Category specific fields
  const [dimensions, setDimensions] = useState("");
  const [hasTitleDeed, setHasTitleDeed] = useState(false);
  const [zoning, setZoning] = useState("Residential");
  const [numShops, setNumShops] = useState("");
  const [hasParking, setHasParking] = useState(false);

  // Car specific fields
  const [carMake, setCarMake] = useState("");
  const [carModel, setCarModel] = useState("");
  const [carYear, setCarYear] = useState("");
  const [carTransmission, setCarTransmission] = useState("Automatic");
  const [carFuelType, setCarFuelType] = useState("Petrol");
  const [carMileage, setCarMileage] = useState("");

  // Status specific (Rent vs Buy) fields
  const [rentalDeposit, setRentalDeposit] = useState("");
  const [rentalPeriod, setRentalPeriod] = useState("Monthly");
  const [includedUtilities, setIncludedUtilities] = useState("");
  const [paymentInstallments, setPaymentInstallments] = useState(false);
  const [downPaymentAmount, setDownPaymentAmount] = useState("");

  // Drag & drop state for property form upload
  const [propDragActive, setPropDragActive] = useState(false);
  const [propFileUploadName, setPropFileUploadName] = useState("");

  // Testimonial Form States
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testRating, setTestRating] = useState(5);
  const [testComment, setTestComment] = useState("");
  const [testImage, setTestImage] = useState("");
  const [testDragActive, setTestDragActive] = useState(false);
  const [testFileUploadName, setTestFileUploadName] = useState("");

  // User Profile Avatar Drag & Drop States
  const [avatarDragActive, setAvatarDragActive] = useState(false);

  // Property image file processor
  const handlePropDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setPropDragActive(true);
    } else if (e.type === "dragleave") {
      setPropDragActive(false);
    }
  };

  const handlePropDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPropDragActive(false);
    if (e.dataTransfer.files) {
      const files = Array.from(e.dataTransfer.files) as File[];
      files.forEach((file: File) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              const dataUrl = event.target.result as string;
              setFormImages(prev => {
                const copy = [...prev];
                const emptyIdx = copy.findIndex(img => img === "" || img === PRESET_MOCK_IMAGES[0]);
                if (emptyIdx !== -1) {
                  copy[emptyIdx] = dataUrl;
                } else {
                  copy[0] = dataUrl;
                }
                return copy;
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  const handlePropFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files) as File[];
      files.forEach((file: File) => {
        if (file.type.startsWith("image/")) {
          const reader = new FileReader();
          reader.onload = (event) => {
            if (event.target?.result) {
              const dataUrl = event.target.result as string;
              setFormImages(prev => {
                const copy = [...prev];
                const emptyIdx = copy.findIndex(img => img === "" || img === PRESET_MOCK_IMAGES[0]);
                if (emptyIdx !== -1) {
                  copy[emptyIdx] = dataUrl;
                } else {
                  copy[0] = dataUrl;
                }
                return copy;
              });
            }
          };
          reader.readAsDataURL(file);
        }
      });
    }
  };

  // Avatar profile image file processor
  const handleAvatarFileSelect = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && onUpdateCurrentUser) {
          onUpdateCurrentUser({
            ...currentUser,
            avatar: event.target.result as string
          });
          setSuccessFeedback("Your broker profile photo was updated successfully!");
          setTimeout(() => setSuccessFeedback(""), 3000);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setAvatarDragActive(true);
    } else if (e.type === "dragleave") {
      setAvatarDragActive(false);
    }
  };

  const handleAvatarDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAvatarDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleAvatarFileSelect(e.dataTransfer.files[0]);
    }
  };

  // Testimonial customer image file processor
  const handleTestDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setTestDragActive(true);
    } else if (e.type === "dragleave") {
      setTestDragActive(false);
    }
  };

  const handleTestDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTestDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setTestImage(event.target.result as string);
            setTestFileUploadName(file.name);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleTestFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (event) => {
          if (event.target?.result) {
            setTestImage(event.target.result as string);
            setTestFileUploadName(file.name);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleTestimonialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || !testRole || !testComment) return;

    if (onAddTestimonial) {
      onAddTestimonial({
        name: testName,
        role: testRole,
        comment: testComment,
        avatar: testImage || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
        rating: testRating
      });
      setSuccessFeedback(`Review from customer ${testName} has been catalogued & saved!`);
      
      // reset testimonial form
      setTimeout(() => {
        setSuccessFeedback("");
        setTestName("");
        setTestRole("");
        setTestRating(5);
        setTestComment("");
        setTestImage("");
        setTestFileUploadName("");
        setActiveTab("listings");
      }, 2000);
    }
  };

  // Filter listings owned by the logged-in user
  const userListings = properties.filter(
    (p) => p.ownerId === currentUser.id || p.ownerName.includes(currentUser.name.split(" ")[0])
  );

  // Filter inquiries related to properties owned by logged-in user
  const listingsIds = userListings.map(l => l.id);
  const userInquiries = inquiries.filter(
    (inq) => listingsIds.includes(inq.propertyId) || currentUser.role === "admin"
  );

  // Fill form for editing
  const handleEditTrigger = (prop: Property) => {
    setEditingId(prop.id);
    setTitle(prop.title);
    setDescription(prop.description);
    setCategory(prop.category as PropertyCategory);
    setPrice(prop.price.toString());
    setLocation(prop.location);
    setRegion(prop.region);
    setStatus(prop.status);
    setBedrooms(prop.bedrooms.toString());
    setBathrooms(prop.bathrooms.toString());
    setAreaSize(prop.areaSize.toString());
    
    // Prefill category specific fields
    setDimensions(prop.dimensions || "");
    setHasTitleDeed(!!prop.hasTitleDeed);
    setZoning(prop.zoning || "Residential");
    setNumShops(prop.numShops ? prop.numShops.toString() : "");
    setHasParking(!!prop.hasParking);

    // Prefill car specific fields
    setCarMake(prop.carMake || "");
    setCarModel(prop.carModel || "");
    setCarYear(prop.carYear ? prop.carYear.toString() : "");
    setCarTransmission(prop.carTransmission || "Automatic");
    setCarFuelType(prop.carFuelType || "Petrol");
    setCarMileage(prop.carMileage ? prop.carMileage.toString() : "");

    // Prefill status (Rent vs Buy) specific fields
    setRentalDeposit(prop.rentalDeposit ? prop.rentalDeposit.toString() : "");
    setRentalPeriod(prop.rentalPeriod || "Monthly");
    setIncludedUtilities(prop.includedUtilities || "");
    setPaymentInstallments(!!prop.paymentInstallments);
    setDownPaymentAmount(prop.downPaymentAmount ? prop.downPaymentAmount.toString() : "");
    
    // Set 5 images list
    const updatedImages = ["", "", "", "", ""];
    if (prop.images && prop.images.length > 0) {
      prop.images.forEach((img, idx) => {
        if (idx < 5) updatedImages[idx] = img;
      });
    } else {
      updatedImages[0] = PRESET_MOCK_IMAGES[0];
    }
    setFormImages(updatedImages);
    setFormImageIndex(0);
    setPropFileUploadName("");
    setAvailableDate(prop.availableDate || "");
    setActiveTab("add-form");
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !price || !location) return;

    // Filter empty image entries
    let chosenImages = formImages.filter(img => img.trim() !== "");

    // Fallback to make sure there's at least one image
    if (chosenImages.length === 0) {
      chosenImages = [PRESET_MOCK_IMAGES[0]];
    }

    const propertyPayload = {
      title,
      description,
      category,
      type: category === PropertyCategory.LandSale ? "Land" : (category === PropertyCategory.Commercial ? "Commercial" : (category === PropertyCategory.CarSale ? "Vehicle" : "Residential")),
      price: parseFloat(price),
      location,
      region,
      status,
      bedrooms: (category === PropertyCategory.LandSale || category === PropertyCategory.CarSale) ? 0 : (parseInt(bedrooms) || 0),
      bathrooms: (category === PropertyCategory.LandSale || category === PropertyCategory.CarSale) ? 0 : (parseInt(bathrooms) || 0),
      areaSize: category === PropertyCategory.CarSale ? 0 : (parseFloat(areaSize) || 100),
      images: chosenImages,
      featured: false,
      availableDate: availableDate ? availableDate : null,
      // Custom category specific attributes
      dimensions: category === PropertyCategory.LandSale ? dimensions : undefined,
      hasTitleDeed: category === PropertyCategory.LandSale ? hasTitleDeed : undefined,
      zoning: category === PropertyCategory.LandSale ? zoning : undefined,
      numShops: category === PropertyCategory.Commercial ? (parseInt(numShops) || 0) : undefined,
      hasParking: category === PropertyCategory.Commercial ? hasParking : undefined,
      carMake: category === PropertyCategory.CarSale ? carMake : undefined,
      carModel: category === PropertyCategory.CarSale ? carModel : undefined,
      carYear: category === PropertyCategory.CarSale ? (parseInt(carYear) || undefined) : undefined,
      carTransmission: category === PropertyCategory.CarSale ? carTransmission : undefined,
      carFuelType: category === PropertyCategory.CarSale ? carFuelType : undefined,
      carMileage: category === PropertyCategory.CarSale ? (parseInt(carMileage) || undefined) : undefined,
      // Custom status specific attributes
      rentalDeposit: status === PropertyStatus.Rent ? (parseFloat(rentalDeposit) || undefined) : undefined,
      rentalPeriod: status === PropertyStatus.Rent ? rentalPeriod : undefined,
      includedUtilities: status === PropertyStatus.Rent ? includedUtilities : undefined,
      paymentInstallments: status === PropertyStatus.Sale ? paymentInstallments : undefined,
      downPaymentAmount: (status === PropertyStatus.Sale && paymentInstallments) ? (parseFloat(downPaymentAmount) || undefined) : undefined
    };

    if (editingId) {
      onUpdateProperty(editingId, propertyPayload);
      setSuccessFeedback("Property listing updated successfully! Waiting for municipal check.");
    } else {
      onAddProperty(propertyPayload);
      setSuccessFeedback("New property added successfully and uploaded! Approved by default for agents.");
    }

    // Reset Form
    setTimeout(() => {
      setSuccessFeedback("");
      setEditingId(null);
      setTitle("");
      setDescription("");
      setPrice("");
      setLocation("");
      setAvailableDate("");
      setDimensions("");
      setHasTitleDeed(false);
      setZoning("Residential");
      setNumShops("");
      setHasParking(false);
      setCarMake("");
      setCarModel("");
      setCarYear("");
      setCarTransmission("Automatic");
      setCarFuelType("Petrol");
      setCarMileage("");
      setRentalDeposit("");
      setRentalPeriod("Monthly");
      setIncludedUtilities("");
      setPaymentInstallments(false);
      setDownPaymentAmount("");
      setFormImages([PRESET_MOCK_IMAGES[0], "", "", "", ""]);
      setFormImageIndex(0);
      setPropFileUploadName("");
      setActiveTab("listings");
    }, 2000);
  };

  const menuItems = [
    { id: "listings", label: language === "en" ? "My Listings" : "Guryahayga", count: userListings.length, icon: Building2 },
    { id: "add-form", label: editingId ? (language === "en" ? "Edit Property" : "Bedel Guriga") : (language === "en" ? "Add New Property" : "Guri Cusub Geli"), icon: Plus },
    { id: "inquiries", label: language === "en" ? "Buyer Inquiries" : "Fariimaha Macmiilka", count: userInquiries.length, icon: MessageSquare },
    { id: "favorites", label: language === "en" ? "My Favorites" : "Kuwa aan Jeclahay", count: favorites.length, icon: Heart },
    { id: "profile", label: language === "en" ? "Broker Profile" : "Macluumaadka Broker-ka", icon: User }
  ];

  return (
    <div id="user-dashboard-root" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 transition-colors">
      
      {/* Hello Board Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-gradient-to-r from-[#012a18] via-[#023e25] to-[#014026] text-white p-6 sm:p-8 rounded-3xl mb-8 shadow-xl border border-emerald-800/35 gap-4">
        <div className="flex items-center gap-4">
          <div 
            onDragEnter={handleAvatarDrag}
            onDragOver={handleAvatarDrag}
            onDragLeave={handleAvatarDrag}
            onDrop={handleAvatarDrop}
            className={`relative h-16 w-16 rounded-2xl flex items-center justify-center transition-all ${
              avatarDragActive 
                ? "bg-emerald-950 border-2 border-dashed border-emerald-400 scale-105" 
                : "bg-emerald-500/20 border border-emerald-500/30"
            } overflow-hidden group select-none`}
            title="Drag avatar image here, or hover & click upload"
          >
            {currentUser.avatar ? (
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-full h-full object-cover animate-fade-in" 
              />
            ) : (
              <span className="font-display font-extrabold text-2xl text-emerald-450">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            )}
            
            {/* Click to upload overlay trigger */}
            <label className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center cursor-pointer transition-opacity duration-200 text-[8px] font-mono tracking-wider font-bold text-emerald-400">
              <Upload className="h-4 w-4 text-emerald-400 mb-0.5" />
              <span>EDIT PHOTO</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                     handleAvatarFileSelect(e.target.files[0]);
                  }
                }} 
                className="hidden" 
              />
            </label>
          </div>
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl tracking-tight flex items-center gap-2">
              {language === "en" ? "Welcome back," : "Soo dhawaada mar kale,"} {currentUser.name}
            </h1>
            <p className="text-xs text-emerald-350 mt-1 uppercase font-mono tracking-widest font-bold">
              {currentUser.role === "admin" 
                ? (language === "en" ? "Administrator" : "Maamulaha Guud") 
                : (language === "en" ? "Agency / Broker Account • Verified" : "Wakiilka Sharciga ah • La Hubiyey")}
            </p>
          </div>
        </div>

        {/* Dynamic status card */}
        <div className="bg-emerald-950/50 border border-emerald-800/40 px-5 py-3 rounded-2xl flex gap-6 text-center text-xs shadow-inner">
          <div>
            <p className="text-emerald-200/80 font-medium">{language === "en" ? "My Listings" : "Guryahayga"}</p>
            <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{userListings.length}</p>
          </div>
          <div className="border-l border-emerald-800/40" />
          <div>
            <p className="text-emerald-200/80 font-medium">{language === "en" ? "Inquiries" : "Fariimaha"}</p>
            <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{userInquiries.length}</p>
          </div>
          <div className="border-l border-emerald-800/40" />
          <div>
            <p className="text-emerald-200/80 font-medium">{language === "en" ? "Favorites" : "La Jecelyahay"}</p>
            <p className="text-lg font-bold font-mono text-emerald-400 mt-0.5">{favorites.length}</p>
          </div>
        </div>

      </div>

      {/* Grid containing Lateral Menu Tabs & Main Content Block */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar Panel */}
        {activeTab !== "add-form" && (
          <div className="lg:col-span-1 space-y-2 animate-fade-in">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as any);
                    if (item.id !== "add-form") setEditingId(null);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
                    active 
                      ? "bg-gradient-to-r from-[#012a18] to-[#014026] text-white shadow-lg border border-emerald-850 shadow-emerald-950/20" 
                      : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-350 hover:bg-emerald-50/45 dark:hover:bg-slate-800/60 border border-gray-100 dark:border-slate-850"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <Icon className={`h-4.5 w-4.5 ${active ? "text-white" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </span>
                  {item.count !== undefined && (
                    <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                      active ? "bg-white/20 text-white" : "bg-slate-100 dark:bg-slate-950 text-slate-500 dark:text-slate-400"
                    }`}>
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* Main interactive Tab content Body */}
        <div className={`${activeTab === "add-form" ? "lg:col-span-4" : "lg:col-span-3"} bg-white dark:bg-slate-905 border-2 border-gray-100 dark:border-slate-850 p-6 sm:p-8 rounded-3xl min-h-[500px] shadow-sm transition-all duration-300`}>
          
          {/* Feedback overlay */}
          {successFeedback && (
            <div className="mb-6 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-xs flex gap-2 items-center border border-emerald-100/50 animate-fade-in font-semibold">
              <CheckCircle className="h-5 w-5" />
              <span>{successFeedback}</span>
            </div>
          )}

          {/* TAB 1: LIST ACTIVE PROPERTY FOR SALE/RENT */}
          {activeTab === "listings" && (() => {
            // Apply real-time broker-side filter controls
            const filteredListings = userListings.filter((prop) => {
              const matchedSearch = 
                prop.title.toLowerCase().includes(dashSearch.toLowerCase()) || 
                prop.location.toLowerCase().includes(dashSearch.toLowerCase()) || 
                prop.region.toLowerCase().includes(dashSearch.toLowerCase());
              
              const matchedStatus = dashStatus === "All" || prop.status === dashStatus;
              
              const matchedCategory = 
                dashCategory === "All" || 
                prop.category.toLowerCase() === dashCategory.toLowerCase();
              
              return matchedSearch && matchedStatus && matchedCategory;
            });

            // Calculate mini stats for broker
            const totalValue = userListings.reduce((sum, p) => sum + p.price, 0);
            const liveCount = userListings.filter(p => p.approved !== false).length;

            return (
              <div className="space-y-6">
                
                {/* Dashboard Control Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-5 border-b border-gray-100 dark:border-slate-800 gap-4">
                  <div>
                    <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                      {language === "en" ? "Properties Dashboard Controller" : "Maamulaha Guud ee Guryahaaga"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      {language === "en"
                        ? "Manage, track, and filter your real estate listings from this command center"
                        : "Halkan ka maamul, kala shaandhee, oo ka tirtir guryaha aad soo gelisay platform-ka"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2.5 text-xs">
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setActiveTab("add-form");
                      }}
                      className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3.5 py-1.5 rounded-xl cursor-pointer shadow-md shadow-emerald-900/10 transition-all hover:scale-[1.01] active:scale-95 text-xs"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{language === "en" ? "Add Property" : "Guri Cusub Geli"}</span>
                    </button>
                    <span className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 px-3 py-1.5 rounded-xl font-bold font-mono">
                      {language === "en" ? "Live:" : "Kuwa Idman:"} {liveCount}
                    </span>
                    <span className="bg-slate-100 dark:bg-slate-850 text-slate-600 dark:text-slate-350 px-3 py-1.5 rounded-xl font-bold font-mono">
                      {language === "en" ? "Worth:" : "Qiimaha Guud:"} ${totalValue.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* ADVANCED FILTER CONTROL COMPONENT */}
                <div className="bg-slate-50 dark:bg-slate-900/60 border border-gray-100 dark:border-slate-800 p-4 rounded-2xl space-y-4">
                  
                  {/* Row 1: Search & Categories */}
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                    
                    {/* Search Field */}
                    <div className="md:col-span-7 relative">
                      <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder={language === "en" ? "Search your properties (Title, location, region...)" : "Raadi guryahaaga (Magaca, xaafadda, jidka...)"}
                        value={dashSearch}
                        onChange={(e) => setDashSearch(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 pl-10 pr-4 py-2.5 rounded-xl border border-gray-100 dark:border-slate-805 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100"
                      />
                      {dashSearch && (
                        <button 
                          onClick={() => setDashSearch("")}
                          className="absolute right-3 top-3 text-[10px] bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 px-1.5 py-0.5 rounded text-slate-500 font-extrabold"
                        >
                          {language === "en" ? "Clear" : "Tir"}
                        </button>
                      )}
                    </div>

                    {/* Category Filter Dropdown */}
                    <div className="md:col-span-5 relative">
                      <select
                        value={dashCategory}
                        onChange={(e) => setDashCategory(e.target.value)}
                        className="w-full h-full min-h-[40px] appearance-none bg-white dark:bg-slate-950 pl-3.5 pr-8 py-2 rounded-xl border border-gray-100 dark:border-slate-805 text-xs outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-200 font-sans cursor-pointer"
                      >
                        <option value="All">{language === "en" ? "All Categories" : "Dhamaan Noocyada"}</option>
                        <option value="Villa">{language === "en" ? "Villa" : "Villa / Sar"}</option>
                        <option value="Apartment">{language === "en" ? "Apartment" : "Apartment / Guryaha Dabaqa"}</option>
                        <option value="Commercial">{language === "en" ? "Commercial" : "Commercial / Ganacsi"}</option>
                        <option value="Land">{language === "en" ? "Land" : "Dhul / Boos"}</option>
                      </select>
                      <div className="absolute right-3.5 top-2.5 pointer-events-none text-slate-400">
                        <Filter className="h-3.5 w-3.5" />
                      </div>
                    </div>

                  </div>

                  {/* Row 2: Status Chips Toggle (Rent vs Sale) */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">FILTER: Nooca Guriga</span>
                      <div className="flex bg-white dark:bg-slate-950 border border-gray-100 dark:border-slate-800/80 p-1 rounded-lg">
                        <button
                          type="button"
                          onClick={() => setDashStatus("All")}
                          className={`px-3 py-1 rounded text-[11px] font-extrabold transition-all cursor-pointer ${
                            dashStatus === "All"
                              ? "bg-slate-900 dark:bg-emerald-600 text-white"
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          }`}
                        >
                          Dhammaan (All)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDashStatus(PropertyStatus.Rent)}
                          className={`px-3 py-1 rounded text-[11px] font-extrabold transition-all cursor-pointer ${
                            dashStatus === PropertyStatus.Rent
                              ? "bg-emerald-600 text-white"
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          }`}
                        >
                          Kiro (Rent)
                        </button>
                        <button
                          type="button"
                          onClick={() => setDashStatus(PropertyStatus.Sale)}
                          className={`px-3 py-1 rounded text-[11px] font-extrabold transition-all cursor-pointer ${
                            dashStatus === PropertyStatus.Sale
                              ? "bg-slate-900 dark:bg-emerald-700 text-white shadow-sm"
                              : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                          }`}
                        >
                          Iib (Sale)
                        </button>
                      </div>
                    </div>

                    <div className="text-[11px] font-mono text-slate-400">
                      Laga helay: <strong className="text-emerald-600 dark:text-teal-400 font-bold">{filteredListings.length}</strong> guri
                    </div>
                  </div>

                </div>

                {/* RESULTS GRID / TABLE */}
                {filteredListings.length === 0 ? (
                  <div className="text-center py-16 max-w-md mx-auto space-y-4">
                    <div className="h-12 w-12 rounded-full bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 flex items-center justify-center text-slate-400 mx-auto">
                      <Filter className="h-5 w-5 text-slate-350" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">Lama helin wax guri ah (No matched listings)</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      We couldn't find any listings matching those query filters. Change your search query or reset filters.
                    </p>
                    <button
                      onClick={() => {
                        setDashSearch("");
                        setDashStatus("All");
                        setDashCategory("All");
                      }}
                      className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold uppercase transition-all"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredListings.map((prop) => (
                      <div
                        key={prop.id}
                        className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between p-4 rounded-2xl bg-white dark:bg-slate-900 border-l-4 border-l-emerald-600 dark:border-l-emerald-500 border-y border-r border-slate-200/80 dark:border-slate-800/80 gap-4 hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all hover:shadow-md hover:shadow-slate-100/50 dark:hover:shadow-none group"
                      >
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 min-w-0">
                          {/* Rich thumbnail layout */}
                          <div className="relative h-20 w-full sm:w-28 rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800/80 flex-shrink-0 shadow-inner">
                            <img
                              src={prop.images[0]}
                              alt={prop.title}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-2 left-2">
                              {prop.status === PropertyStatus.Rent ? (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-emerald-600 text-white shadow-sm border border-emerald-500/20">Kiro (Rent)</span>
                              ) : (
                                <span className="px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-wider bg-slate-900 text-white shadow-sm border border-slate-850/40">Iib (Sale)</span>
                              )}
                            </div>
                          </div>

                          <div className="min-w-0 flex-1 space-y-1.5">
                            {/* Title with display font & custom category badge */}
                            <div className="flex items-start sm:items-center gap-2 flex-wrap">
                              <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-[9px] uppercase font-bold tracking-wider text-slate-500 dark:text-slate-400 font-mono">
                                {prop.category}
                              </span>
                              <h4 className="font-display font-bold text-sm sm:text-base text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                                {prop.title}
                              </h4>
                            </div>
                            
                            {/* Somalian Region and Specifications info system */}
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-slate-500 dark:text-slate-400 text-xs font-medium">
                              <span className="text-emerald-700 dark:text-emerald-400 font-mono font-extrabold text-sm bg-emerald-500/5 dark:bg-emerald-500/10 px-2.5 py-0.5 rounded-lg border border-emerald-500/15 shadow-sm">
                                ${prop.price.toLocaleString()}
                              </span>
                              <span className="text-slate-300 dark:text-slate-700">|</span>
                              <span className="flex items-center gap-1 font-bold text-[11px] text-slate-600 dark:text-slate-200">
                                📍 {prop.region} • <span className="text-slate-400 dark:text-slate-450 font-normal">{prop.location}</span>
                              </span>
                            </div>

                            {/* Property key technical specs row (Bedrooms, Bathrooms, Sq M) */}
                            <div className="flex flex-wrap items-center gap-2.5 pt-1">
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/50">
                                🛏️ {prop.bedrooms} Bed (Sariirta)
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/50">
                                🚿 {prop.bathrooms} Bath (Musqusho)
                              </span>
                              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-50 dark:bg-slate-850 px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-800/50 font-mono">
                                📐 {prop.areaSize} m²
                              </span>
                              {prop.approved === false && (
                                <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-amber-600 dark:text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 animate-pulse">
                                  ⏳ Sugaya Vetting...
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Control actions panel with high clarity, proper layout */}
                        <div className="flex sm:flex-row items-stretch sm:items-center gap-2 w-full lg:w-auto border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100 dark:border-slate-800 justify-end">
                          
                          <div className="hidden lg:flex flex-col items-end mr-3 text-[10px] font-semibold text-slate-400 dark:text-slate-550 leading-tight">
                            <span>Status</span>
                            <span className="text-emerald-500 flex items-center gap-1 font-bold mt-0.5 text-[10px]">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 inline-block"></span>
                              Live & Verified
                            </span>
                          </div>

                          <button
                            onClick={() => handleEditTrigger(prop)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-slate-50 hover:bg-slate-100 dark:bg-slate-850 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-250 dark:border-slate-700 font-extrabold text-[12px] cursor-pointer transition-all hover:scale-[1.01] active:scale-95 shadow-sm"
                            title="Bedel Guriga (Edit specifications)"
                          >
                            <Edit className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />
                            <span>Bedel (Edit)</span>
                          </button>
                          
                          <button
                            onClick={() => onDeleteProperty(prop.id)}
                            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 py-2 px-3.5 rounded-xl bg-red-500/5 hover:bg-red-500/10 text-red-650 dark:text-red-400 font-extrabold text-[12px] cursor-pointer border border-red-500/20 dark:border-red-500/10 transition-all hover:scale-[1.01] active:scale-95"
                            title="Tirtir Guriga (Delete from directories)"
                          >
                            <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            <span>Tirtir (Delete)</span>
                          </button>

                        </div>

                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })()}

          {/* TAB 2: PROPERTY POSTING FORM */}
          {activeTab === "add-form" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-slate-800">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setActiveTab("listings");
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-400 font-bold rounded-lg text-xs transition-all cursor-pointer border border-emerald-250/20 active:scale-95"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>{language === "en" ? "Back to Listings" : "Ku laabo Guryahayga"}</span>
                  </button>
                  <h3 className="font-display font-bold text-base sm:text-lg text-slate-900 dark:text-white">
                    {editingId 
                      ? (language === "en" ? "Edit Property Specifications" : "Bedel Macluumaadka Guriga") 
                      : (language === "en" ? "Upload Verified Property" : "Guri Cusub Geli")}
                  </h3>
                </div>
                <span className="text-[10px] bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 px-2.5 py-1 rounded font-bold font-mono self-start sm:self-auto shadow-sm">REGISTRY VETTING ACTIVE</span>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-5 text-left text-xs text-slate-700 dark:text-slate-300">
                {/* 🌟 PREMIUM SINGLE-FILE / MULTI-FILE UPLOAD CONTAINER (LOCAL ONLY) */}
                <div className="space-y-3 bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800/65">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs sm:text-sm uppercase tracking-wider flex items-center gap-1.5">
                        📸 {language === "en" ? "Image Gallery" : "Maamulka Sawirrada"}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {language === "en"
                          ? "Upload images from your device. Drag & drop files or click to choose."
                          : "Soo geli sawirro adoo ka dooranaya qalabkaaga. Jiid sawirrada ama guji si aad u dooratid."}
                      </p>
                    </div>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragEnter={handlePropDrag}
                    onDragOver={handlePropDrag}
                    onDragLeave={handlePropDrag}
                    onDrop={handlePropDrop}
                    onClick={() => document.getElementById("prop-file-picker")?.click()}
                    className="border-2 border-dashed rounded-2xl p-6 transition-all text-center flex flex-col items-center justify-center cursor-pointer min-h-[140px] border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 hover:border-emerald-500/40"
                  >
                    <input
                      id="prop-file-picker"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handlePropFileSelect}
                      className="hidden"
                    />

                    <div className="space-y-2 pointer-events-none">
                      <div className="h-10 w-10 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                        <Upload className="h-5 w-5" />
                      </div>
                      <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider">
                        {language === "en" ? "Upload custom photos" : "Soo geli sawiro lagala soo baxay files"}
                      </p>
                      <p className="text-[10px] text-slate-400">
                        {language === "en" ? "Drag & drop files or click to browse (JPEG, PNG, WEBP, up to 5 files)" : "Ku rux halkan sawirada ama guji si aad uga doorato computer-kaaga (ilaa 5 sawir)"}
                      </p>
                    </div>
                  </div>

                  {/* Uploaded Photos Preview List */}
                  {(() => {
                    const activeImages = formImages.filter(img => img && img.trim() !== "");
                    if (activeImages.length > 0) {
                      return (
                        <div className="space-y-2 mt-4">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                            {language === "en" ? `Uploaded Photos (${activeImages.length})` : `Sawirada la soo geliyay (${activeImages.length})`}
                          </span>
                          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                            {formImages.map((img, idx) => {
                              if (!img || img.trim() === "") return null;
                              return (
                                <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 group">
                                  <img src={img} className="w-full h-full object-cover" alt="Uploaded Thumbnail" />
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setFormImages(prev => {
                                        const copy = [...prev];
                                        copy[idx] = "";
                                        return copy;
                                      });
                                    }}
                                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 cursor-pointer"
                                  >
                                    <span className="bg-red-650 hover:bg-red-600 text-white rounded-full p-2 flex items-center justify-center shadow-lg">
                                      <Trash2 className="h-4 w-4" />
                                    </span>
                                  </button>
                                  {idx === 0 && (
                                    <span className="absolute bottom-1 left-1 bg-emerald-600 text-white text-[8px] px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                                      {language === "en" ? "Cover" : "Kow"}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>

                {/* 🌟 SIMPLE LISTING purpose SWITCHER */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-900/45 border border-slate-200 dark:border-slate-800">
                  <div className="space-y-1 text-left">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider">
                      {language === "en" ? "Listing Purpose" : "Nooca Guriga"}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {language === "en" ? "Choose whether this property is for renting or selling." : "Dooro haddii gurigan la kireynayo ama la iibinayo."}
                    </p>
                  </div>
                  <div className="flex bg-slate-100 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-850 self-start sm:self-auto">
                    <button
                      type="button"
                      disabled={category === PropertyCategory.LandSale}
                      onClick={() => setStatus(PropertyStatus.Rent)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        status === PropertyStatus.Rent
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400 disabled:opacity-40"
                      }`}
                    >
                      <span>🔑</span>
                      <span>{language === "en" ? "For Rent" : "Ijaar / Kiro"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setStatus(PropertyStatus.Sale)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-extrabold uppercase transition-all cursor-pointer flex items-center gap-1.5 ${
                        status === PropertyStatus.Sale
                          ? "bg-emerald-600 text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700 dark:text-slate-400"
                      }`}
                    >
                      <span>🏡</span>
                      <span>{language === "en" ? "For Sale" : "Iib / Miiq"}</span>
                    </button>
                  </div>
                </div>

                {/* 📝 UNIFIED CLEAN PROPERTIES GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Property Title */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {language === "en" ? "Property Title" : "Magaca Ama Ciwaanka Dhismaha"}
                    </label>
                    <input
                      type="text"
                      placeholder={
                        status === PropertyStatus.Rent 
                          ? (language === "en" ? "e.g. Modern duplex apartment with water" : "t.s. Guri Kiro ah oo leh biyo")
                          : (language === "en" ? "e.g. Premium plot near market" : "t.s. Villa ama dhul ku yaal badhtamaha")
                      }
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85 hover:border-emerald-300 dark:hover:border-emerald-800"
                    />
                  </div>

                  {/* Price */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {status === PropertyStatus.Rent 
                        ? (language === "en" ? "Rental Price (USD / Month)" : "Qiimaha Kirada (Bishii - USD)")
                        : (language === "en" ? "Total Buyout Price (USD)" : "Qiimaha Guud ee Iibka (USD)")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-mono text-xs font-bold text-slate-400">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder={status === PropertyStatus.Rent ? "e.g. 350" : "e.g. 45000"}
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 pl-8 pr-4 py-2.5 rounded-xl border text-xs font-mono font-extrabold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85 hover:border-emerald-300 dark:hover:border-emerald-800 text-emerald-600 dark:text-emerald-400"
                      />
                    </div>
                  </div>

                  {/* Category Type */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {language === "en" ? "Property Category" : "Qeybta Guriga"}
                    </label>
                    <select
                      value={category}
                      onChange={(e) => {
                        const newCat = e.target.value as PropertyCategory;
                        setCategory(newCat);
                        if (newCat === PropertyCategory.LandSale) {
                          setStatus(PropertyStatus.Sale);
                        }
                      }}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                    >
                      {Object.values(PropertyCategory).map(cat => (
                        <option key={cat} value={cat} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{getCategoryLabel(cat)}</option>
                      ))}
                    </select>
                  </div>

                  {/* Area Size */}
                  {category !== PropertyCategory.CarSale && (
                    <div className="space-y-1">
                      <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                        📐 {language === "en" ? "Area Size (Sq M)" : "Baaxadda (Sq M)"}
                      </label>
                      <input
                        type="number"
                        placeholder="e.g. 280"
                        value={areaSize}
                        onChange={(e) => setAreaSize(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                      />
                    </div>
                  )}

                  {/* Neighborhood */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {language === "en" ? "Neighborhood / Sector" : "Xaafadda ama Qaybta"}
                    </label>
                    <select
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-800"
                    >
                      {SOMALI_REGIONS.map(reg => (
                        <option key={reg} value={reg} className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{reg}</option>
                      ))}
                    </select>
                  </div>

                  {/* Street Address */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {language === "en" ? "Street Address" : "Waddada ama Aagga"}
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Waddada October, Caabudwaaq"
                      required
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/80 hover:border-emerald-300 dark:hover:border-emerald-800"
                    />
                  </div>

                  {/* Listing Availability Date */}
                  <div className="space-y-1">
                    <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                      {language === "en" ? "Listing Availability" : "Taariikkhda Guriga oo Diyaar ah"}
                    </label>
                    <input
                      type="date"
                      value={availableDate}
                      onChange={(e) => setAvailableDate(e.target.value)}
                      className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs font-mono font-extrabold outline-none cursor-pointer transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/80 hover:border-emerald-350 text-emerald-600 dark:text-emerald-400"
                      style={{ colorScheme: typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light" }}
                    />
                  </div>

                  {/* CONDITIONAL SUB-FIELDS IN THE SAME FLAT GRID */}
                  {category === PropertyCategory.LandSale ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          📐 {language === "en" ? "Dimensions (e.g. 15x18m)" : "Cabbirka (m)"}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 15x18m"
                          value={dimensions}
                          onChange={(e) => setDimensions(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs text-slate-900 dark:text-slate-100 font-bold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          {language === "en" ? "Zoning / Land Use" : "Habka Dhulka"}
                        </label>
                        <select
                          value={zoning}
                          onChange={(e) => setZoning(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800/80 text-xs text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 transition-all font-sans"
                        >
                          <option value="Residential" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Residential (Deegaan)" : "Deegaanka Guryaha"}</option>
                          <option value="Commercial" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Commercial (Ganacsi)" : "Ganacsiga"}</option>
                          <option value="Agricultural" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Agricultural (Beeraha)" : "Beeraha"}</option>
                        </select>
                      </div>
                    </>
                  ) : category === PropertyCategory.Commercial ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          🏢 {language === "en" ? "Number of Shops / Rooms" : "Tirada Qolalka/Dukaamada"}
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 12"
                          value={numShops}
                          onChange={(e) => setNumShops(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          {language === "en" ? "Has Parking Space?" : "Ma leeyahay Baarkin?"}
                        </label>
                        <select
                          value={hasParking ? "yes" : "no"}
                          onChange={(e) => setHasParking(e.target.value === "yes")}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        >
                          <option value="yes" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Yes" : "Haa, waa leeyahay"}</option>
                          <option value="no" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "No" : "Maya, ma laha"}</option>
                        </select>
                      </div>
                    </>
                  ) : category === PropertyCategory.CarSale ? (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          🚗 {language === "en" ? "Car Make / Brand" : "Nooca Baabuurka / Brand"}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Toyota"
                          value={carMake}
                          onChange={(e) => setCarMake(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          🚘 {language === "en" ? "Car Model" : "Moodalka Gaariga"}
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. Land Cruiser"
                          value={carModel}
                          onChange={(e) => setCarModel(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          📅 {language === "en" ? "Year" : "Sannadka"}
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 2021"
                          value={carYear}
                          onChange={(e) => setCarYear(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          ⚙️ {language === "en" ? "Transmission" : "Giriig / Transmission"}
                        </label>
                        <select
                          value={carTransmission}
                          onChange={(e) => setCarTransmission(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        >
                          <option value="Automatic" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Automatic" : "Atomaatik"}</option>
                          <option value="Manual" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Manual" : "Mandiil / Gacanta"}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          ⛽ {language === "en" ? "Fuel Type" : "Nooca Shidaalka"}
                        </label>
                        <select
                          value={carFuelType}
                          onChange={(e) => setCarFuelType(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none cursor-pointer transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        >
                          <option value="Petrol" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Petrol" : "Bansiin"}</option>
                          <option value="Diesel" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Diesel" : "Naafto"}</option>
                          <option value="Hybrid" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Hybrid" : "Heberidh"}</option>
                          <option value="Electric" className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-bold">{language === "en" ? "Electric" : "Koronto"}</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          🛣️ {language === "en" ? "Mileage (KM)" : "KM-ka uu Socday (KM)"}
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 45000"
                          value={carMileage}
                          onChange={(e) => setCarMileage(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          🛏️ {language === "en" ? "Bedrooms" : "Qolalka Seexashada"}
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 4"
                          value={bedrooms}
                          onChange={(e) => setBedrooms(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                          🛁 {language === "en" ? "Bathrooms" : "Musqulaha"}
                        </label>
                        <input
                          type="number"
                          placeholder="e.g. 3"
                          value={bathrooms}
                          onChange={(e) => setBathrooms(e.target.value)}
                          className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border text-xs text-slate-900 dark:text-slate-100 font-bold outline-none transition-all focus:ring-2 focus:border-emerald-500 focus:ring-emerald-500/10 border-slate-200 dark:border-slate-800/85"
                        />
                      </div>
                    </>
                  )}
                </div>

                {category === PropertyCategory.LandSale && (
                  <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="has-title-deed"
                      checked={hasTitleDeed}
                      onChange={(e) => setHasTitleDeed(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-350 dark:border-slate-750 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                    <div className="flex flex-col text-left">
                      <label htmlFor="has-title-deed" className="text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer">
                        {language === "en" ? "Official Title Deed Available" : "Wasiqada/Dukumeentiga Sharciga ah ee dhulka waa diyaar"}
                      </label>
                      <p className="text-[10px] text-slate-400">
                        {language === "en" ? "Title certificates are available on demand." : "Tani waxay u xaqiijinaysaa iibsadaha in warqaddii dhulka oo diwaangashan ay diyaari tahay."}
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">Detailed Property Description & Key features</label>
                  <textarea
                    rows={4}
                    placeholder="Provide details such as backup security, solar inverter systems, local water borehole, proximity to malls or embassies, etc."
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80 resize-none font-sans text-xs text-slate-900 dark:text-slate-100 font-bold outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 hover:border-slate-300 dark:hover:border-slate-750 transition-all"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setActiveTab("listings");
                    }}
                    className="flex-1 py-3 border border-gray-200 hover:bg-slate-50 dark:border-slate-800/85 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 cursor-pointer"
                  >
                    Discard Entries
                  </button>
                  <button
                    type="submit"
                    className="flex-[2] py-3 bg-emerald-600 hover:bg-emerald-550 text-white rounded-xl text-xs font-bold uppercase cursor-pointer text-center select-none active:scale-95 transition-all outline-none focus:ring-2 focus:ring-emerald-500/20"
                  >
                    {editingId ? "Save Property Changes" : "Submit Vetting Specification"}
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB 3: BUYERS EMAIL/WHATSAPP INQUIRIES RECEIVED */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Customer Inquiries Log</h3>
                <span className="text-xs text-slate-400 font-mono">Total Received: {userInquiries.length} inquiries</span>
              </div>

              {userInquiries.length === 0 ? (
                <div className="text-center py-16 text-slate-400 italic text-sm">
                  <MessageSquare className="h-8 w-8 text-slate-300 mx-auto mb-2" />
                  No direct buyer inquiries received on your listings yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {userInquiries.map((inq) => {
                    const encodedText = encodeURIComponent(`Salaam ${inq.name}, I received your inquiry for my listing "${inq.propertyTitle}". Let me share more spec sheets.`);
                    const replyWa = `https://wa.me/${inq.phone.replace(/[^0-9]/g, "")}?text=${encodedText}`;
                    
                    return (
                      <div
                        key={inq.id}
                        className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 space-y-3"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div>
                            <span className="text-[9px] bg-emerald-100 dark:bg-emerald-950 font-bold px-2 py-0.5 rounded text-emerald-700 dark:text-emerald-300 font-mono">
                              PROPERTY REF: {inq.propertyId.toUpperCase()}
                            </span>
                            <h4 className="font-semibold text-slate-800 dark:text-white text-xs mt-1.5 leading-none">
                              Associated Object: <span className="font-bold underline">{inq.propertyTitle}</span>
                            </h4>
                          </div>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(inq.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="p-3 bg-white dark:bg-slate-950 rounded-xl border border-gray-200/50 dark:border-slate-850/50 text-xs text-slate-600 dark:text-slate-350 italic">
                          "{inq.message}"
                        </div>

                        {/* Customer Bio details and contact action links */}
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-2 text-xs border-t border-gray-100 dark:border-slate-850">
                          <div className="space-y-1 font-mono text-[10px] text-slate-400">
                            <p>Buyer: <span className="text-slate-800 dark:text-slate-200 font-bold">{inq.name}</span></p>
                            <p>Email: <span className="text-slate-800 dark:text-slate-200 font-bold">{inq.email}</span></p>
                            <p>Phone: <span className="text-slate-800 dark:text-slate-200 font-bold">{inq.phone}</span></p>
                          </div>

                          <div className="flex gap-2 w-full sm:w-auto">
                            <a
                              href={`mailto:${inq.email}`}
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-white hover:bg-slate-50 border border-gray-200 p-2 px-3 rounded-lg text-[11px] font-bold text-slate-700 cursor-pointer"
                            >
                              <Mail className="h-3 w-3" /> Mail Back
                            </a>
                            <a
                              href={replyWa}
                              target="_blank"
                              rel="noreferrer"
                              className="flex-1 sm:flex-initial flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-550 text-white p-2 px-3 rounded-lg text-[11px] font-bold cursor-pointer"
                            >
                              <Phone className="h-3 w-3" /> WhatsApp Back
                            </a>
                          </div>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MY FAVORITES SAVED LIST */}
          {activeTab === "favorites" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">Saved Properties Portfolio</h3>
                <span className="text-xs text-slate-400 font-mono">Current: {favorites.length} properties</span>
              </div>

              {favorites.length === 0 ? (
                <div className="text-center py-16 text-slate-400 italic text-sm">
                  <Heart className="h-8 w-8 text-rose-300 mx-auto mb-2" />
                  You haven't saved any property cards to your favorites.
                </div>
              ) : (
                <div className="space-y-4">
                  {favorites.map((prop) => (
                    <div
                      key={prop.id}
                      className="flex justify-between items-center p-3 sm:p-4 rounded-xl bg-slate-50 dark:bg-slate-900 border border-gray-100 dark:border-slate-800 gap-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={prop.images[0]}
                          alt={prop.title}
                          className="h-12 w-16 object-cover rounded-lg bg-slate-100"
                        />
                        <div>
                          <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">{prop.title}</h4>
                          <p className="text-[10px] text-slate-400 font-mono">${prop.price.toLocaleString()} • {prop.region}</p>
                        </div>
                      </div>

                      <button
                        onClick={(e) => onRemoveFavorite(prop.id, e)}
                        className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: BROKER PROFILE SPECIFICATIONS */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-slate-800">
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white">
                    {language === "en" ? "Broker Profile Management" : "Maamulka Macluumaadka Broker-ka"}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                    {language === "en" 
                      ? "Keep your name, phone and contact channels updated for buyer notifications." 
                      : "La soco oo cusbooneysi magacaaga, fariimaha iyo channels-ka xiriirka ee macaamiisha."}
                  </p>
                </div>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2.5 py-0.5 rounded font-bold font-mono">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Card: Beautiful Current Profile Avatar Widget */}
                <div className="bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-6 rounded-2xl text-center space-y-4 h-fit">
                  <span className="text-[9px] uppercase tracking-wider font-mono text-slate-400 font-bold block">
                    {language === "en" ? "Broker Stamp & Photo" : "Sawirka iyo Aqoonsiga Broker-ka"}
                  </span>

                  <div className="relative mx-auto h-24 w-24 rounded-2xl flex items-center justify-center bg-white dark:bg-slate-950 overflow-hidden group border border-slate-200 dark:border-slate-800">
                    {currentUser.avatar ? (
                      <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="font-display font-extrabold text-3xl text-emerald-600 dark:text-emerald-400">
                        {currentUser.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>

                  <div>
                    <h4 className="font-bold text-sm text-slate-800 dark:text-white">{currentUser.name}</h4>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{currentUser.email}</p>
                    <p className="text-[10px] text-emerald-500 font-mono font-bold uppercase tracking-widest mt-1.5 flex items-center justify-center gap-1">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block animate-ping"></span>
                      Verified Kireeye Broker
                    </p>
                  </div>

                  <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/15 text-[10px] text-emerald-600 dark:text-emerald-400/90 leading-relaxed text-left">
                    💡 <strong>{language === "en" ? "Profile Image:" : "Sifada Sawirka:"}</strong>
                    {language === "en"
                      ? " Hover on the header avatar photo to select or drag and drop a new high resolution profile face card."
                      : " Dul gee jiirka sawirka sare ee dashboard-ka si aad u badashid ama u soo gelisid sawirkaaga."}
                  </div>
                </div>

                {/* Right Form Component: Inputs styled with 3-colors: Baltic Teal (#0f766e) focus, Alabaster (#fafaf9) backgrounds */}
                <div className="lg:col-span-2 bg-slate-50 dark:bg-slate-900 border border-gray-150 dark:border-slate-800 p-6 rounded-2xl">
                  
                  <form onSubmit={handleProfileSubmit} className="space-y-4 text-left">
                    
                    <div className="space-y-1">
                      <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                        {language === "en" ? "Broker Public Name" : "Magacaaga Buuxa ee Shacabka u muuqanaya"}
                      </label>
                      <input
                        type="text"
                        required
                        value={profName}
                        onChange={(e) => setProfName(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 font-medium text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-sans"
                        placeholder="e.g. Abdirahman Ali"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                        {language === "en" ? "Email Address" : "Cinwaanka Email-ka xiriirka"}
                      </label>
                      <input
                        type="email"
                        required
                        value={profEmail}
                        onChange={(e) => setProfEmail(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 hover:border-slate-300 dark:hover:border-slate-700 transition-all font-sans"
                        placeholder="e.g. broker@kireeye.com"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-black text-emerald-750 dark:text-emerald-400 uppercase tracking-wider block text-left mb-1">
                        {language === "en" ? "Phone Helpline Hotline" : "Khadka Telefoonka laguugu soo wacayo"}
                      </label>
                      <input
                        type="text"
                        required
                        value={profPhone}
                        onChange={(e) => setProfPhone(e.target.value)}
                        className="w-full bg-white dark:bg-slate-950 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-800 font-mono text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/10 hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                        placeholder="e.g. +252 61 555 5555"
                      />
                    </div>

                    {/* Pro notice explaining database connections sync */}
                    <div className="p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-emerald-600 dark:text-emerald-400/90 leading-relaxed font-sans">
                      🔒 <strong>{language === "en" ? "Kireeye Integration Protection: " : "Badbaadada Diiwaanka Kireeye: "}</strong>
                      {language === "en" 
                        ? "Any modifications instantly synchronize with all active listings and customer inquiry chats registered under your name!"
                        : "Isbedel kasta oo aad ku sameyso durbadiiba wuxuu u weecanayaa dhamaan guryaha aad gelisay iyo fariimaha macaamiisha oo magacaaga ku diiwaangashan!"}
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-555 text-white rounded-xl text-xs font-bold uppercase shadow-md shadow-emerald-500/20 active:scale-95 transition-all duration-150 cursor-pointer text-center outline-none"
                      >
                        {language === "en" ? "Save Profile details" : "Kaydi Macluumaadka"}
                      </button>
                    </div>

                  </form>

                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
