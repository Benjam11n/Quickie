import { SingleProductView } from '@/components/fragrance/SingleProductView';

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id: perfumeId } = await params;

  return (
    <div className="container py-10">
      <SingleProductView perfumeId={perfumeId} />
    </div>
  );
}
