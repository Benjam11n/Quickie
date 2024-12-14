"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoodBoard, Product } from "@/lib/types";
import { useMoodBoards } from "@/hooks/use-mood-boards";
import { Plus, Share2, Tags, X } from "lucide-react";
import { useState } from "react";

interface BoardSidebarProps {
  board: MoodBoard;
  products: Product[];
  onAddPerfume: (product: Product) => void;
}

export function BoardSidebar({
  board,
  products,
  onAddPerfume,
}: BoardSidebarProps) {
  const { addTagToBoard, removeTagFromBoard, toggleBoardVisibility } =
    useMoodBoards();
  const [newTag, setNewTag] = useState("");

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim()) {
      addTagToBoard(board.id, newTag.trim());
      setNewTag("");
    }
  };

  const noteDistribution = board.perfumes.reduce((acc, perfume) => {
    const product = products.find((p) => p.id === perfume.id);
    if (!product) return acc;

    Object.values(product.notes)
      .flat()
      .forEach((note) => {
        acc[note.name] = (acc[note.name] || 0) + note.percentage;
      });

    return acc;
  }, {} as Record<string, number>);

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
            <Tags className="h-4 w-4 text-muted-foreground" />
          </div>

          <form onSubmit={handleAddTag} className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add tag..."
              className="flex-1"
            />
            <Button type="submit" size="icon" variant="ghost">
              <Plus className="h-4 w-4" />
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
                <X className="ml-1 h-3 w-3" />
              </Badge>
            ))}
          </div>
        </div>
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
              <Share2 className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-3">
            {normalizedDistribution.map(({ name, percentage }) => (
              <div key={name}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{name}</span>
                  <span>{percentage.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
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

      <Card className="p-4">
        <Label className="text-sm font-medium">Add Perfumes</Label>
        <ScrollArea className="h-[300px] mt-2">
          <div className="space-y-2 pr-4">
            {products
              .filter(
                (product) => !board.perfumes.some((p) => p.id === product.id)
              )
              .map((product) => (
                <button
                  key={product.id}
                  className="w-full p-2 rounded-lg hover:bg-accent flex items-center gap-3 transition-colors"
                  onClick={() => onAddPerfume(product)}
                >
                  <div className="w-12 h-12 rounded-md overflow-hidden">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="text-left">
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {product.brand}
                    </p>
                  </div>
                </button>
              ))}
          </div>
        </ScrollArea>
      </Card>
    </div>
  );
}
