import { useQuery } from '@tanstack/react-query';

import { getCollection } from '@/lib/actions/collection.action';

export function useCollection(userId?: string) {
  return useQuery({
    queryKey: ['collection', userId],
    queryFn: () => getCollection({ userId: userId! }),
    enabled: !!userId,
  });
}
