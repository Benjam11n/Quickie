declare global {
  interface CreateReviewParams {
    perfumeId: Types.ObjectId;
    vendingMachineId?: Types.ObjectId;
    rating: {
      sillage: number;
      longevity: number;
      value: number;
      projection: number;
      complexity: number;
    };
    review: string;
  }

  interface UpdateReviewParams extends CreateReviewParams {
    reviewId: string;
  }

  interface GetReviewParams {
    reviewId: string;
  }

  interface GetReviewsParams {
    perfumeId: string;
  }
}

export {};
