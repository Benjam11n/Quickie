import { Layout, Grid, Star, BookMarked } from 'lucide-react';

import { CollectionGrid } from '@/components/profile/CollectionGrid';
import {
  CollectionInsights,
  Insights,
} from '@/components/profile/CollectionInsights';
import { MoodBoardGrid } from '@/components/profile/MoodBoardGrid';
import ProfileCard from '@/components/profile/ProfileCard';
import { RatingsList } from '@/components/profile/RatingsList';
import { WishlistsGrid } from '@/components/profile/WishlistGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DEFAULT_EMPTY,
  EMPTY_COLLECTIONS,
  EMPTY_MOODBOARDS,
  EMPTY_WISHLISTS,
} from '@/constants/states';
import { getCollection } from '@/lib/actions/collection.action';
import { getMoodBoards } from '@/lib/actions/moodboard.action';
import { getUserReviews } from '@/lib/actions/review.action';
import { getUserWishlists } from '@/lib/actions/wishlist.action';
import { WishlistView } from '@/types';

import DataRenderer from '@/components/ui/DataRenderer';

interface ProfilePageProps {
  params: { id: string };
  searchParams: { [key: string]: string };
}

export default async function ProfilePageClient({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id: userId } = await params;
  const { page, pageSize, query, filter } = await searchParams;

  const {
    success: wishlistSuccess,
    data: wishlistsData,
    error: wishlistError,
  } = await getUserWishlists({ userId });

  const {
    success: reviewSuccess,
    data: reviewsData,
    error: reviewError,
  } = await getUserReviews({
    userId,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const {
    success: collectionSuccess,
    data: collection,
    error: collectionError,
  } = await getCollection({
    userId,
  });

  const {
    success: moodboardSuccess,
    data: moodboardsData,
    error: moodboardError,
  } = await getMoodBoards({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || '',
    filter: filter || '',
  });

  const { reviews } = reviewsData || {};
  const wishlists = wishlistsData;
  const { moodboards } = moodboardsData || {};

  const stats = {
    reviews: reviews?.length || 0,
    perfumes: collection?.perfumes.length || 0,
    wishlists: wishlists?.length || 0,
  };

  const calculateInsights = (wishlists: WishlistView[]): Insights => {
    // First flatten all perfumes from all wishlists
    const allPerfumes =
      wishlists?.flatMap((wishlist) => wishlist.perfumes) || [];

    // Then reduce over all perfumes
    return allPerfumes.reduce(
      (acc, perfume) => {
        // Count notes
        Object.values(perfume.perfume.notes).forEach((noteSection) => {
          acc.notes[noteSection.name] = (acc.notes[noteSection.name] || 0) + 1;
        });

        // Count brands
        acc.brands[perfume.perfume.brand.name] =
          (acc.brands[perfume.perfume.brand.name] || 0) + 1;

        // Calculate average rating if exists
        if (perfume.perfume.rating) {
          acc.totalRating += perfume.perfume.rating.average;
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
        username={userId}
        collectionNum={collection?.perfumes.length || 0}
        stats={stats}
      />

      <div className="container py-8">
        <Tabs defaultValue="collection" className="space-y-8">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="collection" className="gap-2">
              <Layout className="size-4" />
              Collection
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

          <TabsContent value="collection">
            <DataRenderer
              success={collectionSuccess}
              error={collectionError}
              data={collection?.perfumes}
              empty={EMPTY_COLLECTIONS}
              render={(perfumes) => <CollectionGrid items={perfumes} />}
            />
          </TabsContent>

          <TabsContent value="wishlists">
            <DataRenderer
              success={wishlistSuccess}
              error={wishlistError}
              data={wishlists}
              empty={EMPTY_WISHLISTS}
              render={(wishlists) => <WishlistsGrid wishlists={wishlists} />}
            />
          </TabsContent>

          <TabsContent value="moodboards">
            <DataRenderer
              success={moodboardSuccess}
              error={moodboardError}
              data={moodboards}
              empty={EMPTY_MOODBOARDS}
              render={(moodboards) => <MoodBoardGrid boards={moodboards} />}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <DataRenderer
              success={reviewSuccess}
              error={reviewError}
              data={reviews}
              empty={DEFAULT_EMPTY}
              render={(reviews) => <RatingsList reviews={reviews} />}
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
