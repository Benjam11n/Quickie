export interface CollectionPerfume {
  perfume: {
    _id: string;
    id: string;
    name: string;
    brand: { name: string };
    fullPrice: number;
    affiliateLink: string;
    images: string[];
    notes: {
      top: [{ note: { _id: string; name: string }; intensity: number }];
      middle: [{ note: { _id: string; name: string }; intensity: number }];
      base: [{ note: { _id: string; name: string }; intensity: number }];
    };
    rating: {
      average: number;
      count: number;
    };
  };
  addedAt: Date;
}

export interface Collection {
  author: string;
  perfumes: CollectionPerfume[];
}
