'use client';

import { ArrowLeft, ExternalLink, Heart, ShoppingCart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AuthCheck } from '@/components/auth/AuthCheck';
import { EnhancedVisualizer } from '@/components/fragrance';
import { RatingCard } from '@/components/rating/RatingCard';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { cn } from '@/lib/utils';
import { mapProductToEnhancedFragrance } from '@/lib/utils/fragrance-mapper';
import { Product } from '@/types/fragrance';

import AffiliateNotice from './AffiliateNotice';

interface SingleProductViewProps {
  product: Product;
}

export function SingleProductView({ product }: SingleProductViewProps) {
  const router = useRouter();
  const { collections, toggleFavorite, addToCollection, addRating } =
    useUserPerfumes();
  const userPerfume = collections.find((p) => p.productId === product.id);
  const enhancedFragrance = mapProductToEnhancedFragrance(product);

  const handleFavoriteClick = () => {
    toggleFavorite(product.id);
  };

  const handleCollectionClick = () => {
    addToCollection(product.id);
  };

  const handleRatingSubmit = (rating: any) => {
    addRating(product.id, rating.overall, rating.review);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          asChild
        >
          <ArrowLeft />
        </Button>
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="size-full object-cover"
            />
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <p className="text-xl text-muted-foreground">{product.brand}</p>
            <p className="mt-2 text-3xl font-bold">${product.price}</p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <div className="flex w-full gap-4">
            <AuthCheck onAuthSuccess={handleCollectionClick}>
              <Button
                className={cn(
                  'w-full',
                  userPerfume?.inCollection
                    ? 'bg-green-500 hover:bg-green-600'
                    : ''
                )}
                size="lg"
              >
                <ShoppingCart className="mr-2 size-5" />
                {userPerfume?.inCollection
                  ? 'In Collection'
                  : 'Add to Collection'}
              </Button>
            </AuthCheck>
            <AuthCheck onAuthSuccess={handleFavoriteClick}>
              <Button
                variant="outline"
                size="icon"
                className={userPerfume?.isFavorite ? 'text-red-500' : ''}
              >
                <Heart
                  className={`size-5 ${userPerfume?.isFavorite ? 'fill-current' : ''}`}
                />
              </Button>
            </AuthCheck>
            <AffiliateNotice>
              <Button variant="outline" size="lg" asChild className="flex-1">
                <Link href={product.affiliateLink} passHref>
                  <ExternalLink className="mr-2 size-4" />
                  Buy from Partner
                </Link>
              </Button>
            </AffiliateNotice>
          </div>
        </div>
      </div>

      <EnhancedVisualizer fragrance={enhancedFragrance} />

      <AuthCheck>
        <RatingCard
          productId={product.id}
          initialRating={
            userPerfume?.rating
              ? {
                  sillage: product.scentProfile.sillage,
                  longevity: product.scentProfile.longevity,
                  value: product.scentProfile.value,
                  projection: product.scentProfile.sillage,
                  complexity: product.scentProfile.uniqueness,
                  review: userPerfume.review,
                }
              : undefined
          }
          onSubmit={handleRatingSubmit}
        />
      </AuthCheck>
    </div>
  );
}
