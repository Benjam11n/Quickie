import { auth } from '@/auth';
import { ProfileContent } from '@/components/profile/ProfileContent';
import { getCollection } from '@/lib/actions/collection.action';
import { getMoodBoards } from '@/lib/actions/moodboard.action';
import { getUserReviews } from '@/lib/actions/review.action';
import { getUserWishlists } from '@/lib/actions/wishlist.action';

interface ProfilePageProps {
  searchParams: { [key: string]: string };
}

export default async function ProfilePage({ searchParams }: ProfilePageProps) {
  const session = await auth();
  const { page, pageSize, query, sortBy } = await searchParams;
  const userId = session?.user?.id || '';

  const [wishlistResult, reviewResult, collectionResult, moodboardResult] =
    await Promise.all([
      getUserWishlists({ userId }),
      getUserReviews({
        userId,
        query: query || '',
        sortBy,
      }),
      getCollection({ userId }),
      getMoodBoards({
        page: Number(page) || 1,
        pageSize: Number(pageSize) || 10,
        query: query || '',
      }),
    ]);

  const { reviews, total: reviewsTotal } = reviewResult.data || {};
  const wishlists = wishlistResult.data;
  const collection = collectionResult.data;
  const { moodboards } = moodboardResult.data || {};

  const stats = {
    reviews: reviewsTotal || 0,
    perfumes: collection?.perfumes.length || 0,
    wishlists: wishlists?.length || 0,
  };

  return (
    <ProfileContent
      username={session?.user?.username || ''}
      userImage={session?.user?.image}
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
