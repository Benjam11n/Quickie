import { ComparisonView } from "@/components/comparison-view";
import { Product } from "@/lib/types";

interface ProductDetailsProps {
  product1: Product;
  product2: Product;
}

export function ProductDetails({ product1, product2 }: ProductDetailsProps) {
  return <ComparisonView product1={product1} product2={product2} />;
}
