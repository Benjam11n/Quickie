'use client';

import { useRouter } from 'next/navigation';

import { useReviewHandlers } from '@/hooks/use-review-handlers';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { mapProductToEnhancedFragrance } from '@/lib/utils/fragrance-mapper';
import { Review } from '@/types';
import { Perfume } from '@/types/fragrance';

import { EnhancedVisualizer } from './EnhancedVisualizer';
import { ProductHeader } from './ProductHeader';
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
import { AuthCheck } from '../auth/AuthCheck';
import { ReviewCard } from '../rating';

interface SingleProductViewProps {
  product: Perfume;
  review?: Review;
}

export function SingleProductView({ product, review }: SingleProductViewProps) {
  const router = useRouter();
  const { collections, toggleFavorite, addToCollection } = useUserPerfumes();
  const userPerfume = collections.find((p) => p.productId === product.id);
  const enhancedFragrance = mapProductToEnhancedFragrance(product);

  const { handleReviewSubmit, handleReviewDelete, handleInteraction } =
    useReviewHandlers({ product, review, router });

  return (
    <div className="space-y-8">
      <ProductHeader name={product.name} onBack={() => router.back()} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductImage src={product.images[0]} alt={product.name} />

        <ProductInfo
          brand={product.brand}
          price={product.price}
          description={product.description}
          categories={product.categories}
          userPerfume={userPerfume}
          affiliateLink={product.affiliateLink}
          onCollectionClick={() => addToCollection(product.id)}
          onFavoriteClick={() => toggleFavorite(product.id)}
        />
      </div>

      <EnhancedVisualizer fragrance={enhancedFragrance} />

      <AuthCheck>
        <ReviewCard
          productId={product.id}
          initialRating={review}
          onSubmit={handleReviewSubmit}
          onInteraction={handleInteraction}
          onDelete={handleReviewDelete}
        />
      </AuthCheck>
    </div>
  );
}
