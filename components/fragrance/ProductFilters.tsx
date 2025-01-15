'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
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

import { DialogDescription, DialogTitle } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet';
import { Skeleton } from '../ui/skeleton';

const FilterLoadingState = () => {
  return (
    <div className="space-y-6 p-6">
      {/* Price Range Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-24" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-12" />
          </div>
        </div>
      </div>

      {/* Brands Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-16" />
        <ScrollArea className="h-[200px]">
          <div className="space-y-3 pr-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={`brand-${index}`}
                className="flex items-center space-x-3"
              >
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Tags Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-12" />
        <ScrollArea className="h-[200px]">
          <div className="space-y-3 pr-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={`tag-${index}`} className="flex items-center space-x-3">
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-28" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Notes Section */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-14" />
        <ScrollArea className="h-[200px]">
          <div className="space-y-3 pr-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={`note-${index}`}
                className="flex items-center space-x-3"
              >
                <Skeleton className="size-4 rounded" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="absolute inset-x-0 bottom-0 flex gap-3 bg-background p-6">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
};

interface ProductFiltersProps {
  route: string;
  showFilters: boolean;
  setShowFilters: (showFilters: boolean) => void;
}

export function ProductFilters({
  route,
  showFilters,
  setShowFilters,
}: ProductFiltersProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const getInitialFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    return {
      priceRange: params.get('priceRange')?.split(',').map(Number) || [0, 500],
      brands: params.get('brands')?.split(',').filter(Boolean) || [],
      tags: params.get('tags')?.split(',').filter(Boolean) || [],
      notes: params.get('notes')?.split(',').filter(Boolean) || [],
    };
  };

  const [filters, setFilters] = useState<FragranceFilters>(getInitialFilters());
  const [filterData, setFilterData] = useState<{
    tags: ITagDoc[];
    notes: INoteDoc[];
    brands: IBrandDoc[];
  }>();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getPerfumeFilters().then((data) => {
      setFilterData(data);
      setIsLoading(false);
    });
  }, []);

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
    <Sheet open={showFilters} onOpenChange={setShowFilters}>
      <SheetContent side="left" className="sm:h-full sm:max-w-md">
        <VisuallyHidden>
          <DialogTitle>Filters for perfumes</DialogTitle>
        </VisuallyHidden>
        <VisuallyHidden>
          <DialogDescription>Filters for perfumes</DialogDescription>
        </VisuallyHidden>
        {isLoading ? (
          <FilterLoadingState />
        ) : (
          <>
            <SheetHeader className="mb-4">
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your fragrance search</SheetDescription>
            </SheetHeader>

            <ScrollArea className="h-full pb-24">
              <div className="flex flex-col space-y-6 overflow-y-auto pb-6">
                {/* Price Range */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Price Range</h3>
                  <div className="space-y-2 px-1">
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

                {/* Brands */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Brands</h3>
                  <div className="max-h-[300px] overflow-y-auto pr-4">
                    <div className="space-y-3">
                      {filterData?.brands?.map((brand) => (
                        <div
                          key={brand.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`brand-${brand.id}`}
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
                                  brands: filters.brands.filter(
                                    (b) => b !== brand.name
                                  ),
                                });
                              }
                            }}
                          />
                          <Label
                            htmlFor={`brand-${brand.id}`}
                            className="flex-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {brand.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Tags</h3>
                  <div className="max-h-[300px] overflow-y-auto pr-4">
                    <div className="space-y-3">
                      {filterData?.tags?.map((tag) => (
                        <div
                          key={tag.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`tag-${tag.id}`}
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
                                  tags: filters.tags.filter(
                                    (t) => t !== tag.name
                                  ),
                                });
                              }
                            }}
                          />
                          <Label
                            htmlFor={`tag-${tag.id}`}
                            className="flex-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {tag.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Notes</h3>
                  <div className="max-h-[300px] overflow-y-auto pr-4">
                    <div className="space-y-3">
                      {filterData?.notes?.map((note) => (
                        <div
                          key={note.id}
                          className="flex items-center space-x-3"
                        >
                          <Checkbox
                            id={`note-${note.id}`}
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
                                  notes: filters.notes.filter(
                                    (n) => n !== note.name
                                  ),
                                });
                              }
                            }}
                          />
                          <Label
                            htmlFor={`note-${note.id}`}
                            className="flex-1 text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {note.name}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
