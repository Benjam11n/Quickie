import { SingleProductView } from "@/components/single-product-view";
import { products } from "@/lib/data";

export function generateStaticParams() {
  return products.map((product) => ({
    id: product.id,
  }));
}

export default function ProductPage({ params }: { params: { id: string } }) {
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
