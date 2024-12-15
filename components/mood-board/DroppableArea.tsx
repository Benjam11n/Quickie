import { useDroppable } from '@dnd-kit/core';

interface DroppableAreaProps {
  id: number;
  children: React.ReactNode;
}

export function DroppableArea({ id, children }: DroppableAreaProps) {
  const { setNodeRef } = useDroppable({
    id: id.toString(),
  });

  return (
    <div ref={setNodeRef} className="relative">
      {children}
    </div>
  );
}
