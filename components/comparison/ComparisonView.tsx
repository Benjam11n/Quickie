'use client';

import { motion } from 'framer-motion';
import { X, Share2 } from 'lucide-react';
import { useState } from 'react';

import { StarRating } from '@/components/star-rating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Product } from '@/types/fragrance';
import { cn } from '@/lib/utils';

import { CharacteristicsChart } from './CharacteristicsChart';
import { MetricsComparison } from './MetricsComparison';
import { ScentPyramid } from './ScentPyramid';

interface ComparisonViewProps {
  products: Product[];
  onRemove: (productId: string) => void;
}

export function ComparisonView({ products, onRemove }: ComparisonViewProps) {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);

  const findCommonNotes = () => {
    if (products.length < 2) return new Set<string>();

    const allNotes = products.map((product) =>
      Object.values(product.notes)
        .flat()
        .map((note) => note.name)
    );

    return new Set(
      allNotes[0].filter((note) =>
        allNotes.slice(1).every((notes) => notes.includes(note))
      )
    );
  };

  const commonNotes = findCommonNotes();

  return (
    <div className="space-y-8">
      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {products.map((product, index) => (
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
                onClick={() => onRemove(product.id)}
              >
                <X className="size-4" />
              </Button>

              {/* Product Image */}
              <div className="relative aspect-square">
                <img
                  src={product.images[0]}
                  alt={product.name}
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

                <div className="flex flex-wrap gap-2">
                  {product.categories.map((category) => (
                    <Badge
                      key={category}
                      variant="secondary"
                      className={cn(
                        'transition-colors',
                        hoveredSection === category &&
                          'bg-primary text-primary-foreground'
                      )}
                      onMouseEnter={() => setHoveredSection(category)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Note Pyramids */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {products.map((product, index) => (
          <Card key={product.id} className="relative overflow-hidden p-6">
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm" />
            <div className="relative">
              <h3 className="mb-6 text-xl font-bold">Note Pyramid</h3>
              <ScentPyramid
                notes={product.notes}
                selectedNote={selectedNote}
                onNoteSelect={setSelectedNote}
                commonNotes={commonNotes}
              />
            </div>
          </Card>
        ))}
      </div>

      {/* Characteristics Chart */}
      <Card className="relative overflow-hidden p-6">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm" />
        <div className="relative">
          <h3 className="mb-6 text-xl font-bold">Characteristics Comparison</h3>
          <div className="h-[400px]">
            <CharacteristicsChart products={products} />
          </div>
        </div>
      </Card>

      {/* Additional Metrics */}
      <MetricsComparison products={products} />

      {/* Share Button */}
      <div className="fixed bottom-16 right-16 z-50">
        <Button size="lg" className="glow-effect gap-2 shadow-lg">
          <Share2 className="size-4" />
          Share Comparison
        </Button>
      </div>
    </div>
  );
}
