import { create } from 'zustand';

import { Review } from '@/types';
import { Perfume, Rating, RatingDistribution } from '@/types/models/fragrance';

interface ReviewState {
  rating: Rating;
  review: string;
  ratingDistribution: RatingDistribution;
  ratingsCount: number;
  ratingsAverage: number;
  setRating: (rating: ReviewState['rating']) => void;
  setReview: (review: string) => void;
  reset: () => void;
  initializeFromReview: (review: Review | undefined) => void;
  initializeFromPerfume: (perfume: Perfume | undefined) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  rating: {
    sillage: 0,
    longevity: 0,
    value: 0,
    uniqueness: 0,
    complexity: 0,
  },
  ratingDistribution: {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  },
  ratingsCount: 0,
  ratingsAverage: 0,
  review: '',
  setRating: (rating) => set({ rating }),
  setReview: (review) => set({ review }),
  reset: () =>
    set({
      rating: {
        sillage: 0,
        longevity: 0,
        value: 0,
        uniqueness: 0,
        complexity: 0,
      },
      review: '',
    }),
  initializeFromReview: (review) => {
    if (review) {
      set({
        rating: review.rating,
        review: review.review || '',
      });
    }
  },
  initializeFromPerfume: (perfume) => {
    if (perfume) {
      set({
        ratingDistribution: perfume.rating.distribution,
        ratingsCount: perfume.rating.count,
        ratingsAverage: perfume.rating.average,
      });
    }
  },
}));
