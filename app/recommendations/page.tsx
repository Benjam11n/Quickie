"use client";

import { Sparkles, ThumbsUp } from "lucide-react";
import { useState } from "react";

import { ProductCard } from "@/components/product-card";
import { QuizCard } from "@/components/quiz-card";
import { Card } from "@/components/ui/card";
import { useUserPerfumes } from "@/hooks/use-user-perfumes";
import { products } from "@/lib/data";

export default function RecommendationsPage() {
  const { collections } = useUserPerfumes();
  const [showQuiz, setShowQuiz] = useState(true);

  // Simple recommendation algorithm based on user ratings and preferences
  const getRecommendations = () => {
    const ratedProducts = collections.filter((item) => item.rating);

    if (ratedProducts.length === 0) {
      return products.slice(0, 3); // Return top products if no ratings
    }

    // Calculate average rating for each note and category
    const preferences = ratedProducts.reduce(
      (acc, item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product || !item.rating) return acc;

        // Process categories
        product.categories.forEach((category) => {
          if (!acc.categories[category]) {
            acc.categories[category] = { total: 0, count: 0 };
          }
          acc.categories[category].total += item.rating;
          acc.categories[category].count += 1;
        });

        // Process notes
        Object.values(product.notes)
          .flat()
          .forEach((note) => {
            if (!acc.notes[note.name]) {
              acc.notes[note.name] = { total: 0, count: 0 };
            }
            acc.notes[note.name].total += item.rating * (note.percentage / 100);
            acc.notes[note.name].count += 1;
          });

        return acc;
      },
      { categories: {}, notes: {} }
    );

    // Score each product based on preferences
    const scoredProducts = products
      .filter(
        (product) => !collections.some((item) => item.productId === product.id)
      )
      .map((product) => {
        let score = 0;

        // Category score
        product.categories.forEach((category) => {
          if (preferences.categories[category]) {
            score +=
              preferences.categories[category].total /
              preferences.categories[category].count;
          }
        });

        // Notes score
        Object.values(product.notes)
          .flat()
          .forEach((note) => {
            if (preferences.notes[note.name]) {
              score +=
                (preferences.notes[note.name].total /
                  preferences.notes[note.name].count) *
                (note.percentage / 100);
            }
          });

        return { product, score };
      })
      .sort((a, b) => b.score - a.score);

    return scoredProducts.slice(0, 6).map((item) => item.product);
  };

  const recommendations = getRecommendations();

  return (
    <div className="container py-10">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-4">
          <h1 className="text-4xl font-bold">
            <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
              Perfect Matches
            </span>
          </h1>
          <p className="text-muted-foreground">
            Discover fragrances tailored to your taste.
          </p>
        </div>

        {showQuiz ? (
          <QuizCard onComplete={() => setShowQuiz(false)} />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="bg-gradient-to-br from-pink-500/10 to-violet-500/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <Sparkles className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">AI-Powered Matches</h3>
                    <p className="text-sm text-muted-foreground">
                      Based on your ratings and preferences
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-gradient-to-br from-pink-500/10 to-violet-500/10 p-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-primary/10 p-3">
                    <ThumbsUp className="size-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">
                      Rate More, Get Better Matches
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Your feedback improves recommendations
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  userPerfume={collections.find(
                    (p) => p.productId === product.id
                  )}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
