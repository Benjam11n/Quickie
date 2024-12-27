import WishlistClient from '@/components/wishlist/WishlistClient';

export default async function WishlistPage({ params }: RouteParams) {
  const { id } = await params;

  return <WishlistClient id={id} />;
}
