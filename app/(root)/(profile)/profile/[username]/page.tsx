'use client';

import { Plus, Layout, Grid, Star, BookMarked, Settings } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { CollectionGrid } from '@/components/collection-grid';
import { CollectionInsights } from '@/components/collection-insights';
import { MoodBoardGrid } from '@/components/mood-board/MoodBoardGrid';
import { RatingsList } from '@/components/ratings-list';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { products } from '@/types/data';

export default function ProfilePage() {
  const params = useParams();
  const { collections } = useUserPerfumes();
  const { boards } = useMoodBoards();
  // TODO: isPrivate
  const [isPrivate] = useState(true);

  // Calculate collection stats
  const stats = {
    reviews: collections.filter((item) => item.rating).length,
    collections: collections.filter((item) => item.inCollection).length,
    followers: 1243,
  };

  // Calculate insights
  const insights = collections.reduce(
    (acc, item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return acc;

      // Count categories
      product.categories.forEach((category) => {
        acc.categories[category] = (acc.categories[category] || 0) + 1;
      });

      // Count notes
      Object.values(product.notes)
        .flat()
        .forEach((note) => {
          acc.notes[note.name] = (acc.notes[note.name] || 0) + note.percentage;
        });

      // Count brands
      acc.brands[product.brand] = (acc.brands[product.brand] || 0) + 1;

      // Calculate average rating
      if (item.rating) {
        acc.totalRating += item.rating;
        acc.ratedCount += 1;
      }

      return acc;
    },
    {
      categories: {} as Record<string, number>,
      notes: {} as Record<string, number>,
      brands: {} as Record<string, number>,
      totalRating: 0,
      ratedCount: 0,
    }
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 via-purple-950/20 to-gray-950">
      {/* Profile Header */}
      <div className="rounded-md border border-purple-800/50 bg-gradient-to-r from-purple-900/10 to-pink-900/10 px-8">
        <div className="container py-8">
          <div className="flex flex-col items-center md:flex-row md:items-start md:gap-8">
            {/* Profile Image */}
            <div className="group relative">
              <div className="size-32 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1">
                <Avatar className="size-full">
                  <AvatarImage src="/images/default-avatar.png" />
                  <AvatarFallback>
                    {(params.username as string)?.slice(0, 2).toUpperCase() ??
                      ''}
                  </AvatarFallback>
                </Avatar>
              </div>
              {/* Level */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                {Math.floor(collections.length / 5)}
              </div>
            </div>

            {/* Profile Info */}
            <div className="mt-4 flex-1 text-center md:mt-0 md:text-left">
              <h1 className="holographic-text text-3xl font-semibold">
                {params.username}
              </h1>
              <p className="mt-1">
                {/* TODO: Custmise this */}
                Fragrance Enthusiast | Collection Curator
              </p>

              {/* Stats */}
              <div className="mt-4 flex justify-center gap-6 md:justify-start">
                {Object.entries(stats).map(([key, value]) => (
                  <div key={key} className="text-center">
                    <div className="text-2xl font-bold text-purple-300">
                      {value.toLocaleString()}
                    </div>
                    <div className="text-sm capitalize text-purple-400">
                      {key}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-4 flex gap-4 md:mt-0">
              <Button className="gap-2">
                <Plus className="size-4" />
                Follow
              </Button>
              <Button variant="outline" size="icon">
                <Settings className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <Tabs defaultValue="collections" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="collections" className="gap-2">
              <Layout className="size-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="moodboards" className="gap-2">
              <Grid className="size-4" />
              Mood Boards
            </TabsTrigger>
            <TabsTrigger value="reviews" className="gap-2">
              <Star className="size-4" />
              Reviews
            </TabsTrigger>
            <TabsTrigger value="insights" className="gap-2">
              <BookMarked className="size-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="collections">
            <CollectionGrid
              items={collections.filter((item) => item.inCollection)}
              products={products}
              emptyMessage="No collections yet"
            />
          </TabsContent>

          <TabsContent value="moodboards">
            <MoodBoardGrid boards={boards} />
          </TabsContent>

          <TabsContent value="reviews">
            <RatingsList
              items={collections.filter((item) => item.rating)}
              products={products}
              emptyMessage="No reviews yet"
            />
          </TabsContent>

          <TabsContent value="insights">
            <CollectionInsights insights={insights} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
