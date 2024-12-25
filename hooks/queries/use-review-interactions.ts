import { useQuery } from '@tanstack/react-query';

import { getReviewInteractions } from '@/lib/actions/review.action';

export function useReviewInteractions(reviewId?: string) {
  return useQuery({
    queryKey: ['reviews', 'interactions', reviewId],
    queryFn: () => getReviewInteractions({ reviewId: reviewId! }),
    enabled: !!reviewId,
  });
}
