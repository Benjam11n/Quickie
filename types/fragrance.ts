import { Season, TimeOfDay, Weather } from './enums';

export interface Note {
  _id: string;
  name: string;
  color: string;
  family: string;
  description?: string;
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
  tags: { name: string; count: number };
  notes: {
    top: Note[];
    middle: Note[];
    base: Note[];
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
  uniqueness: number;
  complexity: number;
}

export interface FragranceFilters {
  priceRange: number[];
  brands: string[];
  categories: string[];
  notes: string[];
}
