'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProductCard } from '@/components/fragrance/ProductCard';
import { ProductFilters } from '@/components/fragrance/ProductFilters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Product } from '@/types/fragrance';

import DataRenderer from '../ui/DataRenderer';

type SortOption =
  | 'price-asc'
  | 'price-desc'
  | 'name-asc'
  | 'name-desc'
  | 'rating-desc'
  | 'rating-asc';

interface CatalogPageProps {
  initialProducts: Product[];
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  empty: {
    title: string;
    message: string;
    button?: {
      text: string;
      href: string;
    };
  };
}

export default function CatalogClient({
  initialProducts,
  success,
  error,
  empty,
}: CatalogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Client-side state
  const [products] = useState<Product[]>(initialProducts);
  const [search, setSearch] = useState(searchParams.get('query') || '');
  const [sortBy, setSortBy] = useState<SortOption>('rating-desc');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(
    []
  );
  const [filters, setFilters] = useState({
    priceRange: [0, 500],
    brands: [] as string[],
    categories: [] as string[],
    notes: [] as string[],
  });

  // Update URL when search changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set('query', search);
    } else {
      params.delete('query');
    }
    router.push(`?${params.toString()}`);
  }, [search, router, searchParams]);

  const handleCompareToggle = (productId: string) => {
    setSelectedForComparison((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      if (prev.length >= 3) {
        return [...prev.slice(1), productId];
      }
      return [...prev, productId];
    });
  };

  const handleCompare = () => {
    if (selectedForComparison.length >= 2) {
      router.push(`/compare/${selectedForComparison.join('/')}`);
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const searchMatch =
        search === '' ||
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.brand.toLowerCase().includes(search.toLowerCase());

      const priceMatch =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];

      const brandMatch =
        filters.brands.length === 0 || filters.brands.includes(product.brand);

      const categoryMatch =
        filters.categories.length === 0 ||
        product.categories.some((cat) => filters.categories.includes(cat));

      const noteMatch =
        filters.notes.length === 0 ||
        [
          ...product.notes.top,
          ...product.notes.middle,
          ...product.notes.base,
        ].some((note) => filters.notes.includes(note.name));

      return (
        searchMatch && priceMatch && brandMatch && categoryMatch && noteMatch
      );
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="holographic-text">Discover Fragrances</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore our curated collection of premium perfumes.
          </p>
        </div>

        <div className="flex flex-col gap-4 md:flex-row">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search fragrances..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select
            value={sortBy}
            onValueChange={(value) => setSortBy(value as SortOption)}
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

          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="w-[200px]"
          >
            <SlidersHorizontal className="mr-2 size-4" />
            Filters
          </Button>
        </div>

        <div className="flex gap-8">
          {showFilters && (
            <Card className="w-[300px] shrink-0 p-6">
              <ProductFilters filters={filters} setFilters={setFilters} />
            </Card>
          )}

          <div className="flex-1 space-y-6">
            {selectedForComparison.length > 0 && (
              <div className="sticky top-20 z-10 rounded-lg border bg-background/80 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedForComparison.length} selected for comparison
                  </p>
                  <Button
                    onClick={handleCompare}
                    disabled={selectedForComparison.length < 2}
                  >
                    Compare Selected
                  </Button>
                </div>
              </div>
            )}

            <DataRenderer
              success={success}
              error={error}
              data={products}
              empty={empty}
              render={(filteredProducts) => (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onCompareToggle={() => handleCompareToggle(product.id)}
                      isSelectedForComparison={selectedForComparison.includes(
                        product.id
                      )}
                    />
                  ))}
                </div>
              )}
            />

            {filteredProducts.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No fragrances found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}