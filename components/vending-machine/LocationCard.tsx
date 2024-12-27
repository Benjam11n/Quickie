'use client';

import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  ChevronDown,
  ChevronUp,
  Clock,
} from 'lucide-react';
import { useState } from 'react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { VendingMachineView } from '@/types';

interface LocationCardProps {
  vendingMachine: VendingMachineView;
  isSelected: boolean;
  onSelect: () => void;
}

function getVendingMachineName(address: string): string {
  // Get first part before comma
  const name = address.split(',')[0];
  return name;
}

export function LocationCard({
  vendingMachine,
  isSelected,
  onSelect,
}: LocationCardProps) {
  const [showPerfumes, setShowPerfumes] = useState(false);

  return (
    <Card
      className={cn(
        'hover-lift cursor-pointer p-4 transition-all duration-300',
        isSelected ? 'ring-2 ring-primary' : 'hover:border-primary'
      )}
      onClick={onSelect}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">
              {getVendingMachineName(vendingMachine.location.address)}
            </h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="mr-1 size-4" />
              {vendingMachine.location.address}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="size-8"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${vendingMachine.location.coordinates[1]},${vendingMachine.location.coordinates[0]}`,
                '_blank'
              );
            }}
          >
            <Navigation className="size-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            {/* Change to Tags */}
            <Clock className="mr-2 size-4" />
            {'24/7'}
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2"
            onClick={(e) => {
              e.stopPropagation();
              setShowPerfumes(!showPerfumes);
            }}
          >
            {showPerfumes ? (
              <ChevronUp className="mr-1 size-4" />
            ) : (
              <ChevronDown className="mr-1 size-4" />
            )}
            {vendingMachine.inventory.length} fragrances
          </Button>
        </div>

        <AnimatePresence>
          {showPerfumes && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 border-t pt-2">
                {vendingMachine.inventory.map((item) => {
                  const product = item.perfumeId;

                  return (
                    <div
                      key={item.perfumeId._id}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.brand.name}
                        </p>
                      </div>
                      <Badge variant={item.stock > 3 ? 'default' : 'secondary'}>
                        {item.stock} left
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}
