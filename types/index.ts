import { IMoodBoardDoc, WishlistPerfume } from '@/database';

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
  likes: number;
  likedBy?: UserView[];
}

export interface Wishlist {
  id: string;
  name: string;
  author: string;
  perfumes: WishlistPerfume[];
}
