'use client';

import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { usePerfumes } from '@/hooks/queries/use-perfumes';
import { PerfumeView } from '@/types/fragrance';

import LocalSearch from '../search/LocalSearch';
import { SprayLoader } from '../SprayLoader';

interface ProductSelectorProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (product: PerfumeView) => void;
  selectedIds?: string[];
}

export function ProductSelector({
  isOpen,
  onOpenChange,
  onSelect,
  selectedIds = [],
}: ProductSelectorProps) {
  const searchParams = useSearchParams();
  const query = searchParams.get('query') || '';

  const { data, isPending } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: query || '',
    filter: '',
  });

  const { perfumes } = data?.data || {};

  const availablePerfumes =
    perfumes?.filter((perfume) => !selectedIds.includes(perfume._id)) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Select Perfume</DialogTitle>
        </DialogHeader>

        <div className="relative">
          <LocalSearch route="/compare" placeholder="Search perfumes..." />
        </div>

        <ScrollArea className="h-[300px] pr-4">
          {isPending ? (
            <div className="flex min-h-[300px] flex-1 items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <SprayLoader />
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="text-center"
                >
                  <span className="mb-2 text-sm font-semibold">
                    Preparing Our Collection...
                  </span>
                </motion.div>
              </div>
            </div>
          ) : availablePerfumes.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex min-h-[300px] flex-1 items-center justify-center"
            >
              <div className="flex flex-col items-center gap-2 text-center">
                <Search className="size-8 text-muted-foreground" />
                <p className="font-medium">No perfumes found</p>
                <p className="text-sm text-muted-foreground">
                  Try adjusting your search or filters
                </p>
              </div>
            </motion.div>
          ) : (
            <div className="space-y-2">
              {availablePerfumes.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <button
                    className="flex w-full items-center gap-4 rounded-lg p-4 transition-colors hover:bg-accent"
                    onClick={() => onSelect(product)}
                  >
                    <div className="size-12 overflow-hidden rounded-md">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        className="size-full object-cover"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="text-left">
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {product.brand.name}
                      </p>
                    </div>
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
