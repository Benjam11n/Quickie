'use client';

import Image from 'next/image';
import Link from 'next/link';

import { StarRating } from '@/components/StarRating';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { Review } from '@/types';

import LocalSearch from '../search/LocalSearch';
import { SortingControls, SortOption } from '../sort/SortingControls';

const REVIEW_SORT_OPTIONS: SortOption[] = [
  { value: 'date-desc', label: 'Newest First' },
  { value: 'date-asc', label: 'Oldest First' },
  { value: 'rating-desc', label: 'Highest Rated' },
  { value: 'rating-asc', label: 'Lowest Rated' },
];

interface RatingsListProps {
  reviews: Review[];
}

export function RatingsList({ reviews }: RatingsListProps) {
  // Calculate overall rating for a review
  const calculateOverallRating = (review: Review) => {
    return (
      (review.rating.complexity +
        review.rating.longevity +
        review.rating.uniqueness +
        review.rating.sillage +
        review.rating.value) /
      5
    );
  };

  return (
    <div className="space-y-6">
      {/* Search and Sort Controls */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full">
          <LocalSearch
            route="/profile"
            placeholder="Search reviews..."
            otherClasses="flex-1"
          />
        </div>
        <SortingControls
          route="/reviews"
          sortOptions={REVIEW_SORT_OPTIONS}
          defaultOption="date-desc"
        />
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card className="p-6 text-center text-muted-foreground">
            No reviews found matching your search criteria.
          </Card>
        ) : (
          reviews.map((item) => {
            const product = item.perfume;
            if (!product) return null;
            const overallRating = calculateOverallRating(item);

            return (
              <Card key={item.perfume._id} className="p-6">
                <div className="flex gap-6">
                  <div className="relative size-24 overflow-hidden rounded-lg">
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={96}
                      height={96}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <Link
                        href={ROUTES.PRODUCT(String(item.perfume._id))}
                        prefetch
                        className="text-lg font-semibold transition-colors hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">
                        {product.brand.name}
                      </p>
                    </div>
                    <StarRating rating={overallRating || 0} />
                    {item.review && (
                      <p className="text-sm text-muted-foreground">
                        {item.review}
                      </p>
                    )}
                    <p className="text-sm text-muted-foreground">
                      Rated on {new Date(item.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
