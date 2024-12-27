import { PerfumeCard } from '@/components/fragrance/PerfumeCard';

interface CollectionGridProps {
  items: {
    perfumeId: {
      _id: string;
      id: string;
      name: string;
      brand: { name: string };
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
        const perfume = item.perfumeId;

        return (
          <PerfumeCard
            key={perfume._id}
            id={perfume._id}
            name={perfume.name}
            price={perfume.price}
            images={perfume.images}
            brand={perfume.brand}
          />
        );
      })}
    </div>
  );
}
