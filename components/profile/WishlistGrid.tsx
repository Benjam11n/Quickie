'use client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { useWishlistMutations } from '@/hooks/mutations/use-wishlist-mutations';
import { Wishlist } from '@/types';

import { Button } from '../ui/button';
import { WishlistCard } from '../wishlist/WishlistCard';

interface WishlistsGridProps {
  wishlists: Wishlist[];
}

export function WishlistsGrid({ wishlists }: WishlistsGridProps) {
  const router = useRouter();
  const { deleteWishlistMutation } = useWishlistMutations();

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button
          onClick={() => router.push(ROUTES.WISHLISTS_NEW)}
          className="gap-2"
        >
          <Plus className="size-4" />
          Create Wishlist
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {wishlists.map((wishlist) => (
          <WishlistCard
            key={wishlist._id}
            wishlist={wishlist}
            onDelete={() =>
              deleteWishlistMutation.mutate({ wishlistId: wishlist._id })
            }
            onEdit={() => router.push(ROUTES.WISHLISTS_VIEW(wishlist._id))}
          />
        ))}
      </div>
    </div>
  );
}
