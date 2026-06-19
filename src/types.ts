/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PropertyStatus {
  Rent = "Rent",
  Sale = "Sale"
}

export enum PropertyCategory {
  House = "Properties",
  LandSale = "Land for Sale",
  Apartment = "Apartments",
  Commercial = "Commercial Buildings",
  Villa = "Villas",
  CarSale = "Cars for Sale"
}

export interface Property {
  id: string;
  title: string;
  description: string;
  category: string; // From PropertyCategory
  type: string;     // e.g. "Residential", "Commercial", "Land", "Vehicle"
  price: number;
  location: string; // e.g. "Jigjiga Yar, Hargeisa" or "Liido Beach, Mogadishu"
  region: string;   // e.g. "Mogadishu", "Hargeisa", "Garowe", "Kismayo", "Bosaso"
  status: PropertyStatus;
  bedrooms: number;
  bathrooms: number;
  areaSize: number; // in Sq M
  images: string[];
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerWhatsapp: string;
  approved: boolean; // Needs approval by admin
  featured: boolean;
  createdAt: string;
  agencyId?: string;
  availableDate?: string; // Optional field for rentals
  dimensions?: string;    // dimensions for Land (e.g. "15x18m")
  hasTitleDeed?: boolean; // whether Land has official ownership paperwork
  zoning?: string;        // Land utilization type (e.g. Residential, Commercial, Farming)
  numShops?: number;      // Number of shops or separate commercial rooms
  hasParking?: boolean;   // parking space inclusion
  rentalDeposit?: number; // deposit amount for rental properties
  rentalPeriod?: string;  // billing period (e.g. "Monthly", "Yearly")
  includedUtilities?: string; // e.g. "Water, Electricity, Guard"
  paymentInstallments?: boolean; // allows installment payments for buying or Land sales
  downPaymentAmount?: number; // initial down payment required if installments are active
  carMake?: string;        // e.g. "Toyota"
  carModel?: string;       // e.g. "Land Cruiser"
  carYear?: number;        // e.g. 2022
  carTransmission?: string;// e.g. "Automatic" or "Manual"
  carFuelType?: string;    // e.g. "Petrol", "Diesel", "Hybrid", "Electric"
  carMileage?: number;     // e.g. 85000
}

export interface Inquiry {
  id: string;
  propertyId: string;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  username?: string;
  role: "admin" | "agent" | "buyer";
  phone: string;
  password?: string;
  avatar?: string;
  approved?: boolean;
  createdAt: string;
}

export interface Favorite {
  id: string;
  userId: string;
  propertyId: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "alert" | "inquiry" | "success" | "general";
  createdAt: string;
  read: boolean;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  rating: number;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Agency {
  id: string;
  name: string;
  email: string;
  phone: string;
  logo?: string;
  location: string;
  createdAt: string;
}

export interface AgencyLog {
  id: string;
  agencyId: string;
  action: string;
  targetId?: string;
  details?: string;
  createdAt: string;
}
