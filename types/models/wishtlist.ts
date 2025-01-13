export interface WishlistPerfumeView {
  perfume: {
    _id: string;
    name: string;
    brand: { name: string };
    fullPrice: number;
    images: string[];
    affiliateLink: string;
    rating: {
      average: number;
      count: number;
    };
  };
  priority?: 'low' | 'medium' | 'high';
  priceAlert?: number;
  addedAt: Date;
}

export interface Wishlist {
  _id: string;
  id: string;
  name: string;
  description: string;
  author: string;
  perfumes: WishlistPerfumeView[];
}
