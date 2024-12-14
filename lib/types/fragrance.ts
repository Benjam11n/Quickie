import { Season, TimeOfDay, Weather } from "./enums";

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
  phase: "top" | "middle" | "base";
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
  harmony: NoteHarmony[];
  colorProfile: {
    primary: string;
    secondary: string;
    accent: string;
  };
}
