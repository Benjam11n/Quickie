"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface DraggablePerfumeProps {
  id: string;
  product: Product;
  position: { x: number; y: number };
  isActive: boolean;
}

export function DraggablePerfume({
  id,
  product,
  position,
  isActive,
}: DraggablePerfumeProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id,
  });

  const style = {
    transform: CSS.Translate.toString(transform),
    left: position.x,
    top: position.y,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn("absolute w-32 cursor-move", isActive && "z-10")}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="bg-card rounded-lg overflow-hidden shadow-lg">
        <div className="aspect-square relative">
          <img
            src={product.images[0]}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="p-2">
          <p className="text-sm font-medium truncate">{product.name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {product.brand}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
