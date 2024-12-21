'use client';

import { Layout, Grid, Star, BookMarked } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';

import { MoodBoardGrid } from '@/components/mood-board/MoodBoardGrid';
import { CollectionGrid } from '@/components/profile/CollectionGrid';
import { CollectionInsights } from '@/components/profile/CollectionInsights';
import ProfileCard from '@/components/profile/ProfileCard';
import { RatingsList } from '@/components/profile/RatingsList';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMoodBoards } from '@/hooks/use-mood-boards';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { products } from '@/types/data';

export default function ProfilePage() {
  const params = useParams();
  const { collections } = useUserPerfumes();
  const { boards } = useMoodBoards();
  // TODO: Implement isPrivate
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
    <div className="min-h-screen from-gray-950 via-purple-950/20 to-gray-950 dark:bg-gradient-to-b">
      {/* Profile Header */}
      <ProfileCard
        username={params.username as string}
        collectionNum={collections.length}
        stats={stats}
      />

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
