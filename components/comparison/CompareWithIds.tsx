'use client';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ComparisonView } from '@/components/comparison/ComparisonView';
import { ProductSelector } from '@/components/fragrance/ProductSelector';
import { Button } from '@/components/ui/button';
import { Product } from '@/types/fragrance';

interface CompareWithIdsProps {
  initialProducts: Product[];
}

const NUMBER_OF_PERFUMES = 2;

export function CompareWithIds({ initialProducts }: CompareWithIdsProps) {
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);

  const handleAddProduct = (product: Product) => {
    const newProducts =
      initialProducts.length >= NUMBER_OF_PERFUMES
        ? [...initialProducts.slice(1), product]
        : [...initialProducts, product];

    const productIds = newProducts.map((p) => p.id).join('/');
    router.push(`/compare/${productIds}`);
    setShowSelector(false);
  };

  const handleRemoveProduct = (productId: string) => {
    const newProducts = initialProducts.filter((p) => p.id !== productId);

    if (newProducts.length === 0) {
      router.push('/compare');
    } else {
      const productIds = newProducts.map((p) => p.id).join('/');
      router.push(`/compare/${productIds}`);
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
          {initialProducts.length < NUMBER_OF_PERFUMES && (
            <Button
              onClick={() => setShowSelector(true)}
              className="glow-effect"
            >
              <Plus className="mr-2 size-4" />
              Add Perfume ({initialProducts.length}/2)
            </Button>
          )}
        </div>
        <ComparisonView
          products={initialProducts}
          onRemove={handleRemoveProduct}
        />
      </div>
      <ProductSelector
        open={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleAddProduct}
        excludeIds={initialProducts.map((p) => p.id)}
      />
    </div>
  );
}
