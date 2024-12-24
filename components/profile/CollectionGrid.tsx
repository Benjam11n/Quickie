import { PerfumeCard } from '@/components/fragrance/PerfumeCard';

interface CollectionGridProps {
  items: {
    perfumeId: {
      _id: string;
      id: string;
      name: string;
      brand: string;
      price: number;
      images: string[];
      affiliateLink: string;
    };
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
          <PerfumeCard
            key={item.perfumeId._id}
            perfume={item.perfumeId}
            // TODO: remove this prop
            userPerfume={item.perfumeId}
          />
        );
      })}
    </div>
  );
}
