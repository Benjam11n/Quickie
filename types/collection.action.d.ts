declare global {
  interface AddToCollectionParams {
    perfumeId: string;
  }

  interface RemoveFromCollectionParams {
    perfumeId: string;
  }

  interface GetCollectionParams {
    userId: string;
  }
}

export {};
