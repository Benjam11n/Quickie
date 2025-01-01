import { BoardDimensions, Position } from '.';

declare global {
  interface CreateMoodBoardParams {
    name: string;
    description?: string;
    tags?: string[];
    isPublic?: boolean;
  }

  interface UpdateMoodBoardParams extends CreateMoodBoardParams {
    dimensions: BoardDimensions;
    boardId: string;
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
