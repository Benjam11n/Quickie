import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  addToWishlist,
  createWishlist,
  deleteWishlist,
  removeFromWishlist,
  updateWishlist,
} from '@/lib/actions/wishlist.action';
import { WishlistView } from '@/types';

export function useWishlistMutations() {
  const queryClient = useQueryClient();

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
      toast.success('Successfully created wishlist.');

      const wishlistId = data._id;
      const userId = data.author;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      queryClient.invalidateQueries({
        queryKey: ['wishlists', userId],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred.',
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
      toast.success('Successfully updated wishlist.');

      const wishlistId = data._id;
      const userId = data.author;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      queryClient.invalidateQueries({
        queryKey: ['wishlists', userId],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred.',
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
      toast.success('Successfully added to wishlist.');

      const wishlistId = data._id;
      const userId = data.author;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      queryClient.invalidateQueries({
        queryKey: ['wishlists', userId],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      if (error.message === 'Perfume already in wishlist') {
        toast.error('This perfume is already in your wishlist.');
      } else {
        toast.error('Error', {
          description: error.message || 'An unexpected error occurred.',
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
      toast.success('Successfully removed from wishlist.');

      const wishlistId = data._id;
      const userId = data.author;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      queryClient.invalidateQueries({
        queryKey: ['wishlists', userId],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'Failed to update wishlist.',
      });
    },
  });

  const deleteWishlistMutation = useMutation({
    mutationFn: async (params: DeleteWishlistParams) => {
      const result = await deleteWishlist(params);

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data as SuccessDeleteResponse;
    },
    onSuccess: (data: SuccessDeleteResponse) => {
      toast.success('Successfully deleted wishlist.');

      const wishlistId = data._id;
      const userId = data.userId;
      queryClient.invalidateQueries({
        queryKey: ['wishlist', wishlistId],
      });

      queryClient.invalidateQueries({
        queryKey: ['wishlists', userId],
        refetchType: 'all',
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'An unexpected error occurred.',
      });
    },
  });

  return {
    createWishlistMutation,
    updateWishlistMutation,
    addToWishlistMutation,
    removeFromWishlistMutation,
    deleteWishlistMutation,
  };
}
