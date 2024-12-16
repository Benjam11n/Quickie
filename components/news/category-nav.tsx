'use client';

import { motion } from 'framer-motion';
import { useRef } from 'react';

import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Category } from '@/types/news';

interface CategoryNavProps {
  categories: Category[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryNav({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryNavProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="relative">
      <ScrollArea className="w-full whitespace-nowrap rounded-lg border bg-background/50 backdrop-blur-sm">
        <div className="flex gap-2 p-4" ref={scrollRef}>
          {categories.map((category) => (
            <motion.div
              key={category.slug}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                className={cn(
                  'relative rounded-full px-4 py-2 transition-colors',
                  activeCategory === category.slug
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => onCategoryChange(category.slug)}
              >
                <span className="relative z-10">{category.name}</span>
                <span className="ml-2 text-xs text-muted-foreground">
                  {category.count}
                </span>
                {activeCategory === category.slug && (
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/10"
                    layoutId="activeCategory"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </motion.div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" className="invisible" />
      </ScrollArea>
    </div>
  );
}
