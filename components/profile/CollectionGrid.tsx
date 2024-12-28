import { PerfumeCard } from '@/components/fragrance/PerfumeCard';
import { CollectionPerfumeView } from '@/types';

interface CollectionGridProps {
  items: CollectionPerfumeView[];
}

export function CollectionGrid({ items }: CollectionGridProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => {
        const perfume = item.perfume;

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
