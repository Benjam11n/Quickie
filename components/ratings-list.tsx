import { Product, UserPerfume } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { StarRating } from "@/components/star-rating";
import Link from "next/link";

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
      <div className="text-center py-12">
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
              <div className="w-24 h-24 relative rounded-lg overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="object-cover w-full h-full"
                />
              </div>

              <div className="flex-1 space-y-2">
                <div>
                  <Link
                    href={`/product/${product.id}`}
                    className="text-lg font-semibold hover:text-primary transition-colors"
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
