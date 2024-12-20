'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Clock, Share2 } from 'lucide-react';
import Image from 'next/image';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { HeroArticle } from '@/types/news';

interface NewsHeroProps {
  article: HeroArticle;
}

export function NewsHero({ article }: NewsHeroProps) {
  const formattedDate = format(article.publishDate, 'MM/dd/yyyy');

  return (
    <motion.div
      className="relative h-[70vh] min-h-[600px] w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.5 }}
      >
        <Image
          src={article.image}
          alt={article.title}
          width={1920}
          height={1080}
          className="size-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to bottom, 
              ${article.gradient.from}${Math.round(
                article.gradient.opacity * 255
              ).toString(16)} 0%, 
              ${article.gradient.to}${Math.round(
                article.gradient.opacity * 255
              ).toString(16)} 100%)`,
          }}
        />
      </motion.div>

      {/* Content */}
      <div className="absolute inset-0 flex items-end">
        <div className="container pb-16">
          <motion.div
            className="max-w-3xl space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Badge className="border-primary/20 bg-primary/20 text-primary backdrop-blur-sm">
              {article.category}
            </Badge>

            <h1 className="text-4xl font-bold text-white md:text-5xl lg:text-6xl">
              {article.title}
            </h1>

            <p className="line-clamp-2 text-lg text-purple-100/90">
              {article.excerpt}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Avatar>
                  <AvatarImage src={article.author.avatar} />
                  <AvatarFallback>
                    {article.author.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-purple-100">
                    {article.author.name}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-purple-200/80">
                    <time dateTime={article.publishDate.toISOString()}>
                      {formattedDate}
                    </time>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="size-4" />
                      {article.readingTime} min read
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                className="rounded-full bg-white/10 p-2 backdrop-blur-sm transition-colors hover:bg-white/20"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="size-5 text-white" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
    </motion.div>
  );
}
