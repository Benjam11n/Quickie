import { Position } from '.';

interface SignInWithOAuthParams {
  provider: 'github' | 'google';
  providerAccountId: string;
  user: {
    email: string;
    name: string;
    image: string;
    username: string;
  };
}

interface AuthCredentials {
  name: string;
  username: string;
  email: string;
  password: string;
}

interface CreatePerfumeParams {
  name: string;
  brand: Types.ObjectId;
  description: string;
  affiliateLink: string;
  images: string[];
  notes: {
    top: Types.ObjectId[];
    middle: Types.ObjectId[];
    base: Types.ObjectId[];
  };
  scentProfile: {
    intensity: number;
    longevity: number;
    sillage: number;
    versatility: number;
    uniqueness: number;
    value: number;
  };
  fullPrice: number;
  tags: Types.ObjectId[];
}

interface UpdatePerfumeParams extends CreatePerfumeParams {
  perfumeId: string;
}

interface GetPerfumeParams {
  perfumeId: string;
}

interface CreateMoodBoardParams {
  name: string;
  description?: string;
  tags?: string[];
  isPublic?: boolean;
}

interface UpdateMoodBoardParams extends CreateMoodBoardParams {
  boardId: string;
  views?: number;
  likes?: number;
  perfumes?: {
    perfumeId: string;
    position: Position;
  }[];
}

interface UpdatePerfumePositionParams {
  boardId: string;
  perfumeId: string;
  position: {
    x: number;
    y: number;
  };
}

interface GetMoodBoardParams {
  boardId: string;
}
