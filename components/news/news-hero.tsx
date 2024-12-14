"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Share2 } from "lucide-react";
import { HeroArticle } from "@/lib/types/news";
import Link from "next/link";

interface NewsHeroProps {
  article: HeroArticle;
}

export function NewsHero({ article }: NewsHeroProps) {
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
        <img
          src={article.image}
          alt={article.title}
          className="w-full h-full object-cover"
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
            <Badge className="bg-primary/20 text-primary backdrop-blur-sm border-primary/20">
              {article.category}
            </Badge>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white">
              {article.title}
            </h1>

            <p className="text-lg text-purple-100/90 line-clamp-2">
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
                      {article.publishDate.toLocaleDateString()}
                    </time>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {article.readingTime} min read
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                className="p-2 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Share2 className="h-5 w-5 text-white" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Gradient Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
    </motion.div>
  );
}
