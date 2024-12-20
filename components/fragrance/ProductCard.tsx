import { Heart, ShoppingCart, Check, ExternalLink, Scale } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { cn } from '@/lib/utils';
import { Product, UserPerfume } from '@/types/fragrance';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '../ui/hover-card';

interface ProductCardProps {
  product: Product;
  userPerfume?: UserPerfume;
  onCompareToggle?: () => void;
  isSelectedForComparison?: boolean;
}

export function ProductCard({
  product,
  userPerfume,
  onCompareToggle,
  isSelectedForComparison,
}: ProductCardProps) {
  const router = useRouter();
  const { toggleFavorite, addToCollection } = useUserPerfumes();

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Don't navigate if clicking on buttons
    if (!(e.target as HTMLElement).closest('button')) {
      router.push(`/product/${product.id}`);
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(product.id);
  };

  const handleCollectionClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCollection(product.id);
    toast.success('Successfully added to collection');
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.affiliateLink, '_blank');
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompareToggle?.();
  };

  return (
    <Card
      className={cn(
        'hover-lift group cursor-pointer overflow-hidden',
        isSelectedForComparison && 'ring-2 ring-primary'
      )}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="size-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        {userPerfume?.rating && (
          <div className="absolute right-2 top-2 z-10">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <StarRating rating={userPerfume.rating} className="scale-75" />
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold transition-colors hover:text-primary">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'size-8',
                userPerfume?.isFavorite && 'text-red-500'
              )}
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn(
                  'size-4',
                  userPerfume?.isFavorite && 'fill-current'
                )}
              />
            </Button>
            {onCompareToggle && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  'size-8',
                  isSelectedForComparison && 'text-primary'
                )}
                onClick={handleCompareClick}
              >
                <Scale className="size-4" />
              </Button>
            )}
          </div>
        </div>

        {userPerfume?.review && (
          <p className="line-clamp-2 text-sm text-muted-foreground">
            &quot;{userPerfume.review}&quot;
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-lg font-bold text-transparent">
            ${product.price}
          </span>
          <div className="flex gap-2">
            <HoverCard openDelay={100} closeDelay={100}>
              <HoverCardTrigger asChild>
                <Button size="sm" variant="outline" onClick={handleBuyClick}>
                  <ExternalLink className="mr-2 size-4" />
                  Buy
                </Button>
              </HoverCardTrigger>
              <HoverCardContent side="top" className="w-80">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-yellow-600 dark:text-yellow-500">
                      External Purchase
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      We currently don&apos;t sell perfumes directly.
                      You&apos;ll be redirected to a trusted external retailer
                      to complete your purchase.
                    </p>
                  </div>
                  <div className="space-y-1 border-t pt-2">
                    <p className="text-xs text-muted-foreground">
                      Note: Prices and availability may vary on external sites.
                    </p>
                  </div>
                </div>
              </HoverCardContent>
            </HoverCard>
            <Button
              size="sm"
              className={cn(
                'glow-effect',
                userPerfume?.inCollection && 'bg-green-500 hover:bg-green-600'
              )}
              onClick={handleCollectionClick}
            >
              {userPerfume?.inCollection ? (
                <>
                  <Check className="mr-2 size-4" />
                  In Collection
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 size-4" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
