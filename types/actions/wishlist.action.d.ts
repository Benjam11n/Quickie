declare global {
  interface CreateWishlistParams {
    name: string;
    description?: string;
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

  interface GetUserWishlistsParams {
    userId: string;
  }

  interface AddToWishlistParams {
    wishlistId;
    perfume: string;
    priority?: 'low' | 'medium' | 'high';
  }

  interface RemoveFromWishlistParams {
    wishlistId;
    perfume: string;
  }
}

export {};
