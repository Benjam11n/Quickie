'use client';

import { Sparkles, ThumbsUp } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useState } from 'react';

import { PerfumeCard } from '@/components/fragrance/PerfumeCard';
import { QuizCard } from '@/components/QuizCard';
import { Card } from '@/components/ui/card';
import { useCollection } from '@/hooks/queries/use-collection';
import { usePerfumes } from '@/hooks/queries/use-perfumes';

import Loading from '../loading';

export default function RecommendationsPage() {
  const [showQuiz, setShowQuiz] = useState(true);
  const { data: perfumeResponse, isPending: isLoadingPerfumes } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: '',
    filter: '',
  });
  const { data: collectionResponse, isPending: isLoadingCollection } =
    useCollection();

  if (isLoadingPerfumes || isLoadingCollection) {
    return <Loading />;
  }

  if (!perfumeResponse?.data?.perfumes || !collectionResponse?.data) {
    return notFound();
  }

  const { perfumes } = perfumeResponse.data;
  const collection = collectionResponse?.data;

  // Simple recommendation algorithm based on user ratings and preferences
  const getRecommendations = () => {
    const ratedProducts = collection.perfumes;

    if (ratedProducts.length === 0) {
      return perfumes.slice(0, 3); // Return top products if no ratings
    }

    // Calculate average rating for each note and category
    const preferences = ratedProducts.reduce(
      (acc, item) => {
        const perfume = perfumes.find((p) => p.id === item.perfume._id);
        if (!perfume || !item.rating) return acc;

        // Process tags
        perfume.tags?.forEach((tag) => {
          if (!acc.tags[tag.name]) {
            acc.tags[tag] = { total: 0, count: 0 };
          }
          acc.tags[tag].total += item.rating;
          acc.tags[tag].count += 1;
        });

        // Process notes
        Object.values(perfume.notes)
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
      { tags: {}, notes: {} }
    );

    // Score each product based on preferences
    const scoredProducts = perfumes
      .filter(
        (product) => !collections.some((item) => item.productId === product.id)
      )
      .map((product) => {
        let score = 0;

        // Category score
        product.tags?.forEach((tag) => {
          if (preferences.tags[tag]) {
            score += preferences.tags[tag].total / preferences.tags[tag].count;
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
            <span className="holographic-text">Perfect Matches</span>
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
              {recommendations.map((perfume) => (
                <PerfumeCard
                  key={perfume.id}
                  id={perfume._id}
                  name={perfume.name}
                  price={perfume.fullPrice}
                  images={perfume.images}
                  brand={perfume.brand}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
