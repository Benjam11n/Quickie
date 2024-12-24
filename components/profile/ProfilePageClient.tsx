'use client';

import { Layout, Grid, Star, BookMarked } from 'lucide-react';

import { MoodBoardGrid } from '@/components/mood-board/MoodBoardGrid';
import {
  CollectionInsights,
  Insights,
} from '@/components/profile/CollectionInsights';
import ProfileCard from '@/components/profile/ProfileCard';
import { RatingsList } from '@/components/profile/RatingsList';
import DataRenderer from '@/components/ui/DataRenderer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DEFAULT_EMPTY } from '@/constants/states';
import { CollectionView, MoodBoard, ReviewView, WishlistView } from '@/types';

import { CollectionGrid } from './CollectionGrid';
import { WishlistsView } from './WishlistView';

interface ProfilePageProps {
  wishlists: WishlistView[] | undefined;
  collection: CollectionView | undefined;
  reviews: ReviewView[] | undefined;
  boards: MoodBoard[] | undefined;
  username: string;
  success: boolean;
  error?: Error;
}

export default function ProfilePageClient({
  wishlists,
  collection,
  reviews,
  boards,
  username,
  success,
  error,
}: ProfilePageProps) {
  const stats = {
    reviews: 0,
    collections: collection?.perfumes?.length || 0,
    wishlists: wishlists?.length || 0,
    followers: 1243,
  };

  const calculateInsights = (wishlists: WishlistView[]): Insights => {
    // First flatten all perfumes from all wishlists
    const allPerfumes =
      wishlists?.flatMap((wishlist) => wishlist.perfumes) || [];

    // Then reduce over all perfumes
    return allPerfumes.reduce(
      (acc, perfume) => {
        // Count notes
        Object.values(perfume.perfumeId.notes).forEach((noteSection) => {
          acc.notes[noteSection.name] = (acc.notes[noteSection.name] || 0) + 1;
        });

        // Count brands
        acc.brands[perfume.perfumeId.brand] =
          (acc.brands[perfume.perfumeId.brand] || 0) + 1;

        // Calculate average rating if exists
        if (perfume.perfumeId.rating) {
          acc.totalRating += perfume.perfumeId.rating.average;
          acc.ratedCount += 1;
        }

        return acc;
      },
      {
        notes: {},
        brands: {},
        totalRating: 0,
        ratedCount: 0,
      } as Insights
    );
  };

  const insights = calculateInsights(wishlists || []);

  return (
    <div className="min-h-screen ">
      <ProfileCard
        username={username}
        collectionNum={stats.collections}
        stats={stats}
      />

      <div className="container py-8">
        <Tabs defaultValue="collections" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="collections" className="gap-2">
              <Layout className="size-4" />
              Collections
            </TabsTrigger>
            <TabsTrigger value="wishlists" className="gap-2">
              <Layout className="size-4" />
              Wishlists
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
            <DataRenderer
              success={success}
              error={error}
              data={collection?.perfumes}
              empty={DEFAULT_EMPTY}
              render={(perfumes) => (
                <CollectionGrid
                  items={perfumes}
                  emptyMessage="No perfumes in collection"
                />
              )}
            />
          </TabsContent>

          <TabsContent value="wishlists">
            <DataRenderer
              success={success}
              error={error}
              data={wishlists}
              empty={DEFAULT_EMPTY}
              render={(wishlists) => (
                <WishlistsView
                  wishlists={wishlists}
                  success={success}
                  error={error}
                />
              )}
            />
          </TabsContent>

          <TabsContent value="moodboards">
            <DataRenderer
              success={success}
              error={error}
              data={boards}
              empty={DEFAULT_EMPTY}
              render={(filteredBoards) => (
                <MoodBoardGrid boards={filteredBoards} />
              )}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <DataRenderer
              success={success}
              error={error}
              data={reviews}
              empty={DEFAULT_EMPTY}
              render={(reviews) => <RatingsList reviews={reviews} />}
            />
          </TabsContent>

          <TabsContent value="insights">
            <DataRenderer
              success={success}
              error={error}
              data={Array(insights)}
              empty={DEFAULT_EMPTY}
              render={(insights) => (
                <CollectionInsights insights={insights[0]} />
              )}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
