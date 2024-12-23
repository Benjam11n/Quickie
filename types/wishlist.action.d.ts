declare global {
  interface CreateWishlistParams {
    name: string;
    perfumes: WishlistPerfume[];
  }

  interface UpdateWishlistParams extends CreateWishlistParams {
    wishlistId: string;
  }

  interface DeleteWishlistParams {
    wishlistId: string;
  }

  interface GetWishlistParams {
    wishlistId: string;
  }

  interface GetWishlistsParams {
    userId: string;
  }

  interface AddToWishlistParams {
    wishlistId;
    perfumeId: string;
    notes?: string;
    priority?: 'low' | 'medium' | 'high';
    priceAlert?: number;
  }

  interface RemoveFromWishlistParams {
    wishlistId;
    perfumeId: string;
  }
}

export {};
