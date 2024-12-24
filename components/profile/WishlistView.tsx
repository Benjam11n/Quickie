'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DEFAULT_EMPTY } from '@/constants/states';
import { deleteWishlist } from '@/lib/actions/wishlist.action';
import { WishlistView } from '@/types';
import { WishlistCard } from './WishlistCard';
import DataRenderer from '../ui/DataRenderer';

interface WishlistsViewProps {
  wishlists: WishlistView[];
  success: boolean;
  error?: Error;
}

export function WishlistsView({
  wishlists,
  success,
  error,
}: WishlistsViewProps) {
  const router = useRouter();

  const handleDelete = async (wishlistId: string) => {
    try {
      const result = await deleteWishlist({ wishlistId });

      if (result.success) {
        toast.success('Wishlist deleted');
        router.refresh();
      } else {
        toast.error('Failed to delete wishlist');
      }
    } catch {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (wishlistId: string) => {
    router.push(`/wishlist/${wishlistId}/edit`);
  };

  return (
    <DataRenderer
      success={success}
      error={error}
      data={wishlists}
      empty={DEFAULT_EMPTY}
      render={(filteredWishlists) => (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredWishlists.map((wishlist) => (
            <WishlistCard
              key={wishlist._id}
              wishlist={wishlist}
              onDelete={() => handleDelete(wishlist._id)}
              onEdit={() => handleEdit(wishlist._id)}
            />
          ))}
        </div>
      )}
    />
  );
}
