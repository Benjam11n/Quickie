'use client';
import { motion } from 'framer-motion';
import { RatingDistribution as FragranceDistribution } from '@/types/fragrance';

interface RatingDistributionProps {
  distribution: FragranceDistribution;
}

export function RatingDistribution({ distribution }: RatingDistributionProps) {
  const total =
    distribution[1] +
    distribution[2] +
    distribution[3] +
    distribution[4] +
    distribution[5];

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Rating Distribution</h3>
      <div className="space-y-2">
        {Object.keys(distribution).map((key, index) => {
          const rating = Number(key);
          const count = distribution[rating as keyof FragranceDistribution];
          const percentage = total === 0 ? 0 : (count / total) * 100;

          return (
            <div key={key} className="flex items-center gap-4">
              <div className="w-12 text-right font-medium">{rating} ★</div>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                <motion.div
                  className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              </div>
              <div className="w-16 text-sm text-muted-foreground">
                {count} ({percentage.toFixed(0)}%)
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
