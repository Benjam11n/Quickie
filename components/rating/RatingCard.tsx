'use client';

import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

import { RatingDistribution } from './RatingDistribution';
import { RatingMetrics } from './RatingMetrics';
import { Review } from '@/types';

interface RatingCardProps {
  productId: string;
  initialRating?: Review;
  onSubmit: (rating: CreateReviewParams) => void;
  className?: string;
}

export function RatingCard({
  productId,
  initialRating,
  onSubmit,
  className,
}: RatingCardProps) {
  const [rating, setRating] = useState({
    sillage: initialRating?.rating.sillage || 0,
    longevity: initialRating?.rating.longevity || 0,
    value: initialRating?.rating.value || 0,
    projection: initialRating?.rating.projection || 0,
    complexity: initialRating?.rating.complexity || 0,
  });
  const [review, setReview] = useState(initialRating?.review || '');
  const [helpful, setHelpful] = useState({ up: 423, down: 12 });

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

  const handleSubmit = () => {
    onSubmit({
      perfumeId: productId,
      rating,
      review,
    });
  };

  const isComplete = Object.values(rating).every((value) => value > 0);

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

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setHelpful((prev) => ({ ...prev, up: prev.up + 1 }))}
          >
            <ThumbsUp className="size-4" />
            <span>{helpful.up}</span>
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() =>
              setHelpful((prev) => ({ ...prev, down: prev.down + 1 }))
            }
          >
            <ThumbsDown className="size-4" />
            <span>{helpful.down}</span>
          </Button>
        </div>
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
        >
          <Button onClick={handleSubmit} disabled={!isComplete}>
            Submit Rating
          </Button>
        </motion.div>
      </div>

      {/* Rating Distribution */}
      <RatingDistribution productId={productId} />
    </Card>
  );
}
