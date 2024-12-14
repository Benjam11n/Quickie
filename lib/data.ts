import { Product, VendingLocation } from "./types";

export const products: Product[] = [
  {
    id: "midnight-rendezvous",
    name: "Midnight Rendezvous",
    brand: "Quickie Signature",
    price: 129.99,
    description:
      "A seductive affair of dark rose and vanilla bourbon that unfolds like a midnight romance. This intoxicating blend opens with sparkling bergamot and pink pepper, leading to a heart of Bulgarian rose and jasmine, before settling into a warm embrace of vanilla bourbon, amber, and musk.",
    affiliateLink: "https://example.com/affiliate",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=60",
    ],
    categories: ["Evening", "Romantic", "Luxury"],
    notes: {
      top: [
        { name: "Bergamot", percentage: 40 },
        { name: "Pink Pepper", percentage: 30 },
        { name: "Cardamom", percentage: 30 },
      ],
      middle: [
        { name: "Bulgarian Rose", percentage: 45 },
        { name: "Jasmine", percentage: 35 },
        { name: "Iris", percentage: 20 },
      ],
      base: [
        { name: "Vanilla Bourbon", percentage: 40 },
        { name: "Amber", percentage: 35 },
        { name: "Musk", percentage: 25 },
      ],
    },
    scentProfile: {
      intensity: 80,
      longevity: 75,
      sillage: 70,
      versatility: 65,
      uniqueness: 85,
      value: 75,
    },
  },
  {
    id: "ysl-myslf",
    name: "YSL Myslf",
    brand: "Quickie Signature",
    price: 129.99,
    description:
      "A seductive affair of dark rose and vanilla bourbon that unfolds like a midnight romance. This intoxicating blend opens with sparkling bergamot and pink pepper, leading to a heart of Bulgarian rose and jasmine, before settling into a warm embrace of vanilla bourbon, amber, and musk.",
    affiliateLink: "https://example.com/affiliate",
    images: [
      "https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=800&auto=format&fit=crop&q=60",
      "https://images.unsplash.com/photo-1594035910387-fea47794261f?w=800&auto=format&fit=crop&q=60",
    ],
    categories: ["Evening", "Romantic", "Luxury"],
    notes: {
      top: [
        { name: "Bergamot", percentage: 40 },
        { name: "Pink Pepper", percentage: 30 },
        { name: "Cardamom", percentage: 30 },
      ],
      middle: [
        { name: "Bulgarian Rose", percentage: 45 },
        { name: "Jasmine", percentage: 35 },
        { name: "Iris", percentage: 20 },
      ],
      base: [
        { name: "Vanilla Bourbon", percentage: 40 },
        { name: "Amber", percentage: 35 },
        { name: "Musk", percentage: 25 },
      ],
    },
    scentProfile: {
      intensity: 80,
      longevity: 75,
      sillage: 70,
      versatility: 65,
      uniqueness: 85,
      value: 75,
    },
  },
];

export const brands = ["Quickie Signature", "YSL", "Dior", "Chanel"];
export const categories = [
  "Evening",
  "Romantic",
  "Luxury",
  "Fresh",
  "Casual",
  "Sport",
];
export const notes = [
  "Bergamot",
  "Pink Pepper",
  "Cardamom",
  "Bulgarian Rose",
  "Jasmine",
  "Iris",
  "Vanilla Bourbon",
  "Amber",
  "Musk",
];

export const vendingLocations: VendingLocation[] = [
  {
    id: "times-square",
    name: "Times Square Station",
    address: "42nd St & Broadway, New York, NY",
    coordinates: {
      lat: 40.758,
      lng: -73.9855,
    },
    hours: "24/7",
    stockLevel: 12,
    availablePerfumes: [
      { productId: "midnight-rendezvous", quantity: 5 },
      { productId: "ysl-myslf", quantity: 7 },
    ],
  },
  {
    id: "grand-central",
    name: "Grand Central Terminal",
    address: "89 E 42nd St, New York, NY",
    coordinates: {
      lat: 40.7527,
      lng: -73.9772,
    },
    hours: "5:30 AM - 2:00 AM",
    stockLevel: 15,
    availablePerfumes: [
      { productId: "midnight-rendezvous", quantity: 8 },
      { productId: "ysl-myslf", quantity: 7 },
    ],
  },
  {
    id: "hudson-yards",
    name: "Hudson Yards",
    address: "20 Hudson Yards, New York, NY",
    coordinates: {
      lat: 40.7539,
      lng: -74.0024,
    },
    hours: "10:00 AM - 9:00 PM",
    stockLevel: 10,
    availablePerfumes: [
      { productId: "midnight-rendezvous", quantity: 4 },
      { productId: "ysl-myslf", quantity: 6 },
    ],
  },
  {
    id: "world-trade",
    name: "World Trade Center",
    address: "185 Greenwich St, New York, NY",
    coordinates: {
      lat: 40.7127,
      lng: -74.0134,
    },
    hours: "24/7",
    stockLevel: 18,
    availablePerfumes: [
      { productId: "midnight-rendezvous", quantity: 9 },
      { productId: "ysl-myslf", quantity: 9 },
    ],
  },
];
