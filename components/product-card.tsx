import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Check, ExternalLink, Scale } from "lucide-react";
import { Product, UserPerfume } from "@/lib/types";
import { useUserPerfumes } from "@/hooks/use-user-perfumes";
import { StarRating } from "@/components/star-rating";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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
    if (!(e.target as HTMLElement).closest("button")) {
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
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(product.affiliateLink, "_blank");
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCompareToggle?.();
  };

  return (
    <Card
      className={cn(
        "overflow-hidden hover-lift gradient-border group cursor-pointer",
        isSelectedForComparison && "ring-2 ring-primary"
      )}
      onClick={handleCardClick}
    >
      <div className="aspect-square relative overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {userPerfume?.rating && (
          <div className="absolute top-2 right-2 z-10">
            <Badge variant="secondary" className="bg-black/70 text-white">
              <StarRating rating={userPerfume.rating} className="scale-75" />
            </Badge>
          </div>
        )}
      </div>

      <CardHeader className="space-y-2">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold hover:text-primary transition-colors">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground">{product.brand}</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                userPerfume?.isFavorite && "text-red-500"
              )}
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn(
                  "h-4 w-4",
                  userPerfume?.isFavorite && "fill-current"
                )}
              />
            </Button>
            {onCompareToggle && (
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8",
                  isSelectedForComparison && "text-primary"
                )}
                onClick={handleCompareClick}
              >
                <Scale className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {userPerfume?.review && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            "{userPerfume.review}"
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold bg-gradient-to-r from-pink-500 to-violet-500 text-transparent bg-clip-text">
            ${product.price}
          </span>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" onClick={handleBuyClick}>
              <ExternalLink className="h-4 w-4 mr-2" />
              Buy
            </Button>
            <Button
              size="sm"
              className={cn(
                "glow-effect",
                userPerfume?.inCollection && "bg-green-500 hover:bg-green-600"
              )}
              onClick={handleCollectionClick}
            >
              {userPerfume?.inCollection ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  In Collection
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4 mr-2" />
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
