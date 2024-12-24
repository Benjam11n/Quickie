'use client';

import { motion } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { ProductSelector } from '@/components/fragrance/ProductSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { Product } from '@/types/fragrance';

import { StarRating } from '../StarRating';

const MAX_COMPARISONS = 2;

interface NoteComparisonViewProps {
  initialProducts?: Product[];
}

export function NoteComparisonView({
  initialProducts = [],
}: NoteComparisonViewProps) {
  const router = useRouter();
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

  // Use effect to handle URL updates whenever selectedProducts changes
  useEffect(() => {
    const productIds =
      selectedProducts.length > 0
        ? selectedProducts.map((p) => p.id).join('/')
        : '';
    router.push(
      productIds.length > 0
        ? ROUTES.NOTES_COMPARE(productIds)
        : ROUTES.FULL_COMPARE(productIds)
    );
  }, [selectedProducts, router]);

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
            'Compare perfumes and analyze their notes and similarities.'}
        </p>
      </div>

      <div className="flex justify-end">
        {initialProducts.length < MAX_COMPARISONS && (
          <Button onClick={() => setShowSelector(true)}>
            <Plus className="mr-2 size-4" />
            Add Perfume ({initialProducts.length}/{MAX_COMPARISONS})
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {selectedProducts.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="group relative overflow-hidden">
              {/* Glass Effect Background */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm" />

              {/* Remove Button */}
              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleRemoveProduct(index)}
              >
                <X className="size-4" />
              </Button>

              {/* Product Image */}
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>

              {/* Product Info */}
              <div className="relative space-y-4 p-6">
                <div>
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-xl font-bold text-transparent">
                      ${product.price}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${(product.price / product.size).toFixed(2)}/ml
                    </div>
                  </div>
                  <StarRating rating={4.5} />
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
        <Card className="relative overflow-hidden p-6">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm" />
          <div className="relative">
            <h3 className="mb-4 text-xl font-bold">Common Notes</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(overlappingNotes).map((note) => (
                <Badge key={note} variant="secondary">
                  {note}
                </Badge>
              ))}
            </div>
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
