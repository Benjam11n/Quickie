import { Season, TimeOfDay, Weather, NoteFamily } from '@/types/enums';
import {
  EnhancedFragrance,
  Note,
  TimelinePoint,
  SeasonalRating,
  NoteHarmony,
  FragranceCharacteristic,
  Product,
} from '@/types/fragrance';

const NOTE_COLORS = {
  [NoteFamily.Citrus]: '#F59E0B',
  [NoteFamily.Floral]: '#EC4899',
  [NoteFamily.Woody]: '#92400E',
  [NoteFamily.Oriental]: '#7C3AED',
  [NoteFamily.Fresh]: '#10B981',
  [NoteFamily.Spicy]: '#EF4444',
  [NoteFamily.Green]: '#34D399',
  [NoteFamily.Aquatic]: '#0EA5E9',
};

function mapNote(name: string, intensity: number, family: NoteFamily): Note {
  return {
    name,
    intensity,
    color: NOTE_COLORS[family],
    family,
  };
}

function generateTimeline(notes: {
  top: Note[];
  middle: Note[];
  base: Note[];
}): TimelinePoint[] {
  const timeline: TimelinePoint[] = [];

  // Top notes (0-30 minutes)
  for (let i = 0; i <= 30; i += 5) {
    timeline.push({
      time: i,
      intensity: Math.max(0, 100 - i * 2),
      activeNotes: notes.top.map((n) => n.name),
      phase: 'top',
    });
  }

  // Middle notes (30-180 minutes)
  for (let i = 35; i <= 180; i += 15) {
    timeline.push({
      time: i,
      intensity: Math.max(0, 80 - (i - 30) / 2),
      activeNotes: [
        ...notes.middle.map((n) => n.name),
        ...notes.base.slice(0, 1).map((n) => n.name),
      ],
      phase: 'middle',
    });
  }

  // Base notes (180+ minutes)
  for (let i = 195; i <= 480; i += 30) {
    timeline.push({
      time: i,
      intensity: Math.max(0, 60 - (i - 180) / 8),
      activeNotes: notes.base.map((n) => n.name),
      phase: 'base',
    });
  }

  return timeline;
}

function generateSeasonalRatings(product: Product): SeasonalRating[] {
  const { scentProfile } = product;

  return [
    {
      season: Season.Spring,
      rating: Math.min(
        100,
        (scentProfile.versatility + scentProfile.uniqueness) / 2
      ),
      conditions: [Weather.Sunny, Weather.Rainy],
      timeOfDay: [TimeOfDay.Morning, TimeOfDay.Afternoon],
    },
    {
      season: Season.Summer,
      rating: Math.min(
        100,
        (scentProfile.sillage + scentProfile.longevity) / 2
      ),
      conditions: [Weather.Hot, Weather.Sunny],
      timeOfDay: [TimeOfDay.Morning, TimeOfDay.Evening],
    },
    {
      season: Season.Fall,
      rating: Math.min(100, (scentProfile.uniqueness + scentProfile.value) / 2),
      conditions: [Weather.Cloudy, Weather.Cold],
      timeOfDay: [TimeOfDay.Afternoon, TimeOfDay.Evening],
    },
    {
      season: Season.Winter,
      rating: Math.min(
        100,
        (scentProfile.intensity + scentProfile.longevity) / 2
      ),
      conditions: [Weather.Cold, Weather.Snowy],
      timeOfDay: [TimeOfDay.Afternoon, TimeOfDay.Night],
    },
  ];
}

function generateNoteHarmony(notes: {
  top: Note[];
  middle: Note[];
  base: Note[];
}): NoteHarmony[] {
  const allNotes = [...notes.top, ...notes.middle, ...notes.base];

  return allNotes.map((note) => ({
    primary: note,
    complementary: allNotes
      .filter((n) => n.name !== note.name && n.family === note.family)
      .slice(0, 2),
    contrasting: allNotes
      .filter((n) => n.name !== note.name && n.family !== note.family)
      .slice(0, 2),
    strength: note.intensity,
  }));
}

function generateCharacteristics(product: Product): FragranceCharacteristic[] {
  const { scentProfile } = product;

  return [
    {
      name: 'Intensity',
      value: scentProfile.intensity,
      color: '#EF4444',
      description: 'Overall strength of the fragrance',
    },
    {
      name: 'Longevity',
      value: scentProfile.longevity,
      color: '#8B5CF6',
      description: 'How long the scent lasts',
    },
    {
      name: 'Sillage',
      value: scentProfile.sillage,
      color: '#10B981',
      description: 'How far the fragrance projects',
    },
    {
      name: 'Uniqueness',
      value: scentProfile.uniqueness,
      color: '#F59E0B',
      description: 'How distinctive the fragrance is',
    },
  ];
}

export function mapProductToEnhancedFragrance(
  product: Product
): EnhancedFragrance {
  // Map notes with colors and families
  const mappedNotes = {
    top: product.notes.top.map((n) =>
      mapNote(n.name, n.percentage, NoteFamily.Fresh)
    ),
    middle: product.notes.middle.map((n) =>
      mapNote(n.name, n.percentage, NoteFamily.Floral)
    ),
    base: product.notes.base.map((n) =>
      mapNote(n.name, n.percentage, NoteFamily.Woody)
    ),
  };

  return {
    id: product.id,
    name: product.name,
    brand: product.brand,
    notes: mappedNotes,
    timeline: generateTimeline(mappedNotes),
    seasonal: generateSeasonalRatings(product),
    harmony: generateNoteHarmony(mappedNotes),
    characteristics: generateCharacteristics(product),
    scentProfile: product.scentProfile,
    colorProfile: {
      primary: '#EC4899',
      secondary: '#8B5CF6',
      accent: '#10B981',
    },
  };
}
