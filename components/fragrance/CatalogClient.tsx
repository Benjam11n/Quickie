'use client';

import { SlidersHorizontal } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';

import { PerfumeCard } from '@/components/fragrance/PerfumeCard';
import { ProductFilters } from '@/components/fragrance/ProductFilters';
import { Button } from '@/components/ui/button';
import { EMPTY_PERFUME } from '@/constants/states';
import { useCollectionMutations } from '@/hooks/mutations/use-collection-mutations';
import { useWishlistMutations } from '@/hooks/mutations/use-wishlist-mutations';
import { useCollection } from '@/hooks/queries/use-collection';
import { useUserReviews } from '@/hooks/queries/use-reviews';
import { useWishlists } from '@/hooks/queries/use-wishlists';
import { useComparisonStore } from '@/hooks/stores/use-comparison-store';
import { getPerfumesPaginated } from '@/lib/actions/perfume.action';
import { Perfume } from '@/types/models/fragrance';

import ComparisonBar from './ComparisonBar';
import DataRenderer from '../DataRenderer';
import LocalSearch from '../search/LocalSearch';
import { SortingControls, SortOption } from '../sort/SortingControls';
import { WishlistSelectDialog } from '../wishlist/WishlistSelectDialog';

const PERFUME_SORT_OPTIONS: SortOption[] = [
  { value: 'popularity-desc', label: 'Popularity: High to Low' },
  { value: 'popularity-asc', label: 'Popularity: Low to High' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
  { value: 'rating-asc', label: 'Rating: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
];

interface CatalogPageProps {
  userId?: string;
  perfumes?: Perfume[];
  isNext?: boolean;
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
}

const MAXIMUM_COMPARISONS = 2;
const ITEMS_PER_PAGE = 20;

export default function CatalogClient({
  userId,
  perfumes: initialPerfumes,
  isNext: initialIsNext,
  success,
  error,
}: CatalogPageProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Infinite scroll state
  const [perfumes, setPerfumes] = useState(initialPerfumes || []);
  const [isNext, setIsNext] = useState(initialIsNext);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // IntersectionObserver setup
  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // State
  const [selectedPerfume, setSelectedPerfume] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Store
  const { selectedItems, addItem, removeItem, reset } = useComparisonStore();

  // Queries
  const { data: collectionResponse, isPending: isLoadingCollection } =
    useCollection(userId);
  const { data: reviewsResponse, isPending: isLoadingReviews } =
    useUserReviews(userId);
  const { data: wishlistsResponse, isPending: isLoadingWishlists } =
    useWishlists(userId);

  // Mutations
  const { addToWishlistMutation, removeFromWishlistMutation } =
    useWishlistMutations();
  const { addToCollectionMutation, removeFromCollectionMutation } =
    useCollectionMutations();

  // Load more data when scrolled to bottom
  const loadMore = useCallback(async () => {
    if (isLoading || !isNext) return;

    setIsLoading(true);
    const nextPage = page + 1;

    try {
      const result = await getPerfumesPaginated({
        page: nextPage,
        pageSize: ITEMS_PER_PAGE,
        query: searchParams.get('query') || '',
        notes: searchParams.get('notes') || '',
        priceRange: searchParams.get('priceRange') || '',
        tags: searchParams.get('tags') || '',
        brands: searchParams.get('brands') || '',
        sortBy: searchParams.get('sortBy') || '',
      });

      if (result.success && result.data) {
        const { perfumes: newPerfumes, isNext: hasMore } = result.data;
        // Simply append new perfumes without filtering
        setPerfumes((prev) => [...prev, ...newPerfumes]);
        setIsNext(hasMore);
        setPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more perfumes:', error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, isNext, page, searchParams]);

  // Trigger load more when scroll near bottom
  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  // Reset comparison store on unmount
  useEffect(() => {
    return () => reset();
  }, [reset]);

  // Reset pagination when search params change
  useEffect(() => {
    setPerfumes(initialPerfumes || []);
    setPage(1);
    setIsNext(initialIsNext);
  }, [initialPerfumes, initialIsNext, searchParams]);

  // Handlers
  const handleCompare = useCallback(() => {
    if (selectedItems.length >= MAXIMUM_COMPARISONS) {
      router.push(`/compare/${selectedItems.join('/')}`);
    }
  }, [selectedItems, router]);

  const handleCompareToggle = useCallback(
    (perfume: string) => {
      const selected = selectedItems.includes(perfume);
      if (!selected) {
        addItem(perfume);
      } else {
        removeItem(perfume);
      }
    },
    [selectedItems, addItem, removeItem]
  );

  const handleWishlistSelect = useCallback(
    (wishlistId: string) => {
      if (selectedPerfume) {
        addToWishlistMutation.mutate({
          wishlistId,
          perfume: selectedPerfume.id,
        });
      }
      setSelectedPerfume(null);
    },
    [selectedPerfume, addToWishlistMutation]
  );

  const handleWishlistUnselect = useCallback(
    (wishlistId: string) => {
      if (selectedPerfume) {
        removeFromWishlistMutation.mutate({
          wishlistId,
          perfume: selectedPerfume.id,
        });
      }
      setSelectedPerfume(null);
    },
    [selectedPerfume, removeFromWishlistMutation]
  );

  if (userId && (isLoadingCollection || isLoadingReviews)) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-2 text-muted-foreground">
          <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span>Loading catalog...</span>
        </div>
      </div>
    );
  }

  const reviews = reviewsResponse?.data?.reviews || [];

  return (
    <div className="container md:py-4 lg:py-8">
      {/* Header */}
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="holographic-text">Discover Fragrances</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Explore our curated collection of premium perfumes.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="w-full">
            <LocalSearch
              route="/catalog"
              placeholder="Search perfumes..."
              otherClasses="w-full"
            />
          </div>

          {/* Controls */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-x-3 sm:space-y-0">
            <div className="w-full sm:w-1/2">
              <SortingControls
                route="/catalog"
                sortOptions={PERFUME_SORT_OPTIONS}
                defaultOption="popularity-desc"
              />
            </div>

            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex w-full items-center justify-center sm:w-1/2"
            >
              <SlidersHorizontal className="mr-2 size-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {showFilters && (
            <ProductFilters
              route="/catalog"
              showFilters={showFilters}
              setShowFilters={setShowFilters}
            />
          )}

          <div className="flex-1 space-y-6">
            {selectedItems.length > 0 && (
              <ComparisonBar
                selectedCount={selectedItems.length}
                onCompare={handleCompare}
              />
            )}

            <DataRenderer
              success={success}
              error={error}
              data={perfumes}
              empty={EMPTY_PERFUME}
              render={(perfumes) => (
                <>
                  <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                    {perfumes.map((perfume, index) => {
                      const isFavourite =
                        wishlistsResponse?.data?.some((wishlist) =>
                          wishlist.perfumes.some(
                            (p) => p.perfume._id === perfume._id
                          )
                        ) || false;

                      const onCompareToggle = () =>
                        handleCompareToggle(perfume._id);

                      const onWishlistClick = () =>
                        setSelectedPerfume({
                          id: perfume._id,
                          name: perfume.name,
                        });

                      const isSelected = selectedItems.includes(perfume._id);

                      const inCollection =
                        collectionResponse?.data?.perfumes
                          .map((perfume) => perfume.perfume._id)
                          .includes(perfume._id) || false;

                      const onCollectionToggle = () =>
                        inCollection
                          ? removeFromCollectionMutation.mutate(perfume._id)
                          : addToCollectionMutation.mutate(perfume._id);

                      return (
                        <PerfumeCard
                          key={perfume._id + String(index)}
                          id={perfume._id}
                          name={perfume.name}
                          price={perfume.fullPrice}
                          images={perfume.images}
                          brand={perfume.brand}
                          review={reviews.find(
                            (r) => r.perfume._id === perfume._id
                          )}
                          affiliateLink={perfume.affiliateLink}
                          interactive={{
                            wishlist: {
                              isFavourite,
                              onWishlistClick,
                            },
                            collection: {
                              inCollection,
                              onCollectionToggle,
                            },
                            comparison: {
                              isSelected,
                              onCompareToggle,
                            },
                          }}
                        />
                      );
                    })}
                  </div>

                  {/* Infinite scroll loading indicator */}
                  {isNext && (
                    <div ref={ref} className="flex justify-center py-4">
                      {isLoading ? (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                          <span className="text-sm">
                            Loading more perfumes...
                          </span>
                        </div>
                      ) : (
                        <div className="h-4" /> // Spacer for intersection observer
                      )}
                    </div>
                  )}
                </>
              )}
            />
          </div>
        </div>
      </div>

      {/* Wishlist Dialog */}
      {selectedPerfume && (
        <WishlistSelectDialog
          isOpen={!!selectedPerfume}
          onOpenChange={(open) => !open && setSelectedPerfume(null)}
          onSelect={handleWishlistSelect}
          onUnSelect={handleWishlistUnselect}
          perfume={selectedPerfume.id}
          perfumeName={selectedPerfume.name}
          wishlists={wishlistsResponse?.data || []}
          isLoading={isLoadingWishlists}
        />
      )}
    </div>
  );
}
