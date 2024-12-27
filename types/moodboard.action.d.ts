import { Position } from '.';

declare global {
  interface CreateMoodBoardParams {
    name: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
  }

  interface UpdateMoodBoardParams extends CreateMoodBoardParams {
    boardId: string;
    // views?: number;
    // likes?: number;
    perfumes?: {
      perfume: string;
      position: Position;
    }[];
  }

  interface UpdatePerfumePositionParams {
    boardId: string;
    perfume: string;
    position: {
      x: number;
      y: number;
    };
  }

  interface GetMoodBoardParams {
    boardId: string;
  }
}

export {};
