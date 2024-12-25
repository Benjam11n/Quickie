import { notFound } from 'next/navigation';

import { CompareWithIds } from '@/components/comparison';
import { getPerfumesByIds } from '@/lib/actions/perfume.action';

export default async function CompareWithIdsPage({
  params,
}: {
  params: { ids: string[] };
}) {
  const selectedIds = await params;

  if (!selectedIds.ids) {
    return <div>Products not found</div>;
  }
  if (selectedIds.ids.length === 0) {
    return <div>Products not found</div>;
  }

  const selectedProducts = await getPerfumesByIds({
    perfumeIds: selectedIds.ids,
  });

  if (
    !selectedProducts ||
    !selectedProducts.data ||
    selectedProducts.data.length === 0
  ) {
    return notFound();
  }

  return <CompareWithIds initialProducts={selectedProducts.data} />;
}
