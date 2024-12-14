"use client";

import { motion } from "framer-motion";

interface RatingDistributionProps {
  productId: string;
}

export function RatingDistribution({ productId }: RatingDistributionProps) {
  // Mock data - replace with real data from your API
  const distribution = [
    { rating: 5, count: 423 },
    { rating: 4, count: 256 },
    { rating: 3, count: 128 },
    { rating: 2, count: 64 },
    { rating: 1, count: 32 },
  ];

  const total = distribution.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Rating Distribution</h3>
      <div className="space-y-2">
        {distribution.map((item, index) => (
          <div key={item.rating} className="flex items-center gap-4">
            <div className="w-12 text-right font-medium">{item.rating} ★</div>
            <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-pink-500 to-violet-500"
                initial={{ width: 0 }}
                animate={{ width: `${(item.count / total) * 100}%` }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              />
            </div>
            <div className="w-16 text-sm text-muted-foreground">
              {item.count}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
