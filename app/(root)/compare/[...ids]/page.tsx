import { notFound } from 'next/navigation';

import { CompareWithIds } from '@/components/comparison';
import { getPerfumesByIds } from '@/lib/actions/perfume.action';

export default async function CompareWithIdsPage({
  params,
}: {
  params: { ids: string[] };
}) {
  const selectedIds = await params;

  if (!selectedIds.ids || selectedIds.ids.length === 0) {
    return notFound();
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
