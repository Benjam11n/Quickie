import { PerfumeCard } from '@/components/fragrance/PerfumeCard';
import { CollectionPerfume } from '@/types';

interface CollectionGridProps {
  items: CollectionPerfume[];
}

export function CollectionGrid({ items }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const perfume = item.perfume;

        return (
          <PerfumeCard
            key={perfume._id}
            id={perfume._id}
            name={perfume.name}
            price={perfume.fullPrice}
            images={perfume.images}
            brand={perfume.brand}
          />
        );
      })}
    </div>
  );
}
