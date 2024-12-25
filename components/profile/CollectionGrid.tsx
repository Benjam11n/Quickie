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
}

export function CollectionGrid({ items }: CollectionGridProps) {
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
