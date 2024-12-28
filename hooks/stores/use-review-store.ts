import { create } from 'zustand';

import { ReviewView } from '@/types';
import { Rating } from '@/types/fragrance';

interface ReviewState {
  rating: Rating;
  review: string;
  setRating: (rating: ReviewState['rating']) => void;
  setReview: (review: string) => void;
  reset: () => void;
  initializeFromReview: (review: ReviewView | undefined) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  rating: {
    sillage: 0,
    longevity: 0,
    value: 0,
    uniqueness: 0,
    complexity: 0,
  },
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
}));
