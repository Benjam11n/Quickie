'use client';

import { Plus, Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ComparisonView } from '@/components/comparison';
import { ProductSelector } from '@/components/product-selector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/lib/types/fragrance';

export default function ComparePage() {
  const router = useRouter();
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const handleAddProduct = (product: Product) => {
    const newProducts =
      selectedProducts.length >= 3
        ? [...selectedProducts.slice(1), product]
        : [...selectedProducts, product];

    setSelectedProducts(newProducts);
    setShowSelector(false);

    // Create URL path with product IDs
    const productIds = newProducts.map((p) => p.id).join('/');
    if (productIds) {
      router.push(`/compare/${productIds}`);
    } else {
      router.push('/compare');
    }
  };

  const handleRemoveProduct = (productId: string) => {
    const newProducts = selectedProducts.filter((p) => p.id !== productId);
    setSelectedProducts(newProducts);

    // Update URL after removing product
    const productIds = newProducts.map((p) => p.id).join('/');
    if (productIds) {
      router.push(`/compare/${productIds}`);
    } else {
      router.push('/compare');
    }
  };

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Compare Fragrances
            </span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Compare perfumes and analyze their notes, characteristics, and
            similarities.
          </p>
        </div>

        {selectedProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="mx-auto max-w-sm space-y-4">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/10">
                <Scale className="size-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Start Comparing</h3>
              <p className="text-muted-foreground">
                Select up to three fragrances to compare their notes,
                characteristics, and more.
              </p>
              <Button
                onClick={() => setShowSelector(true)}
                className="glow-effect"
              >
                <Plus className="mr-2 size-4" />
                Add Perfume
              </Button>
            </div>
          </Card>
        ) : (
          <>
            <div className="flex justify-end">
              {selectedProducts.length < 3 && (
                <Button
                  onClick={() => setShowSelector(true)}
                  className="glow-effect"
                >
                  <Plus className="mr-2 size-4" />
                  Add Perfume ({selectedProducts.length}/3)
                </Button>
              )}
            </div>

            <ComparisonView
              products={selectedProducts}
              onRemove={handleRemoveProduct}
            />
          </>
        )}
      </div>

      <ProductSelector
        open={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleAddProduct}
        excludeIds={selectedProducts.map((p) => p.id)}
      />
    </div>
  );
}
