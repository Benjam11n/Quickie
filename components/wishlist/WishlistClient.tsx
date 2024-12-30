'use client';

import { Pencil, Plus, X } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import Loading from '@/app/(root)/loading';
import { useWishlistMutations } from '@/hooks/mutations/use-wishlist-mutations';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { useWishlist } from '@/hooks/queries/use-wishlists';
import { useWishlistEditStore } from '@/hooks/stores/use-edit-wishlist-store';
import { PerfumeView } from '@/types/fragrance';

import { PerfumeCard, ProductSelector } from '../fragrance';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

interface WishlistClientProps {
  id: string;
}

const WishlistClient = ({ id }: WishlistClientProps) => {
  const { data: wishlistResponse, isPending } = useWishlist(id);
  const {
    updateWishlistMutation,
    addToWishlistMutation,
    removeFromWishlistMutation,
  } = useWishlistMutations();
  const [showSelector, setShowSelector] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const { prefetchPerfumes } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: query || '',
    filter: '',
  });

  const {
    isEditing,
    editedName,
    editedDescription,
    setIsEditing,
    setEditedName,
    setEditedDescription,
    initializeFromWishlist,
  } = useWishlistEditStore();

  useEffect(() => {
    if (wishlistResponse?.data) {
      initializeFromWishlist(wishlistResponse.data);
    }
  }, [wishlistResponse?.data, initializeFromWishlist]);

  if (isPending) {
    return <Loading />;
  }

  const wishlist = wishlistResponse?.data;

  const handleAddPerfume = async (product: PerfumeView) => {
    setShowSelector(false);

    await addToWishlistMutation.mutateAsync({
      wishlistId: wishlist?._id,
      perfume: product._id,
    });

    setIsEditing(false);
  };

  const handleRemovePerfume = async (perfume: string) => {
    setShowSelector(false);

    await removeFromWishlistMutation.mutateAsync({
      wishlistId: id,
      perfume,
    });

    setIsEditing(false);
  };

  const handleSave = async () => {
    await updateWishlistMutation.mutateAsync({
      wishlistId: id,
      name: editedName,
      description: editedDescription,
    });
    setIsEditing(false);
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="holographic-text">Manage Your Wishlist</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage your wishlist by adding your favorite perfumes.
            Keep track of what you love and explore new fragrances.
          </p>
        </div>
        <Card className="p-6">
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              {isEditing ? (
                <div className="flex-1 space-y-4">
                  <Input
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                    placeholder="Wishlist name"
                  />
                  <Textarea
                    value={editedDescription}
                    onChange={(e) => setEditedDescription(e.target.value)}
                    placeholder="Add a description..."
                    rows={3}
                  />
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      disabled={updateWishlistMutation.isPending}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold">{wishlist?.name}</h1>
                  {wishlist?.description && (
                    <p className="text-muted-foreground">
                      {wishlist.description}
                    </p>
                  )}
                </div>
              )}
              {!isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                >
                  <Pencil className="size-4" />
                </Button>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {wishlist?.perfumes.length || 0} perfumes
              </p>
              <Button className="gap-2" onClick={() => setShowSelector(true)}>
                <Plus className="size-4" onMouseEnter={prefetchPerfumes} />
                Add Perfume
              </Button>
            </div>
          </div>
        </Card>

        {wishlist?.perfumes.length === 0 ? (
          <Card className="flex min-h-[200px] items-center justify-center p-6">
            <div className="text-center">
              <p className="text-muted-foreground">
                No perfumes in this wishlist yet.
              </p>
              <Button
                className="mt-4 gap-2"
                onClick={() => setShowSelector(true)}
                onMouseEnter={prefetchPerfumes}
              >
                <Plus className="size-4" />
                Add Your First Perfume
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {wishlist?.perfumes.map((item) => {
              const perfume = item.perfume;

              return (
                <div key={item.perfume._id} className="group relative">
                  <div className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button
                      variant="outline"
                      size="icon"
                      className="size-8"
                      onClick={() => {
                        handleRemovePerfume(item.perfume._id);
                      }}
                    >
                      <X className="size-4" />
                    </Button>
                  </div>
                  <PerfumeCard
                    key={perfume._id}
                    id={perfume._id}
                    name={perfume.name}
                    price={perfume.fullPrice}
                    images={perfume.images}
                    brand={perfume.brand}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ProductSelector
        isOpen={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleAddPerfume}
        selectedIds={wishlist?.perfumes.map((perfume) => perfume.perfume._id)}
      />
    </div>
  );
};

export default WishlistClient;
