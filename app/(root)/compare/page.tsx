'use client';

import { Droplets, Plus, Scale } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ProductSelector } from '@/components/fragrance/ProductSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ROUTES } from '@/constants/routes';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { Perfume } from '@/types/models/fragrance';

export default function ComparePage() {
  const router = useRouter();
  const [isFullComparison, setIsFullComparison] = useState(true);
  const [showSelector, setShowSelector] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const { prefetchPerfumes } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: query || '',
  });

  const handleAddProduct = (product: Perfume) => {
    const newProducts = [product];

    setShowSelector(false);

    const productIds = newProducts.map((p) => p._id).join('/');
    if (isFullComparison) {
      router.push(ROUTES.FULL_COMPARE(productIds));
    } else {
      router.push(ROUTES.NOTES_COMPARE(productIds));
    }
  };

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="holographic-text">Compare Fragrances</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Compare perfumes and analyze their notes, characteristics, and
            similarities.
          </p>
        </div>

        <Tabs defaultValue="full-compare">
          <TabsList className="mb-8 grid w-full max-w-md grid-cols-2">
            <TabsTrigger
              value="full-compare"
              className="flex items-center gap-2"
            >
              <Scale className="size-4" />
              Full Comparison
            </TabsTrigger>
            <TabsTrigger value="notes-only" className="flex items-center gap-2">
              <Droplets className="size-4" />
              Notes Only
            </TabsTrigger>
          </TabsList>
          <TabsContent value="full-compare">
            <Card className="p-8 text-center">
              <div className="mx-auto max-w-sm space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/20">
                  <Scale className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Start Comparing</h3>
                <p className="text-muted-foreground">
                  Select two fragrances to compare their notes, characteristics,
                  and more.
                </p>
                <Button
                  onClick={() => {
                    setIsFullComparison(true);
                    setShowSelector(true);
                  }}
                  onMouseEnter={prefetchPerfumes}
                >
                  <Plus className="mr-1 size-4" />
                  Add Perfume
                </Button>
              </div>
            </Card>
          </TabsContent>
          <TabsContent value="notes-only">
            <Card className="p-8 text-center">
              <div className="mx-auto max-w-sm space-y-4">
                <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-primary/20">
                  <Droplets className="size-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Start Comparing</h3>
                <p className="text-muted-foreground">
                  Select two fragrances to compare their notes only.
                </p>
                <Button
                  onClick={() => {
                    setIsFullComparison(false);
                    setShowSelector(true);
                  }}
                  onMouseEnter={prefetchPerfumes}
                >
                  <Plus className="mr-1 size-4" />
                  Add Perfume
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <ProductSelector
        isOpen={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleAddProduct}
      />
    </div>
  );
}
