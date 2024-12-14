"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductSelector } from "@/components/product-selector";
import { ComparisonView } from "@/components/comparison/comparison-view";
import { Plus, Scale } from "lucide-react";
import { Product } from "@/lib/types";

export default function ComparePage() {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>([]);
  const [showSelector, setShowSelector] = useState(false);

  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prev) => {
      if (prev.length >= 3) {
        return [...prev.slice(1), product];
      }
      return [...prev, product];
    });
    setShowSelector(false);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  return (
    <div className="container py-10">
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
              Compare Fragrances
            </span>
          </h1>
          <p className="text-muted-foreground mt-2">
            Compare perfumes and analyze their notes, characteristics, and
            similarities.
          </p>
        </div>

        {selectedProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="max-w-sm mx-auto space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Scale className="h-8 w-8 text-primary" />
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
                <Plus className="mr-2 h-4 w-4" />
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
                  <Plus className="mr-2 h-4 w-4" />
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
