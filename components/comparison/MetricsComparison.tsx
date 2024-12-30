'use client';

import { motion } from 'framer-motion';
import {
  Clock,
  DollarSign,
  Star,
  Wind,
  Sparkles,
  Activity,
} from 'lucide-react';

import { Card } from '@/components/ui/card';
import { PerfumeView } from '@/types/fragrance';
interface MetricsComparisonProps {
  products: PerfumeView[];
}

export function MetricsComparison({ products }: MetricsComparisonProps) {
  const metrics = [
    {
      label: 'Price per ml',
      icon: DollarSign,
      getValue: (product: PerfumeView) =>
        `$${(product.fullPrice / product.size).toFixed(2)}/ml`,
    },
    {
      label: 'Sillage',
      icon: Wind,
      getValue: (product: PerfumeView) => `${product.scentProfile.sillage}%`,
    },
    {
      label: 'Longevity',
      icon: Clock,
      getValue: (product: PerfumeView) => `${product.scentProfile.longevity}%`,
    },
    {
      label: 'Complexity',
      icon: Activity,
      getValue: (product: PerfumeView) => `${product.scentProfile.longevity}%`,
    },
    {
      label: 'Uniqueness',
      icon: Sparkles,
      getValue: (product: PerfumeView) => `${product.scentProfile.uniqueness}%`,
    },
    {
      label: 'Rating',
      icon: Star,
      getValue: (product: PerfumeView) =>
        `${(product.scentProfile.value / 20).toFixed(1)}/5.0`,
    },
  ];

  return (
    <Card className="relative overflow-hidden p-6">
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm" />

      <div className="relative">
        <h3 className="mb-6 text-xl font-bold">Additional Metrics</h3>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {metrics.map((metric, index) => {
            const Icon = metric.icon;
            return (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Icon className="size-4" />
                  <span>{metric.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="rounded-lg bg-accent/50 p-3 backdrop-blur-sm"
                    >
                      <div className="text-sm text-muted-foreground">
                        {product.name}
                      </div>
                      <div className="font-medium">
                        {metric.getValue(product)}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
