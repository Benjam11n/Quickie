import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'next/navigation';

import { getPerfumes } from '@/lib/actions/perfume.action';

export function useSelectorPerfumes(isOpen: boolean) {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const prefetchPerfumes = () => {
    return queryClient.prefetchQuery({
      queryKey: ['selector-perfumes', query],
      queryFn: () => getPerfumes({ query }),
      staleTime: 1000 * 60 * 5,
    });
  };

  const result = useQuery({
    queryKey: ['selector-perfumes', query],
    queryFn: () => getPerfumes({ query }),
    staleTime: 1000 * 60 * 5,
    enabled: isOpen,
  });

  return {
    ...result,
    prefetchPerfumes,
  };
}
