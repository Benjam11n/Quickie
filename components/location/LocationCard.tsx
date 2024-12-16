'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  MapPin,
  Navigation,
  Clock,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { VendingLocation } from '@/types';
import { products } from '@/types/data';

interface LocationCardProps {
  location: VendingLocation;
  isSelected: boolean;
  onSelect: () => void;
}

export function LocationCard({
  location,
  isSelected,
  onSelect,
}: LocationCardProps) {
  const [showPerfumes, setShowPerfumes] = useState(false);

  return (
    <Card
      className={cn(
        'p-4 cursor-pointer hover-lift transition-all duration-300',
        isSelected
          ? 'gradient-border ring-2 ring-primary'
          : 'hover:border-primary'
      )}
      onClick={onSelect}
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold">{location.name}</h3>
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mr-1" />
              {location.address}
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation();
              window.open(
                `https://www.google.com/maps/dir/?api=1&destination=${location.coordinates.lat},${location.coordinates.lng}`,
                '_blank'
              );
            }}
          >
            <Navigation className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center text-muted-foreground">
            <Clock className="h-4 w-4 mr-1" />
            {location.hours}
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
              <ChevronUp className="h-4 w-4 mr-1" />
            ) : (
              <ChevronDown className="h-4 w-4 mr-1" />
            )}
            {location.stockLevel} fragrances
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
              <div className="pt-2 space-y-2 border-t">
                {location.availablePerfumes.map((item) => {
                  const product = products.find((p) => p.id === item.productId);
                  if (!product) return null;

                  return (
                    <div
                      key={item.productId}
                      className="flex items-center justify-between text-sm"
                    >
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-muted-foreground text-xs">
                          {product.brand}
                        </p>
                      </div>
                      <Badge
                        variant={item.quantity > 3 ? 'default' : 'secondary'}
                      >
                        {item.quantity} left
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
