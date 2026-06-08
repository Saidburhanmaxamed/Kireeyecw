/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type Language = "en" | "so";

export interface TranslationDict {
  // Navigation & Header
  home: string;
  properties: string;
  contactUs: string;
  brokerLogin: string;
  myDashboard: string;
  adminPortal: string;
  logout: string;
  savedProperties: string;
  notifications: string;
  unread: string;
  noAlerts: string;
  signedInAs: string;

  // Hero Section
  heroTitle: string;
  heroSub: string;
  searchPlaceholder: string;
  propertyType: string;
  minPrice: string;
  maxPrice: string;
  region: string;
  searchButton: string;
  allCategories: string;
  allRegions: string;

  // Stats Section
  statsTitle: string;
  statsSub: string;
  vettedProperties: string;
  certifiedBrokers: string;
  closedDeals: string;
  secureRentals: string;

  // Property Listing & Card
  featuredProperties: string;
  exploreAll: string;
  noPropertiesFound: string;
  priceTag: string;
  bedrooms: string;
  bathrooms: string;
  area: string;
  forSale: string;
  forRent: string;
  vettedBroker: string;
  whatsappContact: string;
  viewDetails: string;
  location: string;

  // Detail Modal
  propertyDetails: string;
  bedroomsLabel: string;
  bathroomsLabel: string;
  sizeLabel: string;
  availableFrom: string;
  listedBy: string;
  sendInquiry: string;
  inquiryPlaceholder: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  messageText: string;
  sending: string;
  inquirySuccess: string;

  // FAQ
  faqTitle: string;
  faqSub: string;

  // Footer
  footerSub: string;
  marketplaceGuides: string;
  quickLinks: string;
}

