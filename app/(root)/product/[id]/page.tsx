import { notFound } from 'next/navigation';

import { SingleProductView } from '@/components/fragrance/SingleProductView';
import { getPerfume } from '@/lib/actions/perfume.action';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  if (!id) return notFound();

  const { data: perfume, success } = await getPerfume({ perfumeId: id });
  if (!success || !perfume) return notFound();

  return (
    <div className="container py-10">
      <SingleProductView product={perfume} />
    </div>
  );
}
