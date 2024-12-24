'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { deleteWishlist } from '@/lib/actions/wishlist.action';
import { WishlistView } from '@/types';

import { WishlistCard } from './WishlistCard';

interface WishlistsViewProps {
  wishlists: WishlistView[];
}

export function WishlistsView({ wishlists }: WishlistsViewProps) {
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {wishlists.map((wishlist) => (
        <WishlistCard
          key={wishlist._id}
          wishlist={wishlist}
          onDelete={() => handleDelete(wishlist._id)}
          onEdit={() => handleEdit(wishlist._id)}
        />
      ))}
    </div>
  );
}