export const translations: Record<Language, TranslationDict> = {
  en: {
    home: "Home",
    properties: "Properties",
    contactUs: "Contact Us",
    brokerLogin: "Broker Login",
    myDashboard: "My Dashboard",
    adminPortal: "Admin Portal",
    logout: "Log Out",
    savedProperties: "Saved Properties",
    notifications: "Notifications",
    unread: "unread",
    noAlerts: "No new alerts yet.",
    signedInAs: "Signed in as",

    heroTitle: "Reliable Properties, Gated Homes",
    heroSub: "Kireeye is a premium platform where you can find properties, rentals, and commercial shares/shops in Caabudwaaq.",
    searchPlaceholder: "Search properties by name, description, address, or region...",
    propertyType: "Property Type",
    minPrice: "Min Price",
    maxPrice: "Max Price",
    region: "Region/Xaafadda",
    searchButton: "Search Marketplace",
    allCategories: "All Categories",
    allRegions: "All Regions",

    statsTitle: "Verified Local Numbers",
    statsSub: "Caabudwaaq's first decentralized estate tracking system with verified ownership profiles.",
    vettedProperties: "Vetted Properties",
    certifiedBrokers: "Certified Brokers",
    closedDeals: "Closed Transactions",
    secureRentals: "Secure Rentals",

    featuredProperties: "Exquisite Verified Listings",
    exploreAll: "Explore All Properties",
    noPropertiesFound: "No properties match your current search and filters. Try adjusting them.",
    priceTag: "Price",
    bedrooms: "beds",
    bathrooms: "baths",
    area: "sqm",
    forSale: "FOR SALE",
    forRent: "FOR RENT",
    vettedBroker: "VETTED BROKER",
    whatsappContact: "WhatsApp",
    viewDetails: "View Details",
    location: "Location",

    propertyDetails: "Verified Property Details",
    bedroomsLabel: "Bedrooms Count",
    bathroomsLabel: "Bathroom Units",
    sizeLabel: "Land / Area Size",
    availableFrom: "Available Starting From",
    listedBy: "Listed by Agent",
    sendInquiry: "Submit Direct Secure Inquiry",
    inquiryPlaceholder: "I am interested in this estate property. Please contact me with more information.",
    fullName: "Your Full Name",
    emailAddress: "Email Address (Optional)",
    phoneNumber: "Active Phone Number",
    messageText: "Inquiry Message",
    sending: "Sending inquiry...",
    inquirySuccess: "Inquiry successfully submitted! The certified agent will contact you soon.",

    faqTitle: "Frequently Answered Questions",
    faqSub: "Get answers about Caabudwaaq property regulations, titles, and diaspora support protocols.",

    footerSub: "It is a premium platform where you can find properties, rentals, and commercial shops across Caabudwaaq.",
    marketplaceGuides: "Marketplace Guides",
    quickLinks: "Quick Access Links",
  },
  so: {
    home: "Hoyga",
    properties: "Guryaha",
    contactUs: "Nala Soo Xiriir",
    brokerLogin: "Giddaan weyn (Gasho)",
    myDashboard: "Dashboard-kayga",
    adminPortal: "Admin Guud",
    logout: "Ka Bax",
    savedProperties: "La Keydiyey",
    notifications: "Ogeysiisyada",
    unread: "aan la akhrin",
    noAlerts: "Ma jiraan ogeysiisyo cusub.",
    signedInAs: "Waxaad ku gashay",

    heroTitle: "Guryo Ammaan ah & Deegaan Sugan",
    heroSub: "Waa madal aad ka heli karto guryaha, iyo dukaamada kirada iyo ganacsiga ah ee Caabudwaaq.",
    searchPlaceholder: "Ka raadi guryaha magac, faahfaahin, ama xaafad...",
    propertyType: "Nooca Guriga",
    minPrice: "Qiimaha ugu Hooseeya",
    maxPrice: "Qiimaha ugu Sarreeya",
    region: "Xaafadda",
    searchButton: "Raadi Hadda",
    allCategories: "Dhammaan Qaybaha",
    allRegions: "Dhammaan Xaafadaha",

    statsTitle: "Xogta Guud ee Caabudwaaq",
    statsSub: "Nidaamka ugu horreeya ee lagu hubiyo guryaha Caabudwaaq iyo wakiilada sharciga ah.",
    vettedProperties: "Guryo La Hubiyey",
    certifiedBrokers: "Wakiilo Certified Ah",
    closedDeals: "Heshiisyo Dhamaaday",
    secureRentals: "Ijaarka la Hubiyey",

    featuredProperties: "Guryaha la Hubiyey ee iibka/kirada ah",
    exploreAll: "Arag Dhammaan Guryaha",
    noPropertiesFound: "Wax guryo ah looma helin raadintaada. Fadlan beddel filters-ka.",
    priceTag: "Qiimaha",
    bedrooms: "qol",
    bathrooms: "suuli",
    area: "m²",
    forSale: "IIB AH",
    forRent: "KIRE CUSUB",
    vettedBroker: "BROKER LA HUBIYEY",
    whatsappContact: "WhatsApp",
    viewDetails: "Arag Faahfaahinta",
    location: "Goobta/Xaafada",

    propertyDetails: "Faahfaahinta Rasmiga ah ee Guriga",
    bedroomsLabel: "Tirada Qolalka",
    bathroomsLabel: "Tirada Musqulaha/Suuliga",
    sizeLabel: "Baaxadda Dhulka oo m² ah",
    availableFrom: "La heli karo laga bilaabo",
    listedBy: "Waxaa soo dhigay Wakiilka",
    sendInquiry: "U dir Warbixin toos ah Wakiilka",
    inquiryPlaceholder: "Waxaan xiiseynayaa gurigan. Fadlan igala soo xiriir faahfaahin dheeraad ah.",
    fullName: "Magacaaga Oo Buuxa",
    emailAddress: "Email-kaaga (Ikhiyaari)",
    phoneNumber: "Lamberkaaga Taleefanka",
    messageText: "Fasiraada fariinta",
    sending: "Waa la dirayaa...",
    inquirySuccess: "Waa la diray! Wakiilka la hubiyey ayaa dhowaan kugula soo xiriiri doona taleefankaaga.",

    faqTitle: "Su'aalaha Badanaa la Is Weydiiyo",
    faqSub: "Faahfaahin ku saabsan nidaamyada kireynta, dukumeentiyada dhulka iyo dammaanad-gelinta Caabudwaaq.",

    footerSub: "Waa madal aad ka heli karto guryaha, iyo dukaamada kirada iyo ganacsiga ah ee Caabudwaaq.",
    marketplaceGuides: "Hanuuniyaha Suuqa",
    quickLinks: "Xiriirada Degdega ah",
  }
};
