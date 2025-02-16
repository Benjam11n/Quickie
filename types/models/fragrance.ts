// Basic Types
import { INoteFamilyDoc } from '@/database';

import { Season, TimeOfDay, Weather } from '../enums/enums';

export interface Note {
  _id: string;
  name: string;
  color: string;
  family: INoteFamilyDoc;
  description?: string;
}

export interface NoteHarmony {
  primary: Note;
  complementary: Note[];
  contrasting: Note[];
  strength: number;
}

// Rating and Profile interfaces
export interface ScentProfile {
  intensity: number;
  longevity: number;
  sillage: number;
  versatility: number;
  uniqueness: number;
  value: number;
}

export interface Rating {
  sillage: number;
  longevity: number;
  value: number;
  uniqueness: number;
  complexity: number;
}

export interface RatingDistribution {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
}

// Seasonal and Time-based interfaces
export interface SeasonalRating {
  season: Season;
  rating: number;
  conditions: Weather[];
  timeOfDay: TimeOfDay[];
}

export interface TimelinePoint {
  time: number; // minutes
  intensity: number;
  activeNotes: string[];
  phase: 'top' | 'middle' | 'base';
}

// Characteristic interfaces
export interface FragranceCharacteristic {
  name: string;
  value: number;
  color: string;
  description: string;
}

// Filter interfaces
export interface FragranceFilters {
  priceRange: number[];
  brands: string[];
  tags: string[];
  notes: string[];
}

// Core Perfume interfaces
export interface Perfume {
  _id: string;
  name: string;
  brand: {
    name: string;
  };
  fullPrice: number;
  size: number;
  description: string;
  affiliateLink: string;
  images: string[];
  tags: {
    name: string;
    perfumesCount: number;
  }[];
  notes: {
    top: { note: Note; intensity: number }[];
    middle: { note: Note; intensity: number }[];
    base: { note: Note; intensity: number }[];
  };
  scentProfile: ScentProfile;
  rating: {
    count: number;
    average: number;
    distribution: RatingDistribution;
  };
  seasonalCompatibility: {
    summer: number;
    fall: number;
    winter: number;
    spring: number;
  };
}

export interface PerfumeVisualiser {
  _id: string;
  notes: {
    top: { note: Note; intensity: number }[];
    middle: { note: Note; intensity: number }[];
    base: { note: Note; intensity: number }[];
  };
  timeline: TimelinePoint[];
  seasonal: SeasonalRating[];
  characteristics: FragranceCharacteristic[];
  scentProfile: ScentProfile;
  harmony: NoteHarmony[];
}
