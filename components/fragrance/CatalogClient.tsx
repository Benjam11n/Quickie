'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ProductCard } from '@/components/fragrance/ProductCard';
import { ProductFilters } from '@/components/fragrance/ProductFilters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/fragrance';

import PaginationControls from '../pagination/PaginationControls';
import LocalSearch from '../search/LocalSearch';
import SortingControls from '../sort/SortingControls';
import DataRenderer from '../ui/DataRenderer';

interface CatalogPageProps {
  products: Product[];
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
  products,
  success,
  error,
  empty,
}: CatalogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentPageSize = Number(searchParams.get('pageSize')) || 10;

  const [showFilters, setShowFilters] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>(
    []
  );
  const totalCount = products.length || 0;

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
            <LocalSearch
              route="/catalog"
              placeholder="Search perfumes..."
              otherClasses="flex-1"
            />
          </div>

          <SortingControls route="/catalog" />

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
              <ProductFilters route="/catalog" />
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
            {products.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-muted-foreground">
                  No fragrances found matching your criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-12">
        <PaginationControls
          route="/catalog"
          // TODO: get totalcount from API
          totalPages={Math.ceil(totalCount / currentPageSize)}
        />
      </div>
    </div>
  );
}
