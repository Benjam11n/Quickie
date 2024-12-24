import { CompareWithIds } from '@/components/comparison';
import { products } from '@/types/data';
import { Perfume } from '@/types/fragrance';

export function generateStaticParams() {
  const params: { ids: string[] }[] = [];
  products.forEach((product1, index) => {
    products.slice(index + 1).forEach((product2) => {
      params.push({ ids: [product1.id, product2.id] });
    });
  });
  return params;
}

export default function CompareWithIdsPage({
  params,
}: {
  params: { ids: string[] };
}) {
  const selectedProducts = params.ids
    .map((id) => products.find((p) => p.id === id))
    .filter(Boolean);

  if (selectedProducts.length === 0) {
    return <div>Products not found</div>;
  }

  return <CompareWithIds initialProducts={selectedProducts as Perfume[]} />;
}
