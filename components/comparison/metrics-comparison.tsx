"use client";

import { Card } from "@/components/ui/card";
import { Product } from "@/lib/types";
import { motion } from "framer-motion";
import {
  Clock,
  DollarSign,
  Star,
  Activity,
  Wind,
  Sparkles,
} from "lucide-react";

interface MetricsComparisonProps {
  products: Product[];
}

export function MetricsComparison({ products }: MetricsComparisonProps) {
  const metrics = [
    {
      label: "Price per ml",
      icon: DollarSign,
      getValue: (product: Product) =>
        `$${(product.price / product.size).toFixed(2)}/ml`,
    },
    {
      label: "Sillage",
      icon: Wind,
      getValue: (product: Product) => `${product.scentProfile.sillage}%`,
    },
    {
      label: "Longevity",
      icon: Clock,
      getValue: (product: Product) => `${product.scentProfile.longevity}%`,
    },
    {
      label: "Projection",
      icon: Activity,
      getValue: (product: Product) => `${product.scentProfile.sillage}%`,
    },
    {
      label: "Uniqueness",
      icon: Sparkles,
      getValue: (product: Product) => `${product.scentProfile.uniqueness}%`,
    },
    {
      label: "Rating",
      icon: Star,
      getValue: (product: Product) =>
        `${(product.scentProfile.value / 20).toFixed(1)}/5.0`,
    },
  ];

  return (
    <Card className="p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-background/10 to-background/30 backdrop-blur-sm z-0" />

      <div className="relative">
        <h3 className="text-xl font-bold mb-6">Additional Metrics</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
                  <Icon className="h-4 w-4" />
                  <span>{metric.label}</span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {products.map((product) => (
                    <div
                      key={product.id}
                      className="p-3 rounded-lg bg-accent/50 backdrop-blur-sm"
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
