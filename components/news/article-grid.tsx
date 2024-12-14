"use client";

import { motion } from "framer-motion";
import { ArticleCard as ArticleCardType } from "@/lib/types/news";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface ArticleGridProps {
  articles: ArticleCardType[];
}

export function ArticleGrid({ articles }: ArticleGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article, index) => (
        <motion.div
          key={article.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="group"
        >
          <article className="relative h-full rounded-lg border bg-card/30 backdrop-blur-sm overflow-hidden hover:border-primary/50 transition-colors">
            <div className="aspect-[16/9] relative overflow-hidden">
              <motion.img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
              />
              <div className="absolute top-4 left-4">
                <Badge variant="secondary" className="backdrop-blur-sm">
                  {article.category}
                </Badge>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <h3 className="text-xl font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                {article.title}
              </h3>

              <p className="text-muted-foreground line-clamp-2">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
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
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Heart className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Share2 className="h-4 w-4" />
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
