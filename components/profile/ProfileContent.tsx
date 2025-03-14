'use client';

import { Layout, Grid, Star, BookMarked } from 'lucide-react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import DataRenderer from '@/components/DataRenderer';
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
  EMPTY_COLLECTIONS,
  EMPTY_MOODBOARDS,
  EMPTY_WISHLISTS,
} from '@/constants/states';
import { Collection, MoodBoard, Review, Wishlist } from '@/types';

const TAB_VALUES = [
  'collection',
  'wishlists',
  'moodboards',
  'reviews',
  'insights',
] as const;

type TabValue = (typeof TAB_VALUES)[number];

interface ProfileContentProps {
  username: string;
  userImage?: string;
  collection?: Collection;
  wishlists?: Wishlist[];
  reviews?: Review[];
  moodboards?: MoodBoard[];
  stats: {
    reviews: number;
    perfumes: number;
    wishlists: number;
  };
  queryResults: {
    collectionSuccess: boolean;
    collectionError?: {
      message: string;
      details?: Record<string, string[]> | undefined;
    };
    wishlistSuccess: boolean;
    wishlistError?: {
      message: string;
      details?: Record<string, string[]> | undefined;
    };
    reviewSuccess: boolean;
    reviewError?: {
      message: string;
      details?: Record<string, string[]> | undefined;
    };
    moodboardSuccess: boolean;
    moodboardError?: {
      message: string;
      details?: Record<string, string[]> | undefined;
    };
  };
}

export const calculateInsights = (collection?: Collection): Insights => {
  const allPerfumes =
    collection?.perfumes.map((perfume) => perfume.perfume) || [];

  return allPerfumes.reduce(
    (acc, perfume) => {
      Object.entries(perfume.notes).forEach(([, notes]) => {
        notes.forEach((noteObj) => {
          const noteName = noteObj.note.name;
          acc.notes[noteName] = (acc.notes[noteName] || 0) + 1;
        });
      });

      acc.brands[perfume.brand.name] =
        (acc.brands[perfume.brand.name] || 0) + 1;

      if (perfume.rating) {
        acc.totalRating += perfume.rating.average;
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

export function ProfileContent({
  username,
  userImage,
  collection,
  wishlists,
  reviews,
  moodboards,
  stats,
  queryResults,
}: ProfileContentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Get current tab from URL or default to 'collection'
  const currentTab = searchParams.get('tab');
  const activeTab = TAB_VALUES.includes(currentTab as TabValue)
    ? (currentTab as string)
    : 'collection';

  const insights = calculateInsights(collection);

  // Update URL when tab changes
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    params.set('tab', value);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="min-h-screen">
      <ProfileCard
        username={username}
        image={userImage}
        collectionNum={collection?.perfumes.length || 0}
        stats={stats}
      />

      <div className="container py-8">
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="space-y-8"
        >
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
              Boards
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
              success={queryResults.collectionSuccess}
              error={queryResults.collectionError}
              data={collection?.perfumes}
              empty={EMPTY_COLLECTIONS}
              render={(perfumes) => <CollectionGrid items={perfumes} />}
            />
          </TabsContent>

          <TabsContent value="wishlists">
            <DataRenderer
              success={queryResults.wishlistSuccess}
              error={queryResults.wishlistError}
              data={wishlists}
              empty={EMPTY_WISHLISTS}
              render={(wishlists) => <WishlistsGrid wishlists={wishlists} />}
            />
          </TabsContent>

          <TabsContent value="moodboards">
            <DataRenderer
              success={queryResults.moodboardSuccess}
              error={queryResults.moodboardError}
              data={moodboards}
              empty={EMPTY_MOODBOARDS}
              render={(moodboards) => <MoodBoardGrid boards={moodboards} />}
            />
          </TabsContent>

          <TabsContent value="reviews">
            <RatingsList reviews={reviews || []} />
          </TabsContent>

          <TabsContent value="insights">
            <CollectionInsights insights={insights} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
