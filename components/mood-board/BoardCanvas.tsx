'use client';
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useSensor,
  useSensors,
  MouseSensor,
} from '@dnd-kit/core';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';

import { useEditMoodboardStore } from '@/hooks/stores/use-edit-mood-boards-store';
import { cn } from '@/lib/utils';
import { BoardDimensions, BoardLayout, MoodBoardView } from '@/types';
import { PerfumeView } from '@/types/fragrance';

import { DraggablePerfume } from './DraggablePerfume';
import { DroppableArea } from './DroppableArea';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

interface BoardCanvasProps {
  board: MoodBoardView;
  perfumes: PerfumeView[];
  selectedSquare?: number | null;
  onSquareSelect?: (squareId: number) => void;
  onRemovePerfume?: (perfumeId: string) => void;
}

export function BoardCanvas({
  board,
  perfumes,
  selectedSquare,
  onSquareSelect,
  onRemovePerfume,
}: BoardCanvasProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const { updatePerfumePosition, updateDimensions } = useEditMoodboardStore();

  // Create a helper function to get dimensions from layout
  const getDimensionsFromLayout = (layout: BoardLayout): BoardDimensions => {
    switch (layout) {
      case 'grid2x4':
        return { layout, cols: 2, rows: 4 };
      case 'grid4x2':
        return { layout, cols: 4, rows: 2 };
      case 'pinterest':
        return { layout, cols: 3, rows: 4 };
      case 'grid3x3':
      default:
        return { layout, cols: 3, rows: 3 };
    }
  };

  // Modify the layout change handler
  const handleLayoutChange = (newLayout: BoardLayout) => {
    // Update dimensions in store
    updateDimensions(getDimensionsFromLayout(newLayout));
  };

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over) {
      const draggedPerfumeId = active.id as string;
      const targetSquareId = Number(over.id);
      const isTargetEmpty = !getPerfumeAtPosition(targetSquareId);

      if (isTargetEmpty) {
        const x = targetSquareId % board.dimensions.cols;
        const y = Math.floor(targetSquareId / board.dimensions.cols);

        updatePerfumePosition(draggedPerfumeId, { x, y });
      }
    }
    setActiveId(null);
  };

  const getPerfumeAtPosition = (squareId: number) => {
    const x = squareId % board.dimensions.cols;
    const y = Math.floor(squareId / board.dimensions.cols);
    return board.perfumes?.find(
      (p) => p.position.x === x && p.position.y === y
    );
  };

  const gridSize = {
    cols: board.dimensions.cols,
    rows: board.dimensions.rows,
    total: board.dimensions.cols * board.dimensions.rows,
  };
  const gridClasses = {
    grid3x3: 'grid-cols-3 grid-rows-3 aspect-square',
    grid2x4: 'grid-cols-2 grid-rows-4 aspect-[1/2]',
    grid4x2: 'grid-cols-4 grid-rows-2 aspect-[2/1]',
    pinterest: 'grid-cols-3 grid-rows-4 aspect-[3/4]',
  };

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Layout</h2>
          <Select
            value={board.dimensions.layout}
            onValueChange={(value) => handleLayoutChange(value as BoardLayout)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Layout" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grid3x3">3x3 Grid</SelectItem>
              <SelectItem value="grid2x4">Portrait (2x4)</SelectItem>
              <SelectItem value="grid4x2">Landscape (4x2)</SelectItem>
              <SelectItem value="pinterest">Pinterest Style</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div
          className={cn(
            'relative w-full overflow-hidden rounded-lg border bg-background/50',
            board.dimensions.layout === 'pinterest' &&
              'max-h-[800px] overflow-y-auto'
          )}
        >
          <div
            className={cn(
              'grid gap-4 p-4',
              gridClasses[board.dimensions.layout]
            )}
          >
            {Array.from({ length: gridSize.total }).map((_, index) => {
              const perfume = getPerfumeAtPosition(index);
              const product = perfume
                ? perfumes.find((p) => p._id === perfume.perfume._id)
                : null;

              return (
                <DroppableArea key={index} id={index}>
                  <div
                    className={cn(
                      'relative aspect-square rounded-lg border-2 transition-all',
                      selectedSquare === index
                        ? 'border-dashed border-primary bg-primary/5'
                        : 'border-dashed border-border hover:border-primary/50 hover:bg-primary/5',
                      board.dimensions.layout === 'pinterest' &&
                        index % 3 === 1 &&
                        'aspect-[3/4]' // Taller middle column for Pinterest style
                    )}
                    onClick={() => !perfume && onSquareSelect?.(index)}
                  >
                    {product ? (
                      <div>
                        <DraggablePerfume
                          id={product._id}
                          product={product}
                          isActive={activeId === product._id}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-2 size-6 rounded-full bg-background/80 hover:bg-background"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRemovePerfume?.(product._id);
                          }}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Plus
                          className={cn(
                            'size-6',
                            selectedSquare === index
                              ? 'text-primary'
                              : 'text-muted-foreground'
                          )}
                        />
                      </div>
                    )}
                  </div>
                </DroppableArea>
              );
            })}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
