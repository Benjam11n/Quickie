import {
  useQuery,
  useQueryClient,
  UseQueryResult,
} from '@tanstack/react-query';

import { getUserWishlists, getWishlist } from '@/lib/actions/wishlist.action';
import { Wishlist } from '@/types';

export function useWishlists(userId?: string) {
  const queryClient = useQueryClient();

  const prefetchWishlists = () => {
    return queryClient.prefetchQuery({
      queryKey: ['wishlists', userId],
      queryFn: () => getUserWishlists({ userId: userId! }),
      staleTime: 1000 * 60 * 5,
    });
  };

  const result = useQuery({
    queryKey: ['wishlists', userId],
    queryFn: () => getUserWishlists({ userId: userId! }),
    staleTime: 1000 * 60 * 5,
    enabled: !!userId,
  });

  return {
    ...result,
    prefetchWishlists,
  };
}

export function useWishlist(
  wishlistId: string
): UseQueryResult<ActionResponse<Wishlist>> {
  return useQuery({
    queryKey: ['wishlist', wishlistId],
    queryFn: () => getWishlist({ wishlistId }),
    staleTime: 1000 * 60 * 5,
    retry: false,
  });
}
