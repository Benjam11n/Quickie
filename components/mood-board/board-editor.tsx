"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BoardCanvas } from "./board-canvas";
import { BoardSidebar } from "./board-sidebar";
import { MoodBoard, Product } from "@/lib/types";
import { useMoodBoards } from "@/hooks/use-mood-boards";
import { Save } from "lucide-react";

interface BoardEditorProps {
  board: MoodBoard;
  products: Product[];
}

export function BoardEditor({ board, products }: BoardEditorProps) {
  const { updateBoard, addPerfumeToBoard } = useMoodBoards();
  const [name, setName] = useState(board.name);

  const handleNameChange = () => {
    if (name.trim() !== board.name) {
      updateBoard(board.id, { name: name.trim() });
    }
  };

  const handleAddPerfume = (product: Product) => {
    // Add perfume to a random position within the canvas
    addPerfumeToBoard(board.id, product.id, {
      x: Math.random() * 600,
      y: Math.random() * 400,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          onBlur={handleNameChange}
          className="text-xl font-bold bg-transparent border-none hover:bg-accent px-2 rounded-md max-w-md"
        />

        <Button className="gap-2">
          <Save className="h-4 w-4" />
          Save Changes
        </Button>
      </div>

      <div className="flex gap-6">
        <div className="flex-1">
          <Card className="p-6">
            <BoardCanvas board={board} products={products} />
          </Card>
        </div>
        <BoardSidebar
          board={board}
          products={products}
          onAddPerfume={handleAddPerfume}
        />
      </div>
    </div>
  );
}
