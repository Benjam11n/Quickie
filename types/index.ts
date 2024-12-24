import {
  IMoodBoardDoc,
  WishlistPerfume,
  WishlistPerfumeView,
} from '@/database';

export interface PerfumePosition {
  perfumeId: string; // ObjectId as string
  position: {
    x: number;
    y: number;
  };
}

export interface MoodBoard {
  _id: string; // MongoDB _id as string
  userId: string; // ObjectId as string
  name: string;
  description?: string;
  perfumes: PerfumePosition[];
  tags: string[];
  isPublic: boolean;
  views?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
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

export interface VendingMachineView {
  _id: string;
  id: string;
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    area: string;
  };
  inventory: {
    perfumeId: {
      _id: string;
      id: string;
      name: string;
      brand: string;
      price: number;
      images: string[];
    };
    stock: number;
    lastRefilled: Date;
  }[];
  status: 'active' | 'maintenance' | 'inactive';
  metrics: {
    totalSamples: number;
    popularTimes: Record<string, number>;
  };
  author: string;
}

// Helper function to transform MongoDB doc to client MoodBoard
export function transformToClientBoard(doc: IMoodBoardDoc): MoodBoard {
  return {
    _id: doc._id.toString(),
    userId: doc.author.toString(),
    name: doc.name,
    description: doc.description,
    perfumes: doc.perfumes.map((p) => ({
      perfumeId: p.perfumeId.toString(),
      position: p.position,
    })),
    tags: doc.tags,
    isPublic: doc.isPublic,
    views: doc.views,
    likes: doc.likes,
  };
}

export interface UserView {
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
}

export interface Review {
  _id: string;
  id: string;
  author: string;
  perfumeId: string;
  vendingMachineId?: string;
  rating: {
    sillage: number;
    longevity: number;
    value: number;
    projection: number;
    complexity: number;
  };
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewView {
  _id: string;
  id: string;
  author: string;
  perfumeId: {
    _id: string;
    id: string;
    name: string;
    brand: string;
    images: string[];
    price: number;
  };
  vendingMachineId?: string;
  rating: {
    sillage: number;
    longevity: number;
    value: number;
    projection: number;
    complexity: number;
  };
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Wishlist {
  _id: string;
  id: string;
  name: string;
  author: string;
  perfumes: WishlistPerfume[];
}

export interface WishlistView {
  _id: string;
  id: string;
  name: string;
  author: string;
  perfumes: WishlistPerfumeView[];
}

export interface Collection {
  author: string;
  perfumes: { perfumeId: string; addedAt: Date };
}

export interface CollectionView {
  author: string;
  perfumes: {
    perfumeId: {
      name: string;
      brand: string;
      price: number;
      affiliateLink: string;
      images: string[];
    };
    addedAt: Date;
  }[];
}
