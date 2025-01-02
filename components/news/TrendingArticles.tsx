'use client';

import { motion } from 'framer-motion';
import { MessageCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';

import { Card } from '@/components/ui/card';
import { TrendingArticle } from '@/types/models/news';

const trendingArticles: TrendingArticle[] = [
  {
    position: 1,
    title: 'The Science Behind Fragrance Longevity: Expert Tips Revealed',
    views: 12453,
    comments: 89,
  },
  {
    position: 2,
    title: 'Top 10 Most Anticipated Perfume Releases of 2024',
    views: 8932,
    comments: 67,
  },
  {
    position: 3,
    title: 'How to Choose the Perfect Signature Scent',
    views: 7645,
    comments: 45,
  },
  {
    position: 4,
    title: 'The Rise of Sustainable Fragrances',
    views: 6234,
    comments: 34,
  },
];

export function TrendingArticles() {
  return (
    <Card className="bg-card/30 p-6 backdrop-blur-sm">
      <div className="mb-6 flex items-center gap-2">
        <TrendingUp className="size-5 text-primary" />
        <h2 className="text-xl font-semibold">Trending Now</h2>
      </div>

      <div className="space-y-6">
        {trendingArticles.map((article, index) => (
          <motion.div
            key={article.position}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link href="#" className="group flex gap-4">
              <span className="text-2xl font-bold text-primary/50 transition-colors group-hover:text-primary">
                {article.position.toString().padStart(2, '0')}
              </span>
              <div className="space-y-2">
                <h3 className="line-clamp-2 font-medium transition-colors group-hover:text-primary">
                  {article.title}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{article.views.toLocaleString()} views</span>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="size-4" />
                    {article.comments}
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </Card>
  );
}
