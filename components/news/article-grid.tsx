"use client";

import { motion } from "framer-motion";
import { Heart, MessageCircle, Share2 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArticleCard as ArticleCardType } from "@/lib/types/news";


interface ArticleGridProps {
  articles: ArticleCardType[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, index) => (
        <motion.div
          key={article.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <article className="relative h-full overflow-hidden rounded-lg border bg-card/30 backdrop-blur-sm transition-colors hover:border-primary/50">
            <div className="relative aspect-[16/9] overflow-hidden">
              <motion.img
                src={article.image}
                alt={article.title}
                className="size-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute left-4 top-4">
                <Badge variant="secondary" className="backdrop-blur-sm">
                  {article.category}
                </Badge>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <h3 className="line-clamp-2 text-xl font-semibold transition-colors group-hover:text-primary">
                {article.title}
              </h3>

              <p className="line-clamp-2 text-muted-foreground">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8">
                    <AvatarImage src={article.author.avatar} />
                    <AvatarFallback>
                      {article.author.name.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-sm">
                    <p className="font-medium">{article.author.name}</p>
                    <p className="text-muted-foreground">
                      {article.readingTime} min read
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="size-8">
                    <Heart className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <MessageCircle className="size-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="size-8">
                    <Share2 className="size-4" />
                  </Button>
                </div>
              </div>
            </div>
          </article>
        </motion.div>
      ))}
    </div>
  );
}
