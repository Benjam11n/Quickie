import Link from 'next/link';

import { StarRating } from '@/components/star-rating';
import { Card } from '@/components/ui/card';
import { Product, UserPerfume } from '@/types/fragrance';
import { ROUTES } from '@/constants/routes';

interface RatingsListProps {
  items: UserPerfume[];
  products: Product[];
  emptyMessage: string;
}

export function RatingsList({
  items,
  products,
  emptyMessage,
}: RatingsListProps) {
  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) return null;

        return (
          <Card key={item.productId} className="p-6">
            <div className="flex gap-6">
              <div className="relative size-24 overflow-hidden rounded-lg">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="size-full object-cover"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <Link
                    href={ROUTES.PRODUCT(String(item.productId))}
                    className="text-lg font-semibold transition-colors hover:text-primary"
                  >
                    {product.name}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {product.brand}
                  </p>
                </div>

                <StarRating rating={item.rating || 0} />

                {item.review && (
                  <p className="text-sm text-muted-foreground">{item.review}</p>
                )}

                <p className="text-sm text-muted-foreground">
                  Rated on {new Date(item.addedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
