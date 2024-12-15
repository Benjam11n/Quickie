'use client';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
} from '@dnd-kit/core';
import { Plus } from 'lucide-react';
import { DraggablePerfume } from './DraggablePerfume';
import { DroppableArea } from './DroppableArea';
import { Product } from '@/types/fragrance';
import { MoodBoard } from '@/types';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { useState } from 'react';

interface BoardCanvasProps {
  board: MoodBoard;
  products: Product[];
  selectedSquare: number | null;
  onSquareSelect: (squareId: number) => void;
}

const GRID_SIZE = 9;

export function BoardCanvas({
  board,
  products,
  selectedSquare,
  onSquareSelect,
}: BoardCanvasProps) {
  const { updatePerfumePosition } = useMoodBoards();
  const [activeId, setActiveId] = useState<string | null>(null);

  // Configure sensors for drag and drop
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5, // Minimum drag distance to start
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const targetSquareId = Number(over.id);
      const isTargetEmpty = !getPerfumeAtPosition(targetSquareId);

      if (isTargetEmpty) {
        // Convert square ID to grid position
        const x = targetSquareId % 3;
        const y = Math.floor(targetSquareId / 3);

        updatePerfumePosition(board.id, active.id as string, { x, y });
      }
    }

    setActiveId(null);
  };

  const getPerfumeAtPosition = (squareId: number) => {
    const x = squareId % 3;
    const y = Math.floor(squareId / 3);
    return board.perfumes.find((p) => p.position.x === x && p.position.y === y);
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border bg-background/50">
        <div className="grid h-full w-full grid-cols-3 gap-4 p-4">
          {Array.from({ length: GRID_SIZE }).map((_, index) => {
            const perfume = getPerfumeAtPosition(index);
            const product = perfume
              ? products.find((p) => p.id === perfume.id)
              : null;

            return (
              <DroppableArea key={index} id={index}>
                <div
                  className={`relative aspect-square rounded-lg border-2 transition-all ${
                    selectedSquare === index
                      ? 'border-primary border-dashed bg-primary/5'
                      : 'border-border border-dashed hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onClick={() => !perfume && onSquareSelect(index)}
                >
                  {product ? (
                    <DraggablePerfume
                      id={product.id}
                      product={product}
                      isActive={activeId === product.id}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Plus
                        className={`h-6 w-6 ${
                          selectedSquare === index
                            ? 'text-primary'
                            : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                  )}
                </div>
              </DroppableArea>
            );
          })}
        </div>
      </div>
    </DndContext>
  );
}
