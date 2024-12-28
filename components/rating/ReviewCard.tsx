'use client';

import { motion } from 'framer-motion';
import isEqual from 'lodash/isEqual';
import { ThumbsUp, ThumbsDown, Loader2 } from 'lucide-react';
import { useEffect, useMemo } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { useReviewMutations } from '@/hooks/mutations/use-review-mutations';
import { useReviewInteractions } from '@/hooks/queries/use-review-interactions';
import { useReviewStore } from '@/hooks/stores/use-review-store';
import { cn } from '@/lib/utils';
import { ReviewInteractionType, ReviewView } from '@/types';

import { RatingDistribution } from './RatingDistribution';
import { RatingMetrics } from './RatingMetrics';
import { AuthCheck } from '../auth/AuthCheck';
import ConfirmationDialog from '../ConfirmationDialog';

interface ReviewCardProps {
  perfumeId: string;
  initialReview?: ReviewView;
}

export function ReviewCard({ perfumeId, initialReview }: ReviewCardProps) {
  // Review zustand store
  const { reset, rating, review, setRating, setReview } = useReviewStore();

  // Review mutation methods
  const { submitReview, deleteReview, interactionMutation } =
    useReviewMutations(perfumeId, initialReview);

  // Review fetching
  const { data: interactionsResponse } = useReviewInteractions(
    initialReview?._id
  );
  const interactions = interactionsResponse?.data;

  useEffect(() => {
    useReviewStore.getState().initializeFromReview(initialReview);
  }, [initialReview]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [perfumeId, reset]);

  const hasChanges = useMemo(() => {
    if (!initialReview) return true;
    return (
      !isEqual(rating, initialReview.rating) || review !== initialReview.review
    );
  }, [rating, review, initialReview]);

  const isComplete = useMemo(
    () => Object.values(rating).every((value) => value > 0),
    [rating]
  );

  const calculateOverallScore = () => {
    return (
      Object.entries(rating).reduce((sum, [, value]) => {
        return sum + value;
      }, 0) / 5
    ).toFixed(1);
  };

  const isLoading =
    submitReview.isPending ||
    deleteReview.isPending ||
    interactionMutation.isPending;
  const isUpdate = Boolean(initialReview);
  const canUpdate = !isLoading && isComplete && (isUpdate ? hasChanges : true);

  return (
    <Card className={cn('space-y-8 p-6')}>
      {/* Header with Overall Score */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-4xl font-bold text-transparent">
              {calculateOverallScore()}
            </span>
            <span className="text-sm text-muted-foreground">/ 5.0</span>
          </div>
          <p className="text-sm text-muted-foreground">Overall Score</p>
        </div>

        {isUpdate && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                interactionMutation.mutate({
                  type: 'like' as ReviewInteractionType,
                })
              }
            >
              <ThumbsUp className="size-4" />
              <span>{interactions?.like || 0}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() =>
                interactionMutation.mutate({
                  type: 'dislike' as ReviewInteractionType,
                })
              }
            >
              <ThumbsDown className="size-4" />
              <span>{interactions?.dislike || 0}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Rating Metrics */}
      <RatingMetrics
        rating={rating}
        onChange={(rating) => {
          setRating(rating);
        }}
      />

      {/* Review Text Area */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Review</label>
        <Textarea
          placeholder="Share your thoughts about this fragrance..."
          value={review}
          onChange={(e) => {
            setReview(e.target.value);
          }}
          className="resize-none"
          rows={4}
        />
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="space-x-2"
        >
          <AuthCheck>
            <Button
              onClick={() =>
                submitReview.mutate({
                  perfume: perfumeId,
                  rating,
                  review,
                })
              }
              disabled={!canUpdate}
            >
              {isLoading && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isUpdate ? 'Update Review' : 'Submit Rating'}
            </Button>
          </AuthCheck>
          {isUpdate && (
            <ConfirmationDialog
              trigger={
                <Button variant="destructive" className="gap-2">
                  Delete
                </Button>
              }
              item="review"
              onConfirm={() => {
                deleteReview.mutate();
                reset();
              }}
            />
          )}
        </motion.div>
      </div>

      <RatingDistribution />
    </Card>
  );
}
