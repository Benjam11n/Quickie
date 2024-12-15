'use client';

import { motion } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import { useState } from 'react';

import { ProductSelector } from '@/components/product-selector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/fragrance';
const MAX_COMPARISONS = 3;

interface NoteComparisonToolProps {
  initialProducts?: Product[];
}

export function NoteComparisonTool({
  initialProducts = [],
}: NoteComparisonToolProps) {
  const [selectedProducts, setSelectedProducts] =
    useState<Product[]>(initialProducts);
  const [showSelector, setShowSelector] = useState(false);

  const getAllNotes = (product: Product) => {
    const notes: { [key: string]: number } = {};
    Object.values(product.notes)
      .flat()
      .forEach((note) => {
        notes[note.name] = note.percentage;
      });
    return notes;
  };

  const getOverlappingNotes = () => {
    if (selectedProducts.length < 2) return new Set<string>();

    const allNotes = selectedProducts.map(getAllNotes);
    const firstNotes = Object.keys(allNotes[0]);

    return new Set(
      firstNotes.filter((note) =>
        allNotes.every((productNotes) => note in productNotes)
      )
    );
  };

  const getUniqueNotes = (productIndex: number) => {
    const currentNotes = Object.keys(
      getAllNotes(selectedProducts[productIndex])
    );
    const otherNotes = new Set(
      selectedProducts
        .filter((_, i) => i !== productIndex)
        .flatMap((p) => Object.keys(getAllNotes(p)))
    );

    return currentNotes.filter((note) => !otherNotes.has(note));
  };

  const calculateSimilarity = (product1: Product, product2: Product) => {
    const notes1 = getAllNotes(product1);
    const notes2 = getAllNotes(product2);
    const allNotes = new Set([...Object.keys(notes1), ...Object.keys(notes2)]);

    let similarity = 0;
    let total = 0;

    allNotes.forEach((note) => {
      const value1 = notes1[note] || 0;
      const value2 = notes2[note] || 0;
      similarity += Math.min(value1, value2);
      total += Math.max(value1, value2);
    });

    return total > 0 ? (similarity / total) * 100 : 0;
  };

  const handleAddProduct = (product: Product) => {
    setSelectedProducts((prev) => [...prev, product]);
    setShowSelector(false);
  };

  const handleRemoveProduct = (index: number) => {
    setSelectedProducts((prev) => prev.filter((_, i) => i !== index));
  };

  const overlappingNotes = getOverlappingNotes();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Note Comparison</h2>
        {selectedProducts.length < MAX_COMPARISONS && (
          <Button onClick={() => setShowSelector(true)} className="glow-effect">
            <Plus className="mr-2 size-4" />
            Add Perfume
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {selectedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="relative overflow-hidden p-6">
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2"
                onClick={() => handleRemoveProduct(index)}
              >
                <X className="size-4" />
              </Button>

              <div className="space-y-4">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="size-full object-cover"
                  />
                </div>

                <div>
                  <h3 className="text-lg font-semibold">{product.name}</h3>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Sparkles className="size-4 text-primary" />
                    <h4 className="font-medium">Unique Notes</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {getUniqueNotes(index).map((note) => (
                      <Badge
                        key={note}
                        variant="secondary"
                        className="bg-primary/10 text-primary"
                      >
                        {note}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedProducts.length > 1 && index > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      Similarity with {selectedProducts[0].name}:
                      <span className="ml-2 font-medium text-primary">
                        {calculateSimilarity(
                          selectedProducts[0],
                          product
                        ).toFixed(1)}
                        %
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {selectedProducts.length >= 2 && (
        <Card className="bg-gradient-to-br from-pink-500/10 to-violet-500/10 p-6">
          <h3 className="mb-4 font-semibold">Common Notes</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from(overlappingNotes).map((note) => (
              <Badge key={note} className="gradient-border">
                {note}
              </Badge>
            ))}
          </div>
        </Card>
      )}

      <ProductSelector
        open={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleAddProduct}
        excludeIds={selectedProducts.map((p) => p.id)}
      />
    </div>
  );
}
