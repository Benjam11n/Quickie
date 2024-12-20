'use client';

import { Plus, Share2, Tags, X } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { MoodBoard } from '@/types';
import { Product } from '@/types/fragrance';

interface BoardSidebarProps {
  board: MoodBoard;
  products: Product[];
  onAddPerfume: (product: Product) => void;
  selectedSquare: number | null;
}

export function BoardSidebar({
  board,
  products,
  onAddPerfume,
  selectedSquare,
}: BoardSidebarProps) {
  const { addTagToBoard, removeTagFromBoard, toggleBoardVisibility } =
    useMoodBoards();
  const [newTag, setNewTag] = useState('');

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTagToBoard(board.id, newTag.trim());
      setNewTag('');
    }
  };

  const noteDistribution = board.perfumes.reduce(
    (acc, perfume) => {
      const product = products.find((p) => p.id === perfume.id);
      if (!product) return acc;

      Object.values(product.notes)
        .flat()
        .forEach((note) => {
          acc[note.name] = (acc[note.name] || 0) + note.percentage;
        });

      return acc;
    },
    {} as Record<string, number>
  );

  const totalPercentage = Object.values(noteDistribution).reduce(
    (a, b) => a + b,
    0
  );
  const normalizedDistribution = Object.entries(noteDistribution)
    .map(([name, value]) => ({
      name,
      percentage: (value / totalPercentage) * 100,
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  return (
    <div className="w-80 space-y-6">
      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Board Tags</h3>
            <Tags className="size-4 text-muted-foreground" />
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Plus className="size-4" />
            </Button>
          </form>

          <div className="flex flex-wrap gap-2">
            {board.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="cursor-pointer hover:bg-destructive/10"
                onClick={() => removeTagFromBoard(board.id, tag)}
              >
                {tag}
                <X className="ml-1 size-3" />
              </Badge>
            ))}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <Label className="text-sm font-medium">
          {selectedSquare !== null
            ? `Add Perfume to Square ${selectedSquare + 1}`
            : 'Select a square first'}
        </Label>
        <ScrollArea className="mt-2 h-[300px]">
          <div className="space-y-2 pr-4">
            {selectedSquare === null ? (
              <p className="p-2 text-sm text-muted-foreground">
                Click on an empty square in the board to add a perfume
              </p>
            ) : (
              products
                .filter(
                  (product) => !board.perfumes.some((p) => p.id === product.id)
                )
                .map((product) => (
                  <button
                    key={product.id}
                    className="flex w-full items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent"
                    onClick={() => onAddPerfume(product)}
                  >
                    <div className="size-12 overflow-hidden rounded-md">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        width={48}
                        height={48}
                        className="size-full object-cover"
                      />
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {product.brand}
                      </p>
                    </div>
                  </button>
                ))
            )}
          </div>
        </ScrollArea>
      </Card>

      <Card className="p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Note Distribution</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => toggleBoardVisibility(board.id)}
            >
              <Share2 className="size-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {normalizedDistribution.map(({ name, percentage }) => (
              <div key={name}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{name}</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full bg-primary transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
