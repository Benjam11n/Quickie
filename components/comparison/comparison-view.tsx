"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, ArrowLeftRight } from "lucide-react";
import { CharacteristicsChart } from "./characteristics-chart";
import { NotePyramid } from "./note-pyramid";
import { MetricsComparison } from "./metrics-comparison";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
          >
            <Card className="group relative overflow-hidden">
              {/* Glass Effect Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm z-0" />

              {/* Remove Button */}
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                onClick={() => onRemove(product.id)}
              >
                <X className="h-4 w-4" />
              </Button>

              {/* Product Image */}
              <div className="aspect-square relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>

              {/* Product Info */}
              <div className="relative p-6 space-y-4">
                <div>
                  <h3 className="text-2xl font-bold">{product.name}</h3>
                  <p className="text-muted-foreground">{product.brand}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xl font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
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
                        "transition-colors",
                        hoveredSection === category &&
                          "bg-primary text-primary-foreground"
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {products.map((product, index) => (
          <Card key={product.id} className="p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm z-0" />
            <div className="relative">
              <h3 className="text-xl font-bold mb-6">Note Pyramid</h3>
              <NotePyramid
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
      <Card className="p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm z-0" />
        <div className="relative">
          <h3 className="text-xl font-bold mb-6">Characteristics Comparison</h3>
          <div className="h-[400px]">
            <CharacteristicsChart products={products} />
          </div>
        </div>
      </Card>

      {/* Additional Metrics */}
      <MetricsComparison products={products} />

      {/* Share Button */}
      <div className="fixed bottom-8 right-8">
        <Button size="lg" className="gap-2 shadow-lg glow-effect">
          <Share2 className="h-4 w-4" />
          Share Comparison
        </Button>
      </div>
    </div>
  );
}
