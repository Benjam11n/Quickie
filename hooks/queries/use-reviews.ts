import { useQuery, UseQueryResult } from '@tanstack/react-query';

import {
  getPerfumeReviews,
  getReview,
  getUserReviews,
} from '@/lib/actions/review.action';
import { Review } from '@/types';

export function usePerfumeReviews(perfumeId: string) {
  return useQuery({
    queryKey: ['reviews', 'perfumes', perfumeId],
    queryFn: () => getPerfumeReviews({ perfume: perfumeId }),
    enabled: !!perfumeId, // Only run if we have a perfume
  });
}

export function useReview(
  perfumeId: string,
  userId?: string
): UseQueryResult<ActionResponse<Review>> {
  return useQuery({
    queryKey: ['reviews', perfumeId, userId],
    queryFn: () => getReview({ perfume: perfumeId, userId: userId as string }),
    enabled: !!perfumeId && !!userId,
    refetchOnMount: true,
  });
}

export function useUserReviews(userId?: string) {
  return useQuery({
    queryKey: ['reviews', 'user', userId],
    queryFn: () => getUserReviews({ userId: userId! }),
    enabled: !!userId,
  });
}
