import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import {
  addToCollection,
  removeFromCollection,
} from '@/lib/actions/collection.action';

export function useCollectionMutations() {
  const queryClient = useQueryClient();

  const addToCollectionMutation = useMutation({
    mutationFn: async (perfumeId: string) => {
      const result = await addToCollection({
        perfumeId,
      });

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data; // Assuming result.data contains userId
    },
    onSuccess: (data) => {
      toast.success('Success', {
        description: 'Successfully added to collection',
      });

      const userId = data?.author;

      queryClient.invalidateQueries({
        queryKey: ['collection', userId],
      });
    },
    onError: (error) => {
      if (error.message === 'Perfume already in collection') {
        toast.error('Already Added', {
          description: 'This perfume is already in your collection',
        });
      } else {
        toast.error('Error', {
          description: error.message || 'An unexpected error occurred',
        });
      }
    },
  });

  const removeFromCollectionMutation = useMutation({
    mutationFn: async (perfumeId: string) => {
      const result = await removeFromCollection({
        perfumeId,
      });

      if (!result.success) {
        throw new Error(
          result.error?.message || 'An unexpected error occurred'
        );
      }

      return result.data;
    },
    onSuccess: (data) => {
      toast.success('Success', {
        description: 'Successfully removed from collection',
      });

      const userId = data?.author;

      queryClient.invalidateQueries({
        queryKey: ['collection', userId],
      });
    },
    onError: (error) => {
      toast.error('Error', {
        description: error.message || 'Failed to update collection',
      });
    },
  });

  return {
    addToCollectionMutation,
    removeFromCollectionMutation,
  };
}
