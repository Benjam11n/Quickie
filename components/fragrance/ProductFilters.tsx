'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { IBrandDoc, INoteDoc } from '@/database';
import { ITagDoc } from '@/database/tag.model';
import { getPerfumeFilters } from '@/lib/actions/perfume.action';
import { removeKeysFromUrlQuery } from '@/lib/url';
import { FragranceFilters } from '@/types/models/fragrance';

interface ProductFiltersProps {
  route: string;
}

export function ProductFilters({ route }: ProductFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialFilters = {
    priceRange: [0, 500],
    brands: [],
    tags: [],
    notes: [],
  };
  const [filters, setFilters] = useState<FragranceFilters>(initialFilters);
  const [filterData, setFilterData] = useState<{
    tags: ITagDoc[];
    notes: INoteDoc[];
    brands: IBrandDoc[];
  }>();

  useEffect(() => {
    getPerfumeFilters().then((data) => setFilterData(data));
  }, []);
  // TODO: handle isPending

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const queryParams: Record<string, string> = {};

      if (filters.priceRange) {
        queryParams.priceRange = filters.priceRange.join(',');
      }

      if (filters.brands.length >= 0) {
        queryParams.brands = filters.brands.join(',');
      }

      if (filters.tags.length >= 0) {
        queryParams.tags = filters.tags.join(',');
      }

      if (filters.notes.length >= 0) {
        queryParams.notes = filters.notes.join(',');
      }

      const currentParams = queryString.parse(searchParams.toString());
      const newParams = { ...currentParams, ...queryParams };

      const newUrl = queryString.stringifyUrl({
        url: window.location.pathname,
        query: newParams,
      });

      router.push(newUrl, { scroll: false });
    } else {
      if (pathname === route) {
        const newUrl = removeKeysFromUrlQuery({
          params: searchParams.toString(),
          keysToRemove: ['priceRange', 'brands', 'tags', 'notes'],
        });
        router.push(newUrl, { scroll: false });
      }
    }
  }, [filters, router, route, searchParams, pathname]);

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="font-semibold">Price Range</h3>
        <div className="space-y-2">
          <Slider
            defaultValue={filters.priceRange}
            max={500}
            step={10}
            onValueChange={(value) =>
              setFilters({ ...filters, priceRange: value })
            }
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Brands</h3>
        <div className="space-y-2">
          {filterData?.brands?.map((brand) => (
            <div key={brand.id} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      brands: [...filters.brands, brand.name],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      brands: filters.brands.filter((b) => b !== brand.name),
                    });
                  }
                }}
              />
              <Label htmlFor={`brand-${brand}`}>{brand.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Tags</h3>
        <div className="space-y-2">
          {filterData?.tags?.map((tag) => (
            <div key={tag.id} className="flex items-center space-x-2">
              <Checkbox
                id={`tag-${tag}`}
                checked={filters.tags.includes(tag.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      tags: [...filters.tags, tag.name],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      tags: filters.tags.filter((t) => t !== tag.name),
                    });
                  }
                }}
              />
              <Label htmlFor={`tag-${tag.name}`}>{tag.name}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Notes</h3>
        <div className="space-y-2">
          {filterData?.notes?.map((note) => (
            <div key={note.id} className="flex items-center space-x-2">
              <Checkbox
                id={`note-${note}`}
                checked={filters.notes.includes(note.name)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      notes: [...filters.notes, note.name],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      notes: filters.notes.filter((n) => n !== note.name),
                    });
                  }
                }}
              />
              <Label htmlFor={`note-${note}`}>{note.name}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
