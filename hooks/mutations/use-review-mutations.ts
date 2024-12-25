import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  createReview,
  updateReview,
  deleteReview as deleteReviewAction,
  handleReviewInteraction,
} from '@/lib/actions/review.action';
import { ReviewInteractionType, ReviewView } from '@/types';

export function useReviewMutations(perfumeId: string, review?: ReviewView) {
  const queryClient = useQueryClient();

  const submitReview = useMutation({
    mutationFn: async (data: CreateReviewParams) => {
      const result = review
        ? await updateReview({ ...data, reviewId: review._id })
        : await createReview(data);

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success(review ? 'Review Updated' : 'Review Created', {
        description: review
          ? 'Your review has been updated successfully!'
          : 'Review created successfully!',
      });
      queryClient.invalidateQueries({
        queryKey: ['reviews', perfumeId],
      });
    },
    onError: (error) => {
      if (error.message === 'You have already reviewed this perfume') {
        toast.error('Already Reviewed', {
          description: 'You have already submitted a review for this perfume!',
        });
      } else {
        toast.error('Error', {
          description: error.message || 'An unexpected error occurred',
        });
      }
    },
  });

  const deleteReview = useMutation({
    mutationFn: async () => {
      const result = await deleteReviewAction({ reviewId: review!._id });

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data;
    },
    onSuccess: () => {
      toast.success('Review Deleted', {
        description: 'Your review has been deleted successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['reviews', perfumeId] });
    },
    onError: () => {
      toast.error('Error', {
        description: 'Failed to delete review',
      });
    },
  });

  const interactionMutation = useMutation({
    mutationFn: async ({ type }: { type: ReviewInteractionType }) => {
      const result = await handleReviewInteraction({
        reviewId: review!._id,
        type,
      });

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data;
    },
    onSuccess: (_, { type }) => {
      toast.success(
        `Review ${type === 'like' || type === 'dislike' ? type + 'd' : type + 'ed'}`,
        {
          description: `You successfully ${
            type === 'like' || type === 'dislike' ? type + 'd' : type + 'ed'
          } the review`,
        }
      );
      queryClient.invalidateQueries({
        queryKey: ['reviews', 'interactions', review?._id],
      });
    },
    onError: () => {
      toast.error('Error', {
        description: 'Something went wrong',
      });
    },
  });

  return {
    submitReview,
    deleteReview,
    interactionMutation,
  };
}
