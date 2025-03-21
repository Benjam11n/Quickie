'use client';

import { motion } from 'framer-motion';
import { X, Plus, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

import { ProductSelector } from '@/components/fragrance/ProductSelector';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { Perfume } from '@/types/models/fragrance';

import { StarRating } from '../StarRating';

const MAX_COMPARISONS = 2;

interface NoteComparisonViewProps {
  perfumes: Perfume[];
}

export function NoteComparisonView({ perfumes }: NoteComparisonViewProps) {
  const router = useRouter();
  const [showSelector, setShowSelector] = useState(false);
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const { prefetchPerfumes } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: query || '',
  });
  const [selectedNote, setSelectedNote] = useState<string | null>(null);

  const handleRemoveProduct = (productId: string) => {
    const newProducts = perfumes.filter((p) => p._id !== productId);

    if (newProducts.length === 0) {
      router.push(ROUTES.COMPARE);
    } else {
      const productIds = newProducts.map((p) => p._id).join('/');
      router.push(ROUTES.NOTES_COMPARE(productIds));
    }
  };

  const getAllNotes = (product: Perfume) => {
    const notes: { [key: string]: number } = {};
    Object.values(product.notes || {})
      .flat()
      .forEach((note) => {
        notes[note.note.name] = note.intensity;
      });
    return notes;
  };

  const findCommonNotes = () => {
    if (perfumes.length < 2) return new Set<string>();

    const allNotes = perfumes.map((product) =>
      Object.values(product.notes)
        .flat()
        .map((note) => note.note.name)
    );

    return new Set(
      allNotes[0].filter((note) =>
        allNotes.slice(1).every((notes) => notes.includes(note))
      )
    );
  };

  const getUniqueNotes = (productIndex: number) => {
    const currentNotes = Object.keys(getAllNotes(perfumes[productIndex]));
    const otherNotes = new Set(
      perfumes
        .filter((_, i) => i !== productIndex)
        .flatMap((p) => Object.keys(getAllNotes(p)))
    );

    return currentNotes.filter((note) => !otherNotes.has(note));
  };

  const calculateSimilarity = (product1: Perfume, product2: Perfume) => {
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

  const handleAddProduct = (product: Perfume) => {
    const newProducts = [...perfumes, product];
    const productIds = newProducts.map((p) => p._id).join('/');
    router.push(ROUTES.NOTES_COMPARE(productIds));
    setShowSelector(false);
  };

  const commonNotes = findCommonNotes();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">
          <span className="holographic-text">
            {perfumes.length === 1
              ? perfumes[0].name
              : perfumes.length === 2
                ? `${perfumes[0].name} vs ${perfumes[1].name}`
                : 'Compare Notes'}
          </span>
        </h1>
        <p className="mt-2 text-muted-foreground">
          {perfumes.length > 0 &&
            'Compare perfumes and analyze their notes and similarities.'}
        </p>
      </div>

      {/* Add Product Button */}
      <div className="flex justify-end">
        {perfumes.length < MAX_COMPARISONS && (
          <Button
            onClick={() => setShowSelector(true)}
            onMouseEnter={prefetchPerfumes}
          >
            <Plus className="mr-2 size-4" />
            Add Perfume ({perfumes.length}/{MAX_COMPARISONS})
          </Button>
        )}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {perfumes.map((product, index) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="group relative overflow-hidden">
              {/* Same card structure as ComparisonView */}
              <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm" />

              <Button
                variant="outline"
                size="icon"
                className="absolute right-2 top-2 z-10 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleRemoveProduct(product._id)}
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
                  <p className="text-muted-foreground">
                    {product?.brand?.name}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-xl font-bold text-transparent">
                      ${product.fullPrice}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      ${(product.fullPrice / (product.size || 1)).toFixed(2)}/ml
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

                {perfumes.length > 1 && index > 0 && (
                  <div className="border-t pt-4">
                    <p className="text-sm text-muted-foreground">
                      Similarity with {perfumes[0].name}:
                      <span className="ml-2 font-medium text-primary">
                        {calculateSimilarity(perfumes[0], product).toFixed(1)}%
                      </span>
                    </p>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Common Notes Section */}
      {perfumes.length >= 2 && (
        <Card className="relative overflow-hidden p-6">
          <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm" />
          <div className="relative">
            <h3 className="mb-4 text-xl font-bold">Common Notes</h3>
            <div className="flex flex-wrap gap-2">
              {Array.from(commonNotes).map((note) => (
                <Badge
                  key={note}
                  variant="secondary"
                  className={
                    selectedNote === note
                      ? 'bg-primary text-primary-foreground'
                      : ''
                  }
                  onClick={() => setSelectedNote(note)}
                >
                  {note}
                </Badge>
              ))}
            </div>
          </div>
        </Card>
      )}

      <ProductSelector
        isOpen={showSelector}
        onOpenChange={setShowSelector}
        onSelect={handleAddProduct}
        selectedIds={perfumes.map((p) => p._id)}
      />
    </div>
  );
}
