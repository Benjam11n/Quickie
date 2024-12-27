declare global {
  interface AddToCollectionParams {
    perfume: string;
  }

  interface RemoveFromCollectionParams {
    perfume: string;
  }

  interface GetCollectionParams {
    userId: string;
  }
}

export {};
