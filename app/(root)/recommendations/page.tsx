'use client';

import { Sparkles, ThumbsUp } from 'lucide-react';
import { notFound } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

import { QuizCard } from '@/components/QuizCard';
import { Card } from '@/components/ui/card';
import { useCollection } from '@/hooks/queries/use-collection';
import { usePerfumes } from '@/hooks/queries/use-perfumes';

import Loading from '../loading';

export default function RecommendationsPage() {
  const { data: session } = useSession();
  const [showQuiz, setShowQuiz] = useState(true);
  const { data: perfumeResponse, isPending: isLoadingPerfumes } = usePerfumes({
    page: 1,
    pageSize: 100,
    query: '',
  });
  const { data: collectionResponse, isPending: isLoadingCollection } =
    useCollection(session?.user.id);

  if (isLoadingPerfumes || isLoadingCollection) {
    return <Loading />;
  }

  if (!perfumeResponse?.data?.perfumes || !collectionResponse?.data) {
    return notFound();
  }

  const { perfumes } = perfumeResponse.data;
  const collection = collectionResponse?.data;

  console.log(perfumes, collection);

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
              {/* Add recommendations page */}
              {/* {recommendations.map((perfume) => (
                <PerfumeCard
                  key={perfume._id}
                  id={perfume._id}
                  name={perfume.name}
                  price={perfume.fullPrice}
                  images={perfume.images}
                  brand={perfume.brand}
                />
              ))} */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
