'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

import { cn } from '@/lib/utils';

interface RatingBarProps {
  value: number;
  onChange: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export function RatingBar({
  value,
  onChange,
  readonly = false,
  size = 'md',
}: RatingBarProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          onClick={() => !readonly && onChange(star)}
          className={cn(
            'transition-all duration-200',
            !readonly && 'hover:scale-110',
            readonly && 'cursor-default'
          )}
          whileHover={!readonly ? { scale: 1.1 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
        >
          <Star
            className={cn(
              sizes[size],
              'transition-colors duration-200',
              star <= value
                ? 'fill-primary text-primary'
                : 'stroke-muted-foreground text-muted'
            )}
          />
        </motion.button>
      ))}
    </div>
  );
}
