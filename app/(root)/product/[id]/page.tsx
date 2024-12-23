import { notFound } from 'next/navigation';
import { SingleProductView } from '@/components/fragrance/SingleProductView';
import { getPerfume } from '@/lib/actions/perfume.action';
import { getReview } from '@/lib/actions/review.action';
import { auth } from '@/auth';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();
  const { id } = params;
  if (!id) return notFound();

  // First get the perfume
  const { data: perfume, success: perfumeSuccess } = await getPerfume({
    perfumeId: id,
  });

  // Only fetch review if there's a logged-in user
  let review;
  if (session?.user?.id) {
    const { data, success } = await getReview({
      perfumeId: id,
      userId: session.user.id,
    });
    if (success) {
      review = data;
    }
  }

  if (!perfumeSuccess || !perfume) return notFound();

  return (
    <div className="container py-10">
      <SingleProductView product={perfume} review={review} />
    </div>
  );
}
