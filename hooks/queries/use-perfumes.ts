import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getPerfume, getPerfumesPaginated } from '@/lib/actions/perfume.action';

export function usePerfume(perfumeId: string) {
  return useQuery({
    queryKey: ['perfume', perfumeId],
    queryFn: () => getPerfume({ perfumeId }),
    enabled: !!perfumeId, // Only run if we have a perfume
  });
}

export function usePerfumes(params: PaginatedSearchParams) {
  const queryClient = useQueryClient();

  const prefetchPerfumes = () => {
    return queryClient.prefetchQuery({
      queryKey: ['perfumes', params],
      queryFn: () => getPerfumesPaginated(params),
      staleTime: 1000 * 60 * 5,
    });
  };

  const result = useQuery({
    queryKey: ['perfumes', params],
    queryFn: () => getPerfumesPaginated(params),
    staleTime: 1000 * 60 * 5,
  });

  return {
    ...result,
    prefetchPerfumes,
  };
}
