'use client';

import { notFound, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Loading from '@/app/(root)/loading';
import { usePerfume } from '@/hooks/queries/use-perfumes';
import { useReview } from '@/hooks/queries/use-reviews';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { mapProductToEnhancedFragrance } from '@/lib/utils/fragrance-mapper';

import { EnhancedVisualizer } from './EnhancedVisualizer';
import { ProductHeader } from './ProductHeader';
import { ProductImage } from './ProductImage';
import { ProductInfo } from './ProductInfo';
import { AuthCheck } from '../auth/AuthCheck';
import { ReviewCard } from '../rating';

interface SingleProductViewProps {
  perfumeId: string;
}

export function SingleProductView({ perfumeId }: SingleProductViewProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const userId = session?.user?.id;

  const {
    data: perfumeResponse,
    isPending: perfumeLoading,
    error: perfumeError,
  } = usePerfume(perfumeId);

  const {
    data: reviewResponse,
    isPending: reviewLoading,
    error: reviewError,
  } = useReview(perfumeId, userId);

  const { collections, toggleFavorite, addToCollection } = useUserPerfumes();

  if (perfumeLoading || (session && reviewLoading)) {
    return <Loading />;
  }

  if (perfumeError || reviewError || !perfumeResponse.data) {
    return notFound();
  }

  const perfume = perfumeResponse.data;

  const review = reviewResponse?.data;

  const userPerfume = collections.find((p) => p.productId === perfume._id);
  const enhancedFragrance = mapProductToEnhancedFragrance(perfume);

  return (
    <div className="space-y-8">
      <ProductHeader name={perfume.name} onBack={() => router.back()} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductImage src={perfume.images[0]} alt={perfume.name} />
        <ProductInfo
          // todo:
          brand={perfume?.brand?.name}
          price={perfume.price}
          description={perfume.description}
          categories={perfume.categories}
          userPerfume={userPerfume}
          affiliateLink={perfume.affiliateLink}
          onCollectionClick={() => addToCollection(perfume._id)}
          onFavoriteClick={() => toggleFavorite(perfume._id)}
        />
      </div>

      <EnhancedVisualizer fragrance={enhancedFragrance} />

      {userId && (
        <AuthCheck>
          <ReviewCard perfumeId={perfume._id} initialReview={review} />
        </AuthCheck>
      )}
    </div>
  );
}
