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

  interface DeleteReviewParams {
    reviewId: string;
  }

  interface ReviewInteractionParams {
    reviewId: string;
    type: ReviewInteractionType;
  }

  interface getReviewInteractionsParams {
    reviewId: string;
  }

  interface LikeReviewParams {
    reviewId: string;
  }

  interface GetReviewParams {
    perfumeId: string;
    userId: string;
  }

  interface GetUserReviewsParams {
    userId: string;
  }

  interface GetPerfumeReviewsParams {
    perfumeId: string;
  }
}

export {};
