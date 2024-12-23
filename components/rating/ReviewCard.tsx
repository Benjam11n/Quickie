'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Review } from '@/types';

import { RatingDistribution } from './RatingDistribution';
import { RatingMetrics } from './RatingMetrics';

interface ReviewCardProps {
  productId: string;
  initialRating?: Review;
  onSubmit: (rating: CreateReviewParams) => void;
  onDelete: () => void;
  onLike: () => void;
  onDislike: () => void;
  className?: string;
}

export function ReviewCard({
  productId,
  initialRating,
  onSubmit,
  onDelete,
  onLike,
  onDislike,
  className,
}: ReviewCardProps) {
  const [rating, setRating] = useState({
    sillage: initialRating?.rating?.sillage || 0,
    longevity: initialRating?.rating?.longevity || 0,
    value: initialRating?.rating?.value || 0,
    projection: initialRating?.rating?.projection || 0,
    complexity: initialRating?.rating?.complexity || 0,
  });
  const [review, setReview] = useState(initialRating?.review || '');
  const [likes, setLikes] = useState(initialRating?.likes || 0);
  const [dislikes, setDislikes] = useState(initialRating?.dislikes || 0);

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating.rating);
      setReview(initialRating.review || '');
      setLikes(initialRating.likes);
      setDislikes(initialRating.dislikes);
    }
  }, [initialRating]);

  const hasChanges = () => {
    if (!initialRating) return true;

    const ratingChanged = Object.keys(rating).some(
      (key) =>
        rating[key as keyof typeof rating] !==
        initialRating.rating[key as keyof typeof rating]
    );
    return ratingChanged || review !== initialRating.review;
  };

  const calculateOverallScore = () => {
    const weights = {
      sillage: 0.25,
      longevity: 0.3,
      value: 0.15,
      projection: 0.2,
      complexity: 0.1,
    };

    return Object.entries(rating)
      .reduce((sum, [key, value]) => {
        return sum + value * weights[key as keyof typeof weights];
      }, 0)
      .toFixed(1);
  };

  const handleLike = async () => {
    setLikes((prev) => prev + 1);
    try {
      await onLike();
    } catch {
      setLikes((prev) => prev - 1);
      toast.error('Failed to like review');
    }
  };

  const handleDislike = async () => {
    setDislikes((prev) => prev + 1);
    try {
      await onDislike();
    } catch {
      setDislikes((prev) => prev - 1);
      toast.error('Failed to dislike review');
    }
  };

  const handleDelete = async () => {
    try {
      await onDelete();
      setRating({
        sillage: 0,
        longevity: 0,
        value: 0,
        projection: 0,
        complexity: 0,
      });
      setReview('');
      setLikes(0);
      setDislikes(0);
    } catch {
      toast.error('Failed to delete review');
    }
  };

  const handleSubmit = async () => {
    await onSubmit({
      perfumeId: productId,
      rating,
      review,
    });
  };

  const isUpdate = Boolean(initialRating);
  const isComplete = Object.values(rating).every((value) => value > 0);
  const canUpdate = isComplete && (isUpdate ? hasChanges() : true);

  return (
    <Card className={cn('space-y-8 p-6', className)}>
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
              onClick={handleLike}
            >
              <ThumbsUp className="size-4" />
              <span>{likes}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={handleDislike}
            >
              <ThumbsDown className="size-4" />
              <span>{dislikes}</span>
            </Button>
          </div>
        )}
      </div>

      {/* Rating Metrics */}
      <RatingMetrics rating={rating} onChange={setRating} />

      {/* Review Text Area */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Your Review</label>
        <Textarea
          placeholder="Share your thoughts about this fragrance..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
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
          <Button onClick={handleSubmit} disabled={!canUpdate}>
            {isUpdate ? 'Update Review' : 'Submit Rating'}
          </Button>
          {isUpdate && (
            <Button
              variant="destructive"
              className="gap-2"
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <RatingDistribution productId={productId} />
    </Card>
  );
}
