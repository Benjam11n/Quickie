"use client";

import { DndContext, DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import { AnimatePresence } from "framer-motion";
import { useState } from "react";

import { useMoodBoards } from "@/hooks/use-mood-boards";
import { MoodBoard, Product } from "@/lib/types";

import { DraggablePerfume } from "./draggable-perfume";
import { DroppableArea } from "./droppable-area";


interface BoardCanvasProps {
  board: MoodBoard;
  products: Product[];
}

export function BoardCanvas({ board, products }: BoardCanvasProps) {
  const { updatePerfumePosition } = useMoodBoards();
  const [activeId, setActiveId] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, delta } = event;
    const perfume = board.perfumes.find((p) => p.id === active.id);

    if (perfume) {
      updatePerfumePosition(board.id, perfume.id, {
        x: perfume.position.x + delta.x,
        y: perfume.position.y + delta.y,
      });
    }

    setActiveId(null);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border bg-background/50">
        <DroppableArea>
          <AnimatePresence>
            {board.perfumes.map((perfume) => {
              const product = products.find((p) => p.id === perfume.id);
              if (!product) return null;

              return (
                <DraggablePerfume
                  key={perfume.id}
                  id={perfume.id}
                  product={product}
                  position={perfume.position}
                  isActive={activeId === perfume.id}
                />
              );
            })}
          </AnimatePresence>
        </DroppableArea>
      </div>
    </DndContext>
  );
}
