declare global {
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
}

export {};
