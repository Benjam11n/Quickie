'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import Loading from '@/app/(root)/loading';
import { PerfumeCard } from '@/components/fragrance/PerfumeCard';
import { ProductFilters } from '@/components/fragrance/ProductFilters';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { EMPTY_PERFUME } from '@/constants/states';
import { useCollection } from '@/hooks/queries/use-collection';
import { useComparisonStore } from '@/hooks/stores/use-comparison-store';
import { Perfume } from '@/types/fragrance';

import PaginationControls from '../pagination/PaginationControls';
import LocalSearch from '../search/LocalSearch';
import SortingControls from '../sort/SortingControls';
import DataRenderer from '../ui/DataRenderer';

interface CatalogPageProps {
  perfumes?: Perfume[];
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

const MAXIMMUM_COMPARISONS = 2;

export default function CatalogClient({
  perfumes,
  success,
  error,
}: CatalogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const { selectedItems, addItem, removeItem, reset } = useComparisonStore();
  const isSelected = (perfumeId: string) => selectedItems.includes(perfumeId);
  const currentPageSize = Number(searchParams.get('pageSize')) || 10;

  const [showFilters, setShowFilters] = useState(false);
  const totalCount = perfumes?.length || 0;

  const {
    data: collectionResponse,
    isPending: collectionLoading,
    error: collectionError,
  } = useCollection(session?.user?.id);

  useEffect(() => {
    if (collectionError) {
      toast.error('Failed to load collection', {
        description:
          'Your collection data could not be loaded. Some features may be limited.',
      });
    }
  }, [collectionError]);

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  if (collectionLoading && session) {
    return <Loading />;
  }

  const handleCompare = () => {
    if (selectedItems.length >= MAXIMMUM_COMPARISONS) {
      router.push(`/compare/${selectedItems.join('/')}`);
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
            {selectedItems.length > 0 && (
              <div className="sticky top-20 z-10 rounded-lg border bg-background/80 p-4 shadow-lg backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">
                    {selectedItems.length} selected for comparison
                  </p>
                  <Button
                    onClick={handleCompare}
                    disabled={selectedItems.length < 1}
                  >
                    Compare Selected
                  </Button>
                </div>
              </div>
            )}

            <DataRenderer
              success={success}
              error={error}
              data={perfumes}
              empty={EMPTY_PERFUME}
              render={(perfumes) => (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {perfumes.map((perfume) => (
                    <PerfumeCard
                      key={perfume._id}
                      perfume={perfume}
                      onCompareToggle={() => {
                        const selected = isSelected(perfume._id);
                        if (!selected) {
                          addItem(perfume._id);
                        } else {
                          removeItem(perfume._id);
                        }
                      }}
                      isSelectedForComparison={isSelected(perfume._id)}
                      collection={collectionResponse?.data}
                    />
                  ))}
                </div>
              )}
            />
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
