export interface CollectionPerfume {
  perfume: {
    _id: string;
    id: string;
    name: string;
    brand: { name: string };
    fullPrice: number;
    affiliateLink: string;
    images: string[];
  };
  addedAt: Date;
}

export interface Collection {
  author: string;
  perfumes: CollectionPerfume[];
}
