import { useQuery } from '@tanstack/react-query';

import { getPerfume, getPerfumes } from '@/lib/actions/perfume.action';

export function usePerfume(perfumeId: string) {
  return useQuery({
    queryKey: ['perfumes', perfumeId],
    queryFn: () => getPerfume({ perfumeId }),
    enabled: !!perfumeId, // Only run if we have a perfumeId
  });
}

export function usePerfumes(params: PaginatedSearchParams) {
  return useQuery({
    queryKey: ['perfumes', params],
    queryFn: () => getPerfumes(params),
    enabled: !!params,
  });
}
