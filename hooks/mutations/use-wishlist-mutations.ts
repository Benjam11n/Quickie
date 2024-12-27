import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/routes';
import {
  addToWishlist,
  createWishlist,
  removeFromWishlist,
  updateWishlist,
} from '@/lib/actions/wishlist.action';
import { WishlistView } from '@/types';

export function useWishlistMutations() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const createWishlistMutation = useMutation({
    mutationFn: async (params: CreateWishlistParams) => {
      const result = await createWishlist(params);

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data as WishlistView;
    },
    onSuccess: (data: WishlistView) => {
      toast.success('Success', {
        description: 'Successfully created wishlist',
      });

      const wishlistId = data._id;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      router.push(ROUTES.WISHLISTS_VIEW(data._id));
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });

  const updateWishlistMutation = useMutation({
    mutationFn: async (params: UpdateWishlistParams) => {
      const result = await updateWishlist(params);

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data as WishlistView;
    },
    onSuccess: (data: WishlistView) => {
      toast.success('Success', {
        description: 'Successfully updated wishlist',
      });

      const wishlistId = data._id;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred',
      });
    },
  });

  const addToWishlistMutation = useMutation({
    mutationFn: async (params: AddToWishlistParams) => {
      const result = await addToWishlist(params);

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data as WishlistView;
    },
    onSuccess: (data: WishlistView) => {
      toast.success('Success', {
        description: 'Successfully added to wishlist',
      });

      const wishlistId = data._id;
      const userId = data.author;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      queryClient.invalidateQueries({
        queryKey: ['wishlists', userId],
      });
    },
    onError: (error) => {
      if (error.message === 'Perfume already in wishlist') {
        toast.error('Already Added', {
          description: 'This perfume is already in your wishlist',
        });
      } else {
        toast.error('Error', {
          description: error.message || 'An unexpected error occurred',
        });
      }
    },
  });

  const removeFromWishlistMutation = useMutation({
    mutationFn: async (params: RemoveFromWishlistParams) => {
      const result = await removeFromWishlist(params);

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data as WishlistView;
    },
    onSuccess: (data: WishlistView) => {
      toast.success('Success', {
        description: 'Successfully removed from wishlist',
      });

      const wishlistId = data._id;
      const userId = data.author;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      queryClient.invalidateQueries({
        queryKey: ['wishlists', userId],
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'Failed to update wishlist',
      });
    },
  });

  return {
    createWishlistMutation,
    updateWishlistMutation,
    addToWishlistMutation,
    removeFromWishlistMutation,
  };
}
