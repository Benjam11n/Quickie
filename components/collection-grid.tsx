import { Product, UserPerfume } from "@/lib/types";
import { ProductCard } from "@/components/product-card";

interface CollectionGridProps {
  items: UserPerfume[];
  products: Product[];
  emptyMessage: string;
}

export function CollectionGrid({
  items,
  products,
  emptyMessage,
}: CollectionGridProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;
        return (
          <ProductCard
            key={item.productId}
            product={product}
            userPerfume={item}
          />
        );
      })}
    </div>
  );
}
