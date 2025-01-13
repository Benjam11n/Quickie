import { Rating } from '../models/fragrance';

declare global {
  interface CreateReviewParams {
    perfume: Types.ObjectId;
    vendingMachineId?: Types.ObjectId;
    rating: Rating;
    review?: string;
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
    perfume: string;
    userId: string;
  }

  interface GetUserReviewsParams {
    userId: string;
    sortBy?: string;
    query?: string;
  }

  interface GetPerfumeReviewsParams {
    perfume: string;
  }
}

export {};
