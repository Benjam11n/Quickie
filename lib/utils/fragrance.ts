import { Season, TimeOfDay, Weather } from '@/types/enums/enums';
import {
  PerfumeVisualiser,
  Note,
  TimelinePoint,
  SeasonalRating,
  NoteHarmony,
  FragranceCharacteristic,
  Perfume,
} from '@/types/models/fragrance';

function generateTimeline(notes: {
  top: { note: Note; intensity: number }[];
  middle: { note: Note; intensity: number }[];
  base: { note: Note; intensity: number }[];
}): TimelinePoint[] {
  const timeline: TimelinePoint[] = [];

  // Top notes (0-30 minutes)
  for (let i = 0; i <= 30; i += 5) {
    timeline.push({
      time: i,
      intensity: Math.max(0, 100 - i * 2),
      activeNotes: notes.top.map((n) => n.note.name),
      phase: 'top',
    });
  }

  // Middle notes (30-180 minutes)
  for (let i = 35; i <= 180; i += 15) {
    timeline.push({
      time: i,
      intensity: Math.max(0, 80 - (i - 30) / 2),
      activeNotes: [
        ...notes.middle.map((n) => n.note.name),
        ...notes.base.slice(0, 1).map((n) => n.note.name),
      ],
      phase: 'middle',
    });
  }

  // Base notes (180+ minutes)
  for (let i = 195; i <= 480; i += 30) {
    timeline.push({
      time: i,
      intensity: Math.max(0, 60 - (i - 180) / 8),
      activeNotes: notes.base.map((n) => n.note.name),
      phase: 'base',
    });
  }

  return timeline;
}

function generateSeasonalRatings(product: Perfume): SeasonalRating[] {
  const { seasonalCompatibility } = product;

  return [
    {
      season: Season.Spring,
      rating: seasonalCompatibility.spring,
      conditions: [Weather.Sunny, Weather.Rainy],
      timeOfDay: [TimeOfDay.Morning, TimeOfDay.Afternoon],
    },
    {
      season: Season.Summer,
      rating: seasonalCompatibility.summer,
      conditions: [Weather.Hot, Weather.Sunny],
      timeOfDay: [TimeOfDay.Morning, TimeOfDay.Evening],
    },
    {
      season: Season.Fall,
      rating: seasonalCompatibility.fall,
      conditions: [Weather.Cloudy, Weather.Cold],
      timeOfDay: [TimeOfDay.Afternoon, TimeOfDay.Evening],
    },
    {
      season: Season.Winter,
      rating: seasonalCompatibility.winter,
      conditions: [Weather.Cold, Weather.Snowy],
      timeOfDay: [TimeOfDay.Afternoon, TimeOfDay.Night],
    },
  ];
}

function generateNoteHarmony(notes: {
  top: { note: Note; intensity: number }[];
  middle: { note: Note; intensity: number }[];
  base: { note: Note; intensity: number }[];
}): NoteHarmony[] {
  const allNotes = [...notes.top, ...notes.middle, ...notes.base];

  return allNotes.map((note) => ({
    primary: note.note,
    complementary: allNotes
      .filter(
        (n) =>
          n.note?.name !== note.note?.name &&
          n.note?.family._id === note.note.family._id
      )
      .slice(0, 2)
      .map((n) => n.note),
    contrasting: allNotes
      .filter(
        (n) =>
          n.note?.name !== note.note?.name &&
          n.note?.family._id !== note.note.family._id
      )
      .slice(0, 2)
      .map((n) => n.note),
    strength: note.intensity,
  }));
}

function generateCharacteristics(product: Perfume): FragranceCharacteristic[] {
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

export function mapToPerfumeVisualizer(product: Perfume): PerfumeVisualiser {
  return {
    _id: product._id,
    notes: product.notes,
    timeline: generateTimeline(product.notes),
    seasonal: generateSeasonalRatings(product),
    harmony: generateNoteHarmony(product.notes),
    characteristics: generateCharacteristics(product),
    scentProfile: product.scentProfile,
  };
}
