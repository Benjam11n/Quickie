'use client';

import { notFound, useRouter } from 'next/navigation';
import { useState } from 'react';

import Loading from '@/app/(root)/loading';
import { useCollectionMutations } from '@/hooks/mutations/use-collection-mutations';
import { useWishlistMutations } from '@/hooks/mutations/use-wishlist-mutations';
import { useCollection } from '@/hooks/queries/use-collection';
import { usePerfume } from '@/hooks/queries/use-perfumes';
import { useReview } from '@/hooks/queries/use-reviews';
import { useWishlists } from '@/hooks/queries/use-wishlists';
import { mapToPerfumeVisualizer } from '@/lib/utils/fragrance';

import { ProductHeader } from './ProductHeader';
import { ProductImages } from './ProductImages';
import { ProductInfo } from './ProductInfo';
import { Visualizer } from './Visualizer';
import { AuthCheck } from '../auth/AuthCheck';
import { ReviewCard } from '../rating';
import { WishlistSelectDialog } from '../wishlist/WishlistSelectDialog';

interface SingleProductViewProps {
  userId?: string;
  perfumeId: string;
}

export function SingleProductView({
  userId,
  perfumeId,
}: SingleProductViewProps) {
  const router = useRouter();
  const [selectedPerfume, setSelectedPerfume] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const {
    data: perfumeResponse,
    isPending: perfumeLoading,
    error: perfumeError,
  } = usePerfume(perfumeId);
  const { data: reviewResponse, isPending: reviewLoading } = useReview(
    perfumeId,
    userId
  );
  const { data: wishlistsResponse, isPending: isLoadingWishlists } =
    useWishlists(userId);
  const { data: collectionResponse, isPending: isLoadingCollection } =
    useCollection(userId);

  const { addToCollectionMutation, removeFromCollectionMutation } =
    useCollectionMutations();
  const { addToWishlistMutation, removeFromWishlistMutation } =
    useWishlistMutations();

  if (
    perfumeLoading ||
    (userId && (isLoadingCollection || isLoadingWishlists || reviewLoading))
  ) {
    return <Loading />;
  }

  if (perfumeError || !perfumeResponse.data) {
    return notFound();
  }

  const collection = collectionResponse?.data;
  const perfume = perfumeResponse.data;
  const review = reviewResponse?.data;
  const wishlist = wishlistsResponse?.data;

  const isFavourite =
    wishlist?.some((wishlist) =>
      wishlist.perfumes.some((p) => p.perfume._id === perfume._id)
    ) || false;

  const inCollection: boolean = collection
    ? collection.perfumes
        .map((perfume) => perfume.perfume._id)
        .includes(perfume._id)
    : false;

  const perfumeVisualizer = mapToPerfumeVisualizer(perfume);

  const handleWishlistChange = (
    wishlistId: string,
    action: 'add' | 'remove'
  ) => {
    if (selectedPerfume) {
      const mutation =
        action === 'add' ? addToWishlistMutation : removeFromWishlistMutation;
      mutation.mutate({
        wishlistId,
        perfume: selectedPerfume.id,
      });
    }
    setSelectedPerfume(null);
  };

  return (
    <div className="space-y-8">
      <ProductHeader name={perfume.name} onBack={() => router.back()} />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <ProductImages images={perfume.images} alt={perfume.name} />
        <ProductInfo
          perfume={perfume}
          inCollection={inCollection}
          isFavourite={isFavourite}
          onCollectionClick={() =>
            inCollection
              ? removeFromCollectionMutation.mutate(perfumeId)
              : addToCollectionMutation.mutate(perfumeId)
          }
          onFavoriteClick={() =>
            setSelectedPerfume({
              id: perfume._id,
              name: perfume.name,
            })
          }
        />
      </div>

      <Visualizer fragrance={perfumeVisualizer} />

      <AuthCheck>
        <ReviewCard perfume={perfume} initialReview={review} />
      </AuthCheck>

      {selectedPerfume && (
        <WishlistSelectDialog
          isOpen={!!selectedPerfume}
          onOpenChange={(open) => !open && setSelectedPerfume(null)}
          onSelect={(wishlistId) => handleWishlistChange(wishlistId, 'add')}
          onUnSelect={(wishlistId) =>
            handleWishlistChange(wishlistId, 'remove')
          }
          perfume={selectedPerfume.id}
          perfumeName={selectedPerfume.name}
          wishlists={wishlistsResponse?.data || []}
          isLoading={isLoadingWishlists}
        />
      )}
    </div>
  );
}
