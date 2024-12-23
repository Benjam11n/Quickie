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
    type: 'like' | 'dislike' | 'share' | 'report';
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

  interface GetReviewsParams {
    perfumeId: string;
  }
}

export {};
