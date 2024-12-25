import { Season, TimeOfDay, Weather } from './enums';

export interface OldNote {
  name: string;
  percentage: number;
}

export interface ScentProfile {
  intensity: number;
  longevity: number;
  sillage: number;
  versatility: number;
  uniqueness: number;
  value: number;
}

export interface Perfume {
  _id: string;
  id: string;
  name: string;
  brand: string;
  price: number;
  size?: number;
  description: string;
  affiliateLink: string;
  images: string[];
  // TODO: Change categories to tags
  // tgas: { name: string; count: number };
  categories?: string[];
  notes: {
    top: OldNote[];
    middle: OldNote[];
    base: OldNote[];
  };
  scentProfile: ScentProfile;
}

export interface PerfumeView {
  _id: string;
  id: string;
  name: string;
  brand: { name: string };
  price: number;
  size?: number;
  description: string;
  affiliateLink: string;
  images: string[];
  // TODO: Change categories to tags
  // tgas: { name: string; count: number };
  categories?: string[];
  notes: {
    top: OldNote[];
    middle: OldNote[];
    base: OldNote[];
  };
  scentProfile: ScentProfile;
}

export interface UserPerfume {
  productId: string;
  addedAt: string;
  inCollection: boolean;
  isFavorite: boolean;
  rating?: number;
  review?: string;
}

export interface Note {
  name: string;
  intensity: number;
  color: string;
  family: string;
  description?: string;
}

export interface TimelinePoint {
  time: number; // minutes
  intensity: number;
  activeNotes: string[];
  phase: 'top' | 'middle' | 'base';
}

export interface SeasonalRating {
  season: Season;
  rating: number;
  conditions: Weather[];
  timeOfDay: TimeOfDay[];
}

export interface NoteHarmony {
  primary: Note;
  complementary: Note[];
  contrasting: Note[];
  strength: number;
}

export interface FragranceCharacteristic {
  name: string;
  value: number;
  color: string;
  description: string;
}

export interface EnhancedFragrance {
  _id: string;
  id: string;
  name: string;
  brand: string;
  notes: {
    top: Note[];
    middle: Note[];
    base: Note[];
  };
  timeline: TimelinePoint[];
  seasonal: SeasonalRating[];
  characteristics: FragranceCharacteristic[];
  scentProfile: ScentProfile;
  harmony: NoteHarmony[];
  colorProfile: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

export interface Rating {
  sillage: number;
  longevity: number;
  value: number;
  projection: number;
  complexity: number;
}

export interface FragranceFilters {
  priceRange: number[];
  brands: string[];
  categories: string[];
  notes: string[];
}
