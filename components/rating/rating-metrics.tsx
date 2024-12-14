'use client';

import { motion } from 'framer-motion';
import { Wind, Clock, DollarSign, Sparkles, Activity } from 'lucide-react';

import { RatingBar } from './rating-bar';

interface RatingMetricsProps {
  rating: {
    sillage: number;
    longevity: number;
    value: number;
    projection: number;
    complexity: number;
  };
  onChange: (rating: any) => void;
}

const metrics = [
  {
    key: 'sillage',
    label: 'Sillage',
    icon: Wind,
    description: 'How far the fragrance projects',
  },
  {
    key: 'longevity',
    label: 'Longevity',
    icon: Clock,
    description: 'How long the fragrance lasts',
  },
  {
    key: 'value',
    label: 'Value',
    icon: DollarSign,
    description: 'Price to quality ratio',
  },
  {
    key: 'projection',
    label: 'Projection',
    icon: Activity,
    description: 'Strength of the scent',
  },
  {
    key: 'complexity',
    label: 'Complexity',
    icon: Sparkles,
    description: 'Depth and evolution of notes',
  },
];

export function RatingMetrics({ rating, onChange }: RatingMetricsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {metrics.map((metric, index) => {
        const Icon = metric.icon;
        return (
          <motion.div
            key={metric.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="group relative flex items-center gap-2">
                <Icon className="size-5 text-primary" />
                <span className="font-medium">{metric.label}</span>

                {/* Tooltip */}
                <div className="invisible absolute -top-8 left-0 w-48 rounded-lg bg-popover p-2 text-xs opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100">
                  {metric.description}
                </div>
              </div>
              <span className="font-medium text-primary">
                {rating[metric.key as keyof typeof rating]}
              </span>
            </div>

            <RatingBar
              value={rating[metric.key as keyof typeof rating]}
              onChange={(value) => onChange({ ...rating, [metric.key]: value })}
            />

            <div className="h-2 overflow-hidden rounded-full bg-secondary">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{
                  width: `${
                    (rating[metric.key as keyof typeof rating] / 5) * 100
                  }%`,
                }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
