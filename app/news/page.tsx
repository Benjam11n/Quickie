"use client";

import { NewsHero } from "@/components/news/news-hero";
import { CategoryNav } from "@/components/news/category-nav";
import { ArticleGrid } from "@/components/news/article-grid";
import { TrendingArticles } from "@/components/news/trending-articles";
import { NewsletterCTA } from "@/components/news/newsletter-cta";
import { mockArticles, mockCategories } from "@/lib/data/news-data";
import { useState } from "react";

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const heroArticle = mockArticles[0];
  const featuredArticles = mockArticles.slice(1, 7);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      <div className="space-y-12 pb-16">
        <NewsHero article={heroArticle} />

        <div className="container">
          <CategoryNav
            categories={mockCategories}
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        <div className="container">
          <ArticleGrid articles={featuredArticles} />
        </div>

        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
            {/* Latest Articles Component will go here */}
          </div>
          <div className="space-y-8">
            <TrendingArticles />
            <NewsletterCTA />
          </div>
        </div>
      </div>
    </div>
  );
}
