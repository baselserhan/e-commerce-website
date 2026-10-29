export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: number;
  reviews: number;
  details: Record<string, string>;
}

export const PRODUCTS: Product[] = [
  {
    id: "headphones",
    name: "AeroSound X1 ANC Headphones",
    price: 299,
    description: "Premium over-ear wireless headphones featuring industry-leading hybrid active noise cancellation, deep audio clarity, custom tuning profiles, and luxurious memory foam ear cushions.",
    category: "Audio",
    image: "/images/headphones.jpg",
    rating: 4.8,
    reviews: 142,
    details: {
      "Driver Size": "40mm Custom Dynamic Drivers",
      "Battery Life": "Up to 45 hours (ANC off), 35 hours (ANC on)",
      "Connectivity": "Bluetooth 5.3 & 3.5mm Wired",
      "Audio Codecs": "AAC, SBC, aptX Adaptive",
      "Weight": "250g",
    }
  },
  {
    id: "keyboard",
    name: "KeyCraft Custom Mechanical Keyboard",
    price: 189,
    description: "An elegant, compact hot-swappable mechanical keyboard featuring a premium solid walnut wood casing, hand-lubed linear switches, custom doubleshot PBT keycaps, and warm amber LED lighting.",
    category: "Workstation",
    image: "/images/keyboard.jpg",
    rating: 4.9,
    reviews: 86,
    details: {
      "Form Factor": "75% Layout (84 Keys)",
      "Switches": "Custom Linear switches (lubed, 45g actuation)",
      "Case Material": "Solid walnut wood top shell, premium ABS bottom shell",
      "Lighting": "Single-color warm amber LED backlighting",
      "Interface": "Detachable USB-C",
    }
  },
  {
    id: "watch",
    name: "Chronos Classic Smartwatch",
    price: 249,
    description: "A seamless combination of classic watch craftsmanship and smart functionality. Features a polished metal bezel, crisp always-on AMOLED screen, full fitness tracking suite, and 7-day battery life.",
    category: "Wearables",
    image: "/images/watch.jpg",
    rating: 4.7,
    reviews: 219,
    details: {
      "Display": "1.43-inch Always-on AMOLED (466x466 px)",
      "Strap Material": "Genuine Italian Calfskin Leather",
      "Water Resistance": "5 ATM (Up to 50 meters)",
      "Sensors": "Heart Rate, SpO2, Accelerometer, Gyroscope, GPS",
      "Compatibility": "iOS & Android",
    }
  },
  {
    id: "lamp",
    name: "Aura Minimalist LED Desk Lamp",
    price: 120,
    description: "A striking minimalist desk lamp with an elegant curved neck. Provides flicker-free lighting with stepless dimming and warm temperature control to reduce eye strain and set the perfect mood.",
    category: "Workstation",
    image: "/images/lamp.jpg",
    rating: 4.6,
    reviews: 64,
    details: {
      "Light Source": "Stepless dimming flicker-free LED",
      "Color Temp": "Warm to cool (2700K - 6500K)",
      "Max Brightness": "800 Lumens",
      "Material": "Anodized Aerospace Aluminum",
      "Power": "USB-C Powered (15W)",
    }
  }
];

// Helper to get products with localStorage persistence (fallback to hardcoded on server)
export const getLocalProducts = (): Product[] => {
  if (typeof window === 'undefined') return PRODUCTS;
  const stored = localStorage.getItem('luxura-products');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error parsing custom products', e);
    }
  } else {
    localStorage.setItem('luxura-products', JSON.stringify(PRODUCTS));
  }
  return PRODUCTS;
};

// Helper to save products
export const saveLocalProducts = (list: Product[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('luxura-products', JSON.stringify(list));
  }
};
