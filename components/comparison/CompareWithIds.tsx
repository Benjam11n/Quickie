'use client';
import { Plus } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ComparisonView } from '@/components/comparison/ComparisonView';
import { ProductSelector } from '@/components/fragrance/ProductSelector';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { Perfume } from '@/types/models/fragrance';

const MAX_COMPARISONS = 2;

interface CompareWithIdsProps {
  initialProducts: Perfume[];
}

export function CompareWithIds({ initialProducts }: CompareWithIdsProps) {
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const { prefetchPerfumes } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: query || '',
  });

  const handleAddProduct = (product: Perfume) => {
    const newProducts =
      initialProducts.length >= MAX_COMPARISONS
        ? [...initialProducts.slice(1), product]
        : [...initialProducts, product];

    const productIds = newProducts.map((p) => p._id).join('/');
    router.push(ROUTES.FULL_COMPARE(productIds));
    setShowSelector(false);
  };

  const handleRemoveProduct = (productId: string) => {
    const newProducts = initialProducts.filter((p) => p._id !== productId);

    if (newProducts.length === 0) {
      router.push(ROUTES.FULL_COMPARE(''));
    } else {
      const productIds = newProducts.map((p) => p._id).join('/');
      router.push(ROUTES.FULL_COMPARE(productIds));
    }
  };

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="holographic-text">
              {initialProducts?.length === 1
                ? `${initialProducts[0].name}`
                : initialProducts?.length === 2
                  ? `${initialProducts[0].name} vs ${initialProducts[1].name}`
                  : 'Compare Fragrances'}
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            {initialProducts &&
              'Compare perfumes and analyze their notes, characteristics, and similarities.'}
          </p>
        </div>

        <div className="flex justify-end">
          {initialProducts.length < MAX_COMPARISONS && (
            <Button
              onClick={() => setShowSelector(true)}
              onMouseEnter={prefetchPerfumes}
            >
              <Plus className="mr-2 size-4" />
              Add Perfume ({initialProducts.length}/{MAX_COMPARISONS})
            </Button>
          )}
        </div>
        <ComparisonView
          products={initialProducts}
          onRemove={handleRemoveProduct}
        />
      </div>

      <ProductSelector
        isOpen={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleAddProduct}
        selectedIds={initialProducts.map((p) => p._id)}
      />
    </div>
  );
}
