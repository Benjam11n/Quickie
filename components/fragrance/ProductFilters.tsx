'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import queryString from 'query-string';
import { useEffect, useState } from 'react';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { removeKeysFromUrlQuery } from '@/lib/url';
import { brands, categories, notes } from '@/types/data';
import { FragranceFilters } from '@/types/fragrance';

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
    categories: [],
    notes: [],
  };

  const [filters, setFilters] = useState<FragranceFilters>(initialFilters);

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      const queryParams: Record<string, string> = {};

      if (filters.priceRange) {
        queryParams.priceRange = filters.priceRange.join(',');
      }

      if (filters.brands.length >= 0) {
        queryParams.brands = filters.brands.join(',');
      }

      if (filters.categories.length >= 0) {
        queryParams.categories = filters.categories.join(',');
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
          keysToRemove: ['priceRange', 'brands', 'categories', 'notes'],
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
          {brands.map((brand) => (
            <div key={brand} className="flex items-center space-x-2">
              <Checkbox
                id={`brand-${brand}`}
                checked={filters.brands.includes(brand)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      brands: [...filters.brands, brand],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      brands: filters.brands.filter((b) => b !== brand),
                    });
                  }
                }}
              />
              <Label htmlFor={`brand-${brand}`}>{brand}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Categories</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category} className="flex items-center space-x-2">
              <Checkbox
                id={`category-${category}`}
                checked={filters.categories.includes(category)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      categories: [...filters.categories, category],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      categories: filters.categories.filter(
                        (c) => c !== category
                      ),
                    });
                  }
                }}
              />
              <Label htmlFor={`category-${category}`}>{category}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold">Notes</h3>
        <div className="space-y-2">
          {notes.map((note) => (
            <div key={note} className="flex items-center space-x-2">
              <Checkbox
                id={`note-${note}`}
                checked={filters.notes.includes(note)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setFilters({
                      ...filters,
                      notes: [...filters.notes, note],
                    });
                  } else {
                    setFilters({
                      ...filters,
                      notes: filters.notes.filter((n) => n !== note),
                    });
                  }
                }}
              />
              <Label htmlFor={`note-${note}`}>{note}</Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
