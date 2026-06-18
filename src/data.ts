/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Property, PropertyStatus, PropertyCategory, Testimonial, FAQItem } from "./types";

export const SAMPLE_PROPERTIES: Property[] = [
  {
    id: "prop-1",
    title: "Premium Modern Residence in October",
    description: "Experience comfortable living in this premium villa located in the heart of October neighborhood, Caabudwaaq. Featuring modern high-ceiling salons, high-quality finishes, spacious bedrooms, and a secure gated compound with solar security, reliable backup electricity, and independent security parameters. Perfect for returnee diaspora families wanting comfort, space, and ultimate peace of mind.",
    category: PropertyCategory.Villa,
    type: "Residential",
    price: 165000,
    location: "Waddada October, Caabudwaaq",
    region: "October",
    status: PropertyStatus.Sale,
    bedrooms: 6,
    bathrooms: 5,
    areaSize: 420,
    images: [
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-1",
    ownerName: "Abdirahman Warsame (Real Estate Lead)",
    ownerPhone: "+252615123456",
    ownerWhatsapp: "252615123456",
    approved: true,
    featured: true,
    createdAt: "2026-05-15T08:30:00Z",
    agencyId: "agency-1"
  },
  {
    id: "prop-2",
    title: "Spacious Family Compound in Amaana",
    description: "An amazing multi-generational estate located in the highly secure Amaana neighborhood of Caabudwaaq. Features large modern living rooms, high-quality security walling, private courtyard with beautiful shade trees, reliable water supply with backup reservoirs, and dual solar/generator backup setups. Ideal for families seeking a serene community environment.",
    category: PropertyCategory.House,
    type: "Residential",
    price: 350,
    location: "Xaafadda Amaana, Caabudwaaq",
    region: "Amaana",
    status: PropertyStatus.Rent,
    bedrooms: 5,
    bathrooms: 4,
    areaSize: 380,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-2",
    ownerName: "Sarah Yusuf (Horn Property Group)",
    ownerPhone: "+252634987654",
    ownerWhatsapp: "252634987654",
    approved: true,
    featured: true,
    createdAt: "2026-06-01T14:15:00Z",
    availableDate: "2026-06-15",
    agencyId: "agency-2"
  },
  {
    id: "prop-3",
    title: "Modern Multi-Bedroom Apartment in Ubax",
    description: "A beautifully styled, high-security 3-bedroom apartment on the 2nd floor of a newly developed modern apartment complex in Ubax neighborhood, Caabudwaaq. Offers excellent ventilation, premium tiled floors, dynamic layout, open-plan kitchen, indoor parking coordinates, and 24/7 solar-powered energy system. Best option for business owners or local staff.",
    category: PropertyCategory.Apartment,
    type: "Residential",
    price: 250,
    location: "Main Street, Xaafadda Ubax, Caabudwaaq",
    region: "Ubax",
    status: PropertyStatus.Rent,
    bedrooms: 3,
    bathrooms: 2,
    areaSize: 165,
    images: [
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-3",
    ownerName: "Mohamed Farah (Juba Valley Agency)",
    ownerPhone: "+252612543210",
    ownerWhatsapp: "252612543210",
    approved: true,
    featured: false,
    createdAt: "2026-05-28T09:20:00Z",
    availableDate: "2026-06-25",
    agencyId: "agency-1"
  },
  {
    id: "prop-4",
    title: "Prime Commercial Depot Plaza in Waabari",
    description: "Strategically located on the active main commercial artery of Waabari neighborhood, Caabudwaaq. This modern multi-use commercial building is excellent for retail stores, wholesale businesses, banking services, private healthcare clinic, or corporate agency hub. Boasts secure ground floor storage, great solar grid power integration, and high visibility to passing foot traffic.",
    category: PropertyCategory.Commercial,
    type: "Commercial",
    price: 295000,
    location: "Main Market Road, Waabari, Caabudwaaq",
    region: "Waabari",
    status: PropertyStatus.Sale,
    bedrooms: 0,
    bathrooms: 8,
    areaSize: 1100,
    images: [
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-1",
    ownerName: "Abdirahman Warsame (Real Estate Lead)",
    ownerPhone: "+252615123456",
    ownerWhatsapp: "252615123456",
    approved: true,
    featured: true,
    createdAt: "2026-05-18T11:45:00Z"
  },
  {
    id: "prop-5",
    title: "Vetted Elegance Family Villa in Waabari",
    description: "Beautifully built, new two-story family villa situated within the peaceful and highly safe Waabari neighborhood of Caabudwaaq. Complete with manicured garden lawns, high surrounding security walls with specialized security perimeters, a beautiful open concept kitchen, guest reception rooms (Majlis), clean borewell plumbing, and high-speed solar backup electricity.",
    category: PropertyCategory.House,
    type: "Residential",
    price: 115000,
    location: "Xaafadda Waabari, Caabudwaaq",
    region: "Waabari",
    status: PropertyStatus.Sale,
    bedrooms: 4,
    bathrooms: 3,
    areaSize: 280,
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-1",
    ownerName: "Abdirahman Warsame (Real Estate Lead)",
    ownerPhone: "+252615123456",
    ownerWhatsapp: "252615123456",
    approved: true,
    featured: false,
    createdAt: "2026-06-03T10:00:00Z"
  },
  {
    id: "prop-6",
    title: "Prime Commercial Development Land Plot",
    description: "An exceptionally located, flat commercial land plot ready for immediate warehouse construction or residential block project, situated along the growth axis of 1 Luuliyo neighborhood in Caabudwaaq. Fully certified with verified local land ownership deeds, marked boundary poles, and easy hookups to water and electric grids.",
    category: PropertyCategory.LandSale,
    type: "Land",
    price: 18500,
    dimensions: "30x40m",
    hasTitleDeed: true,
    zoning: "Commercial",
    location: "Grid Sector 1 Luuliyo, Caabudwaaq",
    region: "1 Luuliyo",
    status: PropertyStatus.Sale,
    bedrooms: 0,
    bathrooms: 0,
    areaSize: 1200,
    images: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-4",
    ownerName: "Khalid Omer (Caabudwaaq Property Bureau)",
    ownerPhone: "+252907432109",
    ownerWhatsapp: "252907432109",
    approved: true,
    featured: false,
    createdAt: "2026-05-10T16:00:00Z"
  },
  {
    id: "prop-7",
    title: "Highly Convenient Family Duplex in Horseed",
    description: "Very secure luxury 4-bedroom duplex home, located just off the primary street of Horseed, Caabudwaaq. It is brand new and features high-spec bathrooms, bright wardrobes, family dining area, private solar energy integration, and spacious parking courtyard with high-gated walls.",
    category: PropertyCategory.House,
    type: "Residential",
    price: 400,
    location: "Xaafadda Horseed, Caabudwaaq",
    region: "Horseed",
    status: PropertyStatus.Rent,
    bedrooms: 4,
    bathrooms: 3,
    areaSize: 220,
    images: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-2",
    ownerName: "Sarah Yusuf (Horn Property Group)",
    ownerPhone: "+252634987654",
    ownerWhatsapp: "252634987654",
    approved: true,
    featured: true,
    createdAt: "2026-06-05T12:00:00Z",
    availableDate: "2026-06-18"
  },
  {
    id: "prop-8",
    title: "Modern Premium Commercial Office Space",
    description: "Newly renovated commercial building tailored for corporate offices, located in the prominent Amaana district of Caabudwaaq. Offers multi-workspace layout, high-wall protection perimeters, automated solar power system, water storage tanks, and robust secure gates suitable for business offices.",
    category: PropertyCategory.Commercial,
    type: "Commercial",
    price: 800,
    numShops: 8,
    hasParking: true,
    location: "Office Zone, Amaana, Caabudwaaq",
    region: "Amaana",
    status: PropertyStatus.Rent,
    bedrooms: 0,
    bathrooms: 4,
    areaSize: 340,
    images: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-2",
    ownerName: "Sarah Yusuf (Horn Property Group)",
    ownerPhone: "+252634987654",
    ownerWhatsapp: "252634987654",
    approved: true,
    featured: false,
    createdAt: "2026-06-02T15:30:00Z",
    availableDate: "2026-07-01"
  },
  {
    id: "prop-car-1",
    title: "Toyota Land Cruiser V8 (Full Option)",
    description: "Beautifully maintained, pristine Toyota Land Cruiser V8 in luxury white finish. Perfect suspension for local Galgaduud terrains, high-grade leather seating, automated sunroof, clean interior features, and direct ownership papers ready. Vetted directly by local coordinators.",
    category: PropertyCategory.CarSale,
    type: "Vehicle",
    price: 38000,
    location: "Horseed District, Caabudwaaq",
    region: "Horseed",
    status: PropertyStatus.Sale,
    bedrooms: 0,
    bathrooms: 0,
    areaSize: 0,
    images: [
      "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1494976388531-d1058094e2fd?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-1",
    ownerName: "Daud Farah (Caabudwaaq Coordinator)",
    ownerPhone: "+252615123456",
    ownerWhatsapp: "252615123456",
    approved: true,
    featured: true,
    createdAt: "2026-06-12T10:00:00Z",
    carMake: "Toyota",
    carModel: "Land Cruiser V8",
    carYear: 2020,
    carTransmission: "Automatic",
    carFuelType: "Petrol",
    carMileage: 42000
  },
  {
    id: "prop-car-2",
    title: "Toyota Hilux Double Cabin 4x4",
    description: "Heavy-duty Toyota Hilux Double Cabin pickup truck. Automatic 4WD toggle, high performance diesel engine, heavy towing pack included. Ideal for regional transport, secure cargo bay, and excellent fuel efficiency. Directly authenticated with municipal registry.",
    category: PropertyCategory.CarSale,
    type: "Vehicle",
    price: 24500,
    location: "October main road, Caabudwaaq",
    region: "October",
    status: PropertyStatus.Sale,
    bedrooms: 0,
    bathrooms: 0,
    areaSize: 0,
    images: [
      "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1200&q=80"
    ],
    ownerId: "user-agent-2",
    ownerName: "Sarah Yusuf (Horn Property Group)",
    ownerPhone: "+252634987654",
    ownerWhatsapp: "252634987654",
    approved: true,
    featured: false,
    createdAt: "2026-06-13T12:30:00Z",
    carMake: "Toyota",
    carModel: "Hilux Double Cabin",
    carYear: 2018,
    carTransmission: "Manual",
    carFuelType: "Diesel",
    carMileage: 89000
  }
];

export const SAMPLE_TESTIMONIALS: Testimonial[] = [
  {
    id: "test-1",
    name: "Ahmed Duale",
    role: "Returning Diaspora Buyer (US)",
    comment: "Kireeye completely changed how my family settled back home in Caabudwaaq! The neighborhood filtering for October was incredibly accurate, and contacting the property manager through WhatsApp was instant. Highly professional, locally responsive service.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: "test-2",
    name: "Filsan Haji",
    role: "Business Developer, Caabudwaaq",
    comment: "Listing my commercial shops and depots on this hub gave me quality corporate leads in weeks! The dashboard allows me to manage properties effortlessly and see active inquiries instantly. Absolute gold standard for real estate portals in central Somalia.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80",
    rating: 5
  },
  {
    id: "test-3",
    name: "Dr. Liban Abdi",
    role: "Clinic Coordinator, Caabudwaaq",
    comment: "I searched for secure development plots in 1 Luuliyo neighborhood for months with no luck. Then I found a certified listing with perfect boundary details on this hub. Within three hours I was in direct contact with the owner.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
    rating: 5
  }
];

export const SAMPLE_FAQS: FAQItem[] = [
  {
    id: "faq-1",
    question: "How do I secure property ownership and register my land deeds in Caabudwaaq?",
    answer: "For properties in Caabudwaaq, transfers are registered and audited with the Caabudwaaq Municipality Land Department and validated by the primary courts of the Galgaduud region. Our registered local agencies and coordinators listed on the platform can assist you with all necessary legal procedures and deed audits."
  },
  {
    id: "faq-2",
    question: "Do you have options for diaspora buyers wishing to purchase from abroad?",
    answer: "Yes, a massive portion of the properties in Caabudwaaq are listed specifically to cater to returning diaspora families. Through integrated WhatsApp and secure messaging, you can request digital walkthroughs, satellite surveyor coordinates, and authorize local representatives to perform inspections."
  },
  {
    id: "faq-3",
    question: "What security measures exist for residential estates in Caabudwaaq neighborhoods?",
    answer: "Most modern developments in high-demand neighborhoods (such as Waabari, Amaana, or October) boast comprehensive perimeter walling with razor fence protections, 24/7 localized solar street lights, independent clean water borewells, and community coordinating protocols."
  },
  {
    id: "faq-4",
    question: "How do rental payments work, and are deposits required?",
    answer: "Typically, rental agreements in Caabudwaaq are negotiated for 6 or 12-month periods, with a standard security deposit of 1 to 2 months. Payments are normally processed via secure mobile payment protocols such as Hormuud EVC Plus or direct bank transfers."
  },
  {
    id: "faq-5",
    question: "Can I list my own properties in Caabudwaaq for free?",
    answer: "Yes! You can register a free account as an Agent or Owner. Registered brokers can list properties instantly, specify neighborhoods, and track inquiries. All new listings are verified by site administrators to ensure safety and prevent duplicate listings."
  }
];

export const SOMALI_REGIONS = ["Horseed", "October", "1 Luuliyo", "Amaana", "Waabari", "Ubax"];

export const SEED_AGENCIES = [
  {
    id: "agency-1",
    name: "Juba Valley Agency",
    email: "juba.valley@agency.so",
    phone: "+252615551234",
    logo: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    location: "Waabari, Caabudwaaq",
    createdAt: new Date("2026-05-01").toISOString()
  },
  {
    id: "agency-2",
    name: "Galgaduud Trust Realty",
    email: "galgaduud.trust@agency.so",
    phone: "+252615555678",
    logo: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    location: "Koonfur, Caabudwaaq",
    createdAt: new Date("2026-05-15").toISOString()
  },
  {
    id: "agency-3",
    name: "Somali Star Brokers",
    email: "somali.star@agency.so",
    phone: "+252615559012",
    logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=120&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    location: "Liido Beach, Mogadishu",
    createdAt: new Date("2026-05-20").toISOString()
  }
];

export const SEED_AGENCY_LOGS = [
  {
    id: "log-1",
    agencyId: "agency-1",
    action: "AUTHORIZED_BROKER",
    targetId: "user-agent-1",
    details: "Authorized new Broker Agent Mohamed Farah for legal title-deed validations.",
    createdAt: new Date("2026-06-01T10:30:00Z").toISOString()
  },
  {
    id: "log-2",
    agencyId: "agency-2",
    action: "VERIFIED_LISTING",
    targetId: "prop-1",
    details: "Audited & verified title deed registration for Caabudwaaq Commercial Block.",
    createdAt: new Date("2026-06-03T14:15:00Z").toISOString()
  },
  {
    id: "log-3",
    agencyId: "agency-1",
    action: "INQUIRY_ROUTED",
    targetId: "inq-1",
    details: "Routed rental inquiry for Waabari Commercial Hub to assigned field agent.",
    createdAt: new Date("2026-06-12T09:00:00Z").toISOString()
  }
];
