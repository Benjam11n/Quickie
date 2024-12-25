import { useQuery } from '@tanstack/react-query';

import {
  getPerfumeReviews,
  getReview,
  getUserReviews,
} from '@/lib/actions/review.action';

export function usePerfumeReviews(perfumeId: string) {
  return useQuery({
    queryKey: ['reviews', 'perfumes', perfumeId],
    queryFn: () => getPerfumeReviews({ perfumeId }),
    enabled: !!perfumeId, // Only run if we have a perfumeId
  });
}

export function useReview(perfumeId: string, userId?: string) {
  return useQuery({
    queryKey: ['reviews', perfumeId, userId],
    queryFn: () => getReview({ perfumeId, userId: userId as string }),
    enabled: !!perfumeId && !!userId,
  });
}

export function useUserReviews(userId: string) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => getUserReviews({ userId }),
    enabled: !!userId,
  });
}
