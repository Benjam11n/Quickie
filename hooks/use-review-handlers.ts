import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
import { toast } from 'sonner';

import {
  createReview,
  updateReview,
  deleteReview,
  handleReviewInteraction,
} from '@/lib/actions/review.action';
import { Review } from '@/types';
import { Perfume } from '@/types/fragrance';

interface UseReviewHandlersProps {
  product: Perfume;
  review?: Review;
  router: AppRouterInstance;
}

export function useReviewHandlers({
  product,
  review,
  router,
}: UseReviewHandlersProps) {
  const handleReviewSubmit = async (formData: CreateReviewParams) => {
    try {
      let result;
      if (review) {
        result = await updateReview({
          perfumeId: product._id,
          rating: formData.rating,
          review: formData.review,
          reviewId: review._id,
        });
      } else {
        result = await createReview({
          perfumeId: product._id,
          rating: formData.rating,
          review: formData.review,
        });
      }

      if (result.success) {
        toast.success(review ? 'Review Updated' : 'Review Created', {
          description: review
            ? 'Your review has been updated successfully'
            : 'Review created successfully',
        });
        router.refresh();
      } else {
        handleError(result.error?.message);
      }
    } catch {
      toast.error('Error', { description: 'Failed to submit review' });
    }
  };

  const handleReviewDelete = async () => {
    if (!review) {
      toast.error('No Review', { description: 'No review found to delete' });
      return;
    }

    try {
      const result = await deleteReview({ reviewId: review._id });
      if (result.success) {
        toast.success('Review Deleted', {
          description: 'Your review has been deleted successfully',
        });
        router.refresh();
      } else {
        handleError(result.error?.message);
      }
    } catch {
      toast.error('Error', { description: 'Failed to delete review' });
    }
  };

  const handleInteraction = async ({
    type,
  }: {
    type: 'like' | 'dislike' | 'share' | 'report';
  }) => {
    if (!review) {
      toast.error('No Review', { description: 'No review found to like' });
      return;
    }

    try {
      const result = await handleReviewInteraction({
        reviewId: review._id,
        type,
      });
      if (result.success) {
        toast.success(
          `Review ${type === 'like' || type === 'dislike' ? type + 'd' : type + 'ed'}`,
          {
            description: `You successfully ${type === 'like' || type === 'dislike' ? type + 'd' : type + 'ed'} the review`,
          }
        );
        router.refresh();

        return result.data;
      } else {
        handleError(result.error?.message);
      }
    } catch {
      toast.error('Error', { description: 'Something went wrong' });
    }
  };

  const handleError = (message?: string) => {
    if (message === 'You have already reviewed this perfume') {
      toast.error('Already Reviewed', {
        description: 'You have already submitted a review for this perfume',
      });
    } else {
      toast.error('Error', {
        description: message || 'Something went wrong',
      });
    }
  };

  return {
    handleReviewSubmit,
    handleReviewDelete,
    handleInteraction,
  };
}
