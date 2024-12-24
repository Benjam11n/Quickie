import { ProductCard } from '@/components/fragrance/ProductCard';

interface CollectionGridProps {
  items: {
    perfumeId: { name: string; brand: string; price: number; images: string[] };
    addedAt: Date;
  }[];
  emptyMessage: string;
}

export function CollectionGrid({ items, emptyMessage }: CollectionGridProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        return (
          <ProductCard
            key={item.perfumeId.name}
            product={item.perfumeId}
            userPerfume={item.perfumeId}
          />
        );
      })}
    </div>
  );
}
