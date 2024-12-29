import { auth } from '@/auth';
import { SingleProductView } from '@/components/fragrance/SingleProductView';

export default async function ProductPage({ params }: RouteParams) {
  const session = await auth();
  const { id: perfumeId } = await params;

  return (
    <div className="container py-10">
      <SingleProductView userId={session?.user.id} perfumeId={perfumeId} />
    </div>
  );
}
