import ProfilePageClient from '@/components/profile/ProfilePageClient';
import { getCollection } from '@/lib/actions/collection.action';
import { getMoodBoards } from '@/lib/actions/moodboard.action';
import { getUserReviews } from '@/lib/actions/review.action';
import { getUserWishlists } from '@/lib/actions/wishlist.action';

interface PageProps {
  params: { id: string };
  searchParams: { [key: string]: string };
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;

  try {
    const [moodboardResult, wishlistResult, collectionResult, reviewsResult] =
      await Promise.all([
        getMoodBoards({
          page: Number(searchParams.page) || 1,
          pageSize: Number(searchParams.pageSize) || 10,
          query: searchParams.query || '',
          filter: searchParams.filter || '',
        }),
        getUserWishlists({ userId: id }),
        getCollection({ userId: id }),
        getUserReviews({ userId: id }),
      ]);

    return (
      <ProfilePageClient
        wishlists={wishlistResult.data?.wishlists}
        collection={collectionResult.data}
        reviews={reviewsResult.data?.reviews}
        boards={moodboardResult.data}
        username={id}
        success={
          wishlistResult.success &&
          moodboardResult.success &&
          reviewsResult.success &&
          collectionResult.success
        }
        error={
          wishlistResult.error ||
          moodboardResult.error ||
          collectionResult.error ||
          reviewsResult.error
        }
      />
    );
  } catch (error) {
    return (
      <ProfilePageClient
        wishlists={[]}
        collection={[]}
        reviews={[]}
        boards={[]}
        username={username}
        success={false}
        error={error as Error}
      />
    );
  }
}
