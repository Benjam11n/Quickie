export interface PerfumePosition {
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
  author: { _id: string; username: string };
  name: string;
  description?: string;
  perfumes: PerfumePosition[];
  tags: string[];
  isPublic: boolean;
  views?: number;
  likes?: number;
  createdAt?: string;
  updatedAt?: string;
  dimensions: BoardDimensions;
}
