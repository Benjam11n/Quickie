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
import { useState } from 'react';

import { useEditMoodboardStore } from '@/hooks/stores/use-edit-mood-boards-store';
import { MoodBoardView } from '@/types';
import { Perfume } from '@/types/fragrance';

import { DraggablePerfume } from './DraggablePerfume';
import { DroppableArea } from './DroppableArea';

interface BoardCanvasProps {
  board: MoodBoardView;
  perfumes: Perfume[];
  selectedSquare?: number | null;
  onSquareSelect?: (squareId: number) => void;
}

const GRID_SIZE = 9;

export function BoardCanvas({
  board,
  perfumes,
  selectedSquare,
  onSquareSelect,
}: BoardCanvasProps) {
  const { updatePerfumePosition } = useEditMoodboardStore();
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
    const { over } = event;

    if (over) {
      const targetSquareId = Number(over.id);
      const isTargetEmpty = !getPerfumeAtPosition(targetSquareId);

      if (isTargetEmpty) {
        // Convert square ID to grid position
        const x = targetSquareId % 3;
        const y = Math.floor(targetSquareId / 3);

        updatePerfumePosition(board._id, { x, y });
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
        <div className="grid size-full grid-cols-3 gap-4 p-4">
          {Array.from({ length: GRID_SIZE }).map((_, index) => {
            const perfume = getPerfumeAtPosition(index);
            const product = perfume
              ? perfumes.find((p) => p.id === perfume.perfumeId)
              : null;

            return (
              <DroppableArea key={index} id={index}>
                <div
                  className={`relative aspect-square rounded-lg border-2 transition-all ${
                    selectedSquare === index
                      ? 'border-dashed border-primary bg-primary/5'
                      : 'border-dashed border-border hover:border-primary/50 hover:bg-primary/5'
                  }`}
                  onClick={() => !perfume && onSquareSelect?.(index)}
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
                        className={`size-6 ${
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
