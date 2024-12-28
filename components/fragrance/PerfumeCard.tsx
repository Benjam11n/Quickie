'use client';

import { Heart, Check, ExternalLink, Scale, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useWishlists } from '@/hooks/queries/use-wishlists';
import { cn } from '@/lib/utils';
import { ReviewView } from '@/types';

import AffiliateNotice from './AffiliateNotice';
import { AuthCheck } from '../auth/AuthCheck';

interface PerfumeCardProps {
  // Core perfume data (always required)
  id: string;
  name: string;
  price: number;
  images: string[];
  brand: {
    name: string;
  };

  // Optional data
  review?: ReviewView;
  affiliateLink?: string; // Only needed if buyable

  // Interactive features - all optional
  interactive?: {
    wishlist?: {
      isFavourite: boolean;
      onWishlistClick: () => void;
    };
    collection?: {
      inCollection: boolean;
      onCollectionToggle: () => void;
    };
    comparison?: {
      isSelected: boolean;
      onCompareToggle: () => void;
    };
  };
}

export function PerfumeCard({
  id,
  name,
  price,
  images,
  brand,
  review,
  affiliateLink,
  interactive,
}: PerfumeCardProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const { prefetchWishlists } = useWishlists(session?.user?.id);

  const overall = review?.rating
    ? (review?.rating?.longevity +
        review?.rating?.complexity +
        review?.rating?.uniqueness +
        review?.rating?.sillage +
        review?.rating?.value) /
      5
    : 0;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest('button')) {
      router.push(ROUTES.PRODUCT(id));
    }
  };

  return (
    <>
      <Card
        className={cn(
          'hover-lift group cursor-pointer overflow-hidden',
          interactive?.comparison?.isSelected && 'ring-2 ring-primary'
        )}
        onClick={handleCardClick}
      >
        <div className="relative aspect-square overflow-hidden">
          <Image
            src={images[0]}
            alt={name}
            fill
            className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          {review && (
            <div className="absolute left-2 top-2 z-10">
              <Badge variant="secondary" className="bg-black/70 text-white">
                <StarRating rating={overall} className="scale-75" />
              </Badge>
            </div>
          )}
        </div>

        <CardHeader className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold transition-colors hover:text-primary">
                {name}
              </h3>
              <p className="text-sm text-muted-foreground">{brand.name}</p>
            </div>

            {interactive && (
              <div className="flex gap-2">
                {interactive.wishlist && (
                  <AuthCheck>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        'size-8',
                        interactive.wishlist.isFavourite && 'text-red-500'
                      )}
                      onClick={interactive.wishlist.onWishlistClick}
                      onMouseEnter={() => prefetchWishlists()}
                    >
                      <Heart
                        className={cn(
                          'size-4',
                          interactive.wishlist.isFavourite && 'fill-current'
                        )}
                      />
                    </Button>
                  </AuthCheck>
                )}

                {interactive.comparison && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      'size-8',
                      interactive.comparison.isSelected && 'text-primary'
                    )}
                    onClick={(e) => {
                      e.stopPropagation();
                      interactive.comparison?.onCompareToggle();
                    }}
                  >
                    <Scale className="size-4" />
                  </Button>
                )}
              </div>
            )}
          </div>

          {review && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              &quot;{review.review}&quot;
            </p>
          )}
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="holographic-text text-lg font-bold">${price}</span>

            {interactive && (
              <div className="flex gap-2">
                {affiliateLink && (
                  <AffiliateNotice>
                    <Button size="sm" variant="outline">
                      <Link
                        href={affiliateLink}
                        passHref
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex"
                      >
                        <ExternalLink className="mr-1 size-4" />
                        Buy
                      </Link>
                    </Button>
                  </AffiliateNotice>
                )}

                {interactive.collection && (
                  <AuthCheck>
                    <Button
                      size="sm"
                      className={cn(
                        interactive.collection.inCollection &&
                          'bg-green-500 hover:bg-green-600'
                      )}
                      onClick={interactive.collection.onCollectionToggle}
                    >
                      {interactive.collection.inCollection ? (
                        <>
                          <Check className="mr-1 size-4" />
                          In Collection
                        </>
                      ) : (
                        <>
                          <Bookmark className="mr-1 size-4" />
                          Add
                        </>
                      )}
                    </Button>
                  </AuthCheck>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
