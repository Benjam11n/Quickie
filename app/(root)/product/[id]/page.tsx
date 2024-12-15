import { SingleProductView } from '@/components/fragrance/SingleProductView';
import { products } from '@/types/data';

export async function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="container py-10">
      <SingleProductView product={product} />
    </div>
  );
}
