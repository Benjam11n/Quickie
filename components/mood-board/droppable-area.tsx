"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";

interface DroppableAreaProps {
  children: React.ReactNode;
}

export function DroppableArea({ children }: DroppableAreaProps) {
  const { isOver, setNodeRef } = useDroppable({
    id: "board",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn("w-full h-full relative", isOver && "bg-primary/5")}
    >
      {children}
    </div>
  );
}
