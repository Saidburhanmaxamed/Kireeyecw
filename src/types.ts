/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum PropertyStatus {
  Rent = "Rent",
  Sale = "Sale"
}

export enum PropertyCategory {
  HouseRent = "Houses for Rent",
  HouseSale = "Houses for Sale",
  LandSale = "Land for Sale",
  Apartment = "Apartments",
  Commercial = "Commercial Buildings",
  Villa = "Villas"
}

export interface Property {
  id: string;
  title: string;
  description: string;
  category: string; // From PropertyCategory
  type: string;     // e.g. "Residential", "Commercial", "Land"
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
  availableDate?: string; // Optional field for rentals
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
