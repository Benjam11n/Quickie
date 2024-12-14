import { products } from "@/lib/data";
import { ComparisonView } from "@/components/comparison-view";

export function generateStaticParams() {
  const params: { id1: string; id2: string }[] = [];

  products.forEach((product1, index) => {
    products.slice(index + 1).forEach((product2) => {
      params.push({ id1: product1.id, id2: product2.id });
      params.push({ id1: product2.id, id2: product1.id });
    });
  });

  return params;
}

export default function ComparePage({
  params,
}: {
  params: { id1: string; id2: string };
}) {
  const product1 = products.find((p) => p.id === params.id1);
  const product2 = products.find((p) => p.id === params.id2);

  if (!product1 || !product2) {
    return <div>Products not found</div>;
  }

  return (
    <div className="container py-10">
      <ComparisonView product1={product1} product2={product2} />
    </div>
  );
}
