export interface Note {
  name: string;
  percentage: number;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  // TODO
  size?: number;
  description: string;
  affiliateLink: string;
  images: string[];
  categories: string[];
  notes: {
    top: Note[];
    middle: Note[];
    base: Note[];
  };
  scentProfile: {
    intensity: number;
    longevity: number;
    sillage: number;
    versatility: number;
    uniqueness: number;
    value: number;
  };
}

export interface UserPerfume {
  productId: string;
  addedAt: string;
  inCollection: boolean;
  isFavorite: boolean;
  rating?: number;
  review?: string;
}

export interface Position {
  x: number;
  y: number;
}

export interface MoodBoard {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
  tags: string[];
  perfumes: {
    id: string;
    position: Position;
  }[];
  isPublic: boolean;
  shareUrl?: string;
}

export interface VendingLocation {
  id: string;
  name: string;
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  hours: string;
  stockLevel: number;
  availablePerfumes: {
    productId: string;
    quantity: number;
  }[];
}
