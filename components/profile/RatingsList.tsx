import Image from 'next/image';
import Link from 'next/link';

import { StarRating } from '@/components/StarRating';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { Product } from '@/types/fragrance';
import { ReviewView } from '@/types';

interface RatingsListProps {
  reviews: ReviewView[];
}

export function RatingsList({ reviews }: RatingsListProps) {
  return (
    <div className="space-y-4">
      {reviews.map((item) => {
        const product = item.perfumeId;
        if (!product) return null;
        const overallRating =
          (item.rating.complexity +
            item.rating.longevity +
            item.rating.projection +
            item.rating.sillage +
            item.rating.value) /
          5;

        return (
          <Card key={item.perfumeId._id} className="p-6">
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
                    href={ROUTES.PRODUCT(String(item.perfumeId._id))}
                    className="text-lg font-semibold transition-colors hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {product.brand}
                  </p>
                </div>

                <StarRating rating={overallRating || 0} />

                {item.review && (
                  <p className="text-sm text-muted-foreground">{item.review}</p>
                )}

                <p className="text-sm text-muted-foreground">
                  Rated on {new Date(item.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
