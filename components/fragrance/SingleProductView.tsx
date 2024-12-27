'use client';

import { notFound, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

import Loading from '@/app/(root)/loading';
import { useCollectionMutations } from '@/hooks/mutations/use-collection-mutations';
import { useWishlistMutations } from '@/hooks/mutations/use-wishlist-mutations';
import { useCollection } from '@/hooks/queries/use-collection';
import { usePerfume } from '@/hooks/queries/use-perfumes';
import { useReview } from '@/hooks/queries/use-reviews';
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

  const { addToCollectionMutation } = useCollectionMutations(perfumeId);
  const { addToWishlistMutation } = useWishlistMutations();
  const { data: collectionResponse, isLoading: isLoadingCollection } =
    useCollection(userId);

  const collection = collectionResponse?.data;

  if (perfumeLoading || isLoadingCollection || (session && reviewLoading)) {
    return <Loading />;
  }

  if (perfumeError || reviewError || !perfumeResponse.data) {
    return notFound();
  }

  const perfume = perfumeResponse.data;

  const review = reviewResponse?.data;

  const enhancedFragrance = mapProductToEnhancedFragrance(perfume);

  return (
    <div className="space-y-8">
      <ProductHeader name={perfume.name} onBack={() => router.back()} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductImage src={perfume.images[0]} alt={perfume.name} />
        <ProductInfo
          perfume={perfume}
          collection={collection}
          onCollectionClick={() => addToCollectionMutation.mutate()}
          // todo:
          onFavoriteClick={() =>
            addToWishlistMutation.mutate({ wishlistId: '1', perfumeId })
          }
        />
      </div>

      <EnhancedVisualizer fragrance={enhancedFragrance} />

      <AuthCheck>
        <ReviewCard perfumeId={perfume._id} initialReview={review} />
      </AuthCheck>
    </div>
  );
}
