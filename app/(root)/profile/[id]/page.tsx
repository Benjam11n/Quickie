import { ProfileContent } from '@/components/profile/ProfileContent';
import { getCollection } from '@/lib/actions/collection.action';
import { getMoodBoards } from '@/lib/actions/moodboard.action';
import { getUserReviews } from '@/lib/actions/review.action';
import { getUserWishlists } from '@/lib/actions/wishlist.action';

interface ProfilePageProps {
  params: { id: string };
  searchParams: { [key: string]: string };
}

export default async function ProfilePage({
  params,
  searchParams,
}: ProfilePageProps) {
  const { id: userId } = params;
  const { page, pageSize, query } = searchParams;

  const [wishlistResult, reviewResult, collectionResult, moodboardResult] =
    await Promise.all([
      getUserWishlists({ userId }),
      getUserReviews({
        userId,
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || '',
      }),
      getCollection({ userId }),
      getMoodBoards({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || '',
      }),
    ]);

  const { reviews } = reviewResult.data || {};
  const wishlists = wishlistResult.data;
  const collection = collectionResult.data;
  const { moodboards } = moodboardResult.data || {};

  const stats = {
    reviews: reviews?.length || 0,
    perfumes: collection?.perfumes.length || 0,
    wishlists: wishlists?.length || 0,
  };

  return (
    <ProfileContent
      username={userId}
      collection={collection}
      wishlists={wishlists}
      reviews={reviews}
      moodboards={moodboards}
      stats={stats}
      queryResults={{
        collectionSuccess: collectionResult.success,
        collectionError: collectionResult.error,
        wishlistSuccess: wishlistResult.success,
        wishlistError: wishlistResult.error,
        reviewSuccess: reviewResult.success,
        reviewError: reviewResult.error,
        moodboardSuccess: moodboardResult.success,
        moodboardError: moodboardResult.error,
      }}
    />
  );
}
