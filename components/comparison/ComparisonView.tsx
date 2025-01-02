'use client';

import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Perfume } from '@/types/models/fragrance';

import { CharacteristicsChart } from './CharacteristicsChart';
import { MetricsComparison } from './MetricsComparison';
import { ScentPyramid } from './ScentPyramid';
import { ShareDialog } from './ShareDialog';

interface ComparisonViewProps {
  products: Perfume[];
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
        .map((note) => note.note.name)
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
            key={product._id}
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
                onClick={() => onRemove(product._id)}
              >
                <X className="size-4" />
              </Button>

              {/* Product Image */}
              <div className="relative aspect-square">
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  className="size-full object-cover transition-transform duration-500"
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
                      {(product.fullPrice / product.size).toFixed(2)}/ml
                    </div>
                  </div>
                  <StarRating rating={4.5} />
                </div>

                <div className="flex flex-wrap gap-2">
                  {product?.tags?.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant="secondary"
                      className={cn(
                        'transition-colors',
                        hoveredSection === tag.name &&
                          'bg-primary text-primary-foreground'
                      )}
                      onMouseEnter={() => setHoveredSection(tag.name)}
                      onMouseLeave={() => setHoveredSection(null)}
                    >
                      {tag.name}
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
        {products.map((product) => (
          <Card key={product._id} className="relative overflow-hidden p-6">
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
      <ShareDialog text="Share Comparison" />
    </div>
  );
}
