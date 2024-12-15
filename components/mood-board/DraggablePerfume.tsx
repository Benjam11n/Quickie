import { Product } from '@/types/fragrance';
import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

interface DraggablePerfumeProps {
  id: string;
  product: Product;
  isActive: boolean;
}

export function DraggablePerfume({
  id,
  product,
  isActive,
}: DraggablePerfumeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });

  return (
    <motion.div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
      animate={
        transform
          ? {
              x: transform.x,
              y: transform.y,
              scale: isActive ? 1.05 : 1,
              zIndex: isActive ? 10 : 0,
            }
          : {}
      }
    >
      <div className="h-full w-full p-2">
        <img
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full rounded-md object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2">
          <p className="text-xs font-medium text-white">{product.name}</p>
        </div>
      </div>
    </motion.div>
  );
}
