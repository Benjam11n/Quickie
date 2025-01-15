'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formUrlQuery, removeKeysFromUrlQuery } from '@/lib/url';

export interface SortOption {
  value: string;
  label: string;
}

interface SortingControlsProps {
  route: string;
  sortOptions: SortOption[];
  defaultOption: string;
}

export function SortingControls({
  route,
  sortOptions,
  defaultOption,
}: SortingControlsProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSortBy = searchParams.get('sortBy') || defaultOption;
  const [sortBy, setSortBy] = useState<string>(initialSortBy);

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
          keysToRemove: ['sortBy'],
        });
        router.push(newUrl, { scroll: false });
      }
    }
  }, [sortBy, router, route, searchParams, pathname]);

  return (
    <Select onValueChange={(value) => setSortBy(value)} value={sortBy}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
