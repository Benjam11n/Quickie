'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating-desc'
  | 'rating-asc';

interface LocalSearchProps {
  route: string;
}

const SortingControls = ({ route }: LocalSearchProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSortBy =
    (searchParams.get('sortBy') as SortOption) || 'price-desc';

  const [sortBy, setSortBy] = useState<SortOption>(initialSortBy);

  useEffect(() => {
    if (sortBy) {
      const newUrl = formUrlQuery({
        params: searchParams.toString(),
        key: 'sortBy',
        value: sortBy,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ['query'],
        });

        router.push(newUrl, { scroll: false });
      }
    }
  }, [sortBy, router, route, searchParams, pathname]);

  return (
    <Select
      onValueChange={(value) => setSortBy(value as SortOption)}
      value={sortBy}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="name-asc">Name (A-Z)</SelectItem>
        <SelectItem value="name-desc">Name (Z-A)</SelectItem>
      </SelectContent>
    </Select>
  );
};

export default SortingControls;
