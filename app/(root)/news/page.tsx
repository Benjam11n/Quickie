'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { ArticleGrid } from '@/components/news/ArticleGrid';
import { CategoryNav } from '@/components/news/CategoryNav';
import { NewsHero } from '@/components/news/NewsHero';
import { NewsletterCTA } from '@/components/news/NewsletterCTA';
import { TrendingArticles } from '@/components/news/TrendingArticles';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { mockArticles, mockCategories } from '@/lib/data/news-data';

export default function NewsPage() {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [showAlert, setShowAlert] = useState(true);
  const router = useRouter();

  const heroArticle = mockArticles[0];
  const featuredArticles = mockArticles.slice(1, 7);

  return (
    <>
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
          <div className="container grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
              {/* Latest Articles Component will go here */}
            </div>
            <div className="space-y-8">
              <TrendingArticles />
              <NewsletterCTA />
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-2xl">
              🎉 Coming Soon!
            </AlertDialogTitle>
            <AlertDialogDescription className="pt-4 text-base ">
              Get ready for an exciting new feature launch! We're working on
              something special that will transform your fragrance exploration.{' '}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction
              onClick={() => {
                setShowAlert(false);
                router.back();
              }}
            >
              Go Back
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
