/* eslint-disable no-unused-vars */
import { WishlistPerfume, WishlistPerfumeView } from '@/database';

import { Rating } from './fragrance';

export interface PerfumePosition {
  perfume: string;
  position: {
    x: number;
    y: number;
  };
}

export interface PerfumePositionView {
  perfume: { _id: string; name: string; images: string[] };
  position: {
    x: number;
    y: number;
  };
}

export type BoardLayout = 'grid3x3' | 'grid2x4' | 'grid4x2' | 'pinterest';

export interface BoardDimensions {
  layout: BoardLayout;
  cols: number;
  rows: number;
}

export interface MoodBoard {
  _id: string;
  author: string;
  name: string;
  description?: string;
  perfumes: PerfumePosition[];
  tags: string[];
  isPublic: boolean;
  views?: number;
  likes?: number;
  createdAt: string;
  updatedAt: string;
  dimensions: BoardDimensions;
}

export interface MoodBoardView {
  _id: string;
  author: { _id: string; username: string };
  name: string;
  description?: string;
  perfumes: PerfumePositionView[];
  tags: string[];
  isPublic: boolean;
  views?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
  dimensions: BoardDimensions;
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
  location: {
    type: 'Point';
    coordinates: [number, number];
    address: string;
    area: string;
  };
  inventory: {
    perfume: {
      _id: string;
      id: string;
      name: string;
      brand: { _id: string; name: string };
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
  perfume: string;
  vendingMachineId?: string;
  rating: Rating;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ReviewView {
  _id: string;
  id: string;
  author: string;
  perfume: {
    _id: string;
    id: string;
    name: string;
    brand: { name: string };
    images: string[];
    price: number;
  };
  vendingMachineId?: string;
  rating: Rating;
  review: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReviewInteractionType {
  Like = 'like',
  Dislike = 'dislike',
  Share = 'share',
  Report = 'report',
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
  description: string;
  author: string;
  perfumes: WishlistPerfumeView[];
}

export interface Collection {
  author: string;
  perfumes: { perfume: string; addedAt: Date };
}

export interface CollectionPerfumeView {
  perfume: {
    _id: string;
    id: string;
    name: string;
    brand: { name: string };
    fullPrice: number;
    affiliateLink: string;
    images: string[];
  };
  addedAt: Date;
}

export interface CollectionView {
  author: string;
  perfumes: CollectionPerfumeView[];
}
