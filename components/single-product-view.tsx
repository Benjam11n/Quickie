'use client';

import { ArrowLeft, ExternalLink, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';

import { AuthCheck } from '@/components/auth-check';
import { MoodVisualizer } from '@/components/fragrance/mood-visualizer';
import { NoteHarmonyVisualizer } from '@/components/fragrance/note-harmony';
import { ScentJourney } from '@/components/fragrance/scent-journey';
import { SeasonalWheel } from '@/components/fragrance/seasonal-wheel';
import { RatingCard } from '@/components/rating/rating-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { Product } from '@/lib/types';
import { mapProductToEnhancedFragrance } from '@/lib/utils/fragrance-mapper';

interface SingleProductViewProps {
  product: Product;
}

export function SingleProductView({ product }: SingleProductViewProps) {
  const { collections, toggleFavorite, addToCollection, addRating } =
    useUserPerfumes();
  const userPerfume = collections.find((p) => p.productId === product.id);
  const enhancedFragrance = mapProductToEnhancedFragrance(product);

  const handleFavoriteClick = () => {
    toggleFavorite(product.id);
  };

  const handleCollectionClick = () => {
    addToCollection(product.id);
  };

  const handleRatingSubmit = (rating: any) => {
    addRating(product.id, rating.overall, rating.review);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/catalog">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Card className="p-6">
          <div className="relative aspect-square overflow-hidden rounded-lg">
            <img
              src={product.images[0]}
              alt={product.name}
              className="size-full object-cover"
            />
          </div>
        </Card>

        <div className="space-y-6">
          <div>
            <p className="text-xl text-muted-foreground">{product.brand}</p>
            <p className="mt-2 text-3xl font-bold">${product.price}</p>
          </div>

          <p className="text-muted-foreground">{product.description}</p>

          <div className="flex flex-wrap gap-2">
            {product.categories.map((category) => (
              <Badge key={category} variant="secondary">
                {category}
              </Badge>
            ))}
          </div>

          <div className="flex gap-4">
            <AuthCheck onAuthSuccess={handleCollectionClick}>
              <Button
                className={
                  userPerfume?.inCollection
                    ? 'bg-green-500 hover:bg-green-600'
                    : ''
                }
                size="lg"
              >
                <ShoppingCart className="mr-2 size-5" />
                {userPerfume?.inCollection
                  ? 'In Collection'
                  : 'Add to Collection'}
              </Button>
            </AuthCheck>

            <AuthCheck onAuthSuccess={handleFavoriteClick}>
              <Button
                variant="outline"
                size="icon"
                className={userPerfume?.isFavorite ? 'text-red-500' : ''}
              >
                <Heart
                  className={`size-5 ${
                    userPerfume?.isFavorite ? 'fill-current' : ''
                  }`}
                />
              </Button>
            </AuthCheck>

            <Button variant="outline" size="lg" asChild>
              <a
                href={product.affiliateLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 size-5" />
                Buy from Partner
              </a>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="journey" className="space-y-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="journey">Scent Journey</TabsTrigger>
          <TabsTrigger value="harmony">Note Harmony</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
          <TabsTrigger value="rating">Rate & Review</TabsTrigger>
        </TabsList>

        <TabsContent value="journey">
          <ScentJourney
            timeline={enhancedFragrance.timeline}
            notes={enhancedFragrance.notes}
          />
        </TabsContent>

        <TabsContent value="harmony">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <NoteHarmonyVisualizer harmony={enhancedFragrance.harmony} />
            <MoodVisualizer
              characteristics={enhancedFragrance.characteristics}
            />
          </div>
        </TabsContent>

        <TabsContent value="seasonal">
          <SeasonalWheel seasonal={enhancedFragrance.seasonal} />
        </TabsContent>

        <TabsContent value="rating">
          <AuthCheck>
            <RatingCard
              productId={product.id}
              initialRating={
                userPerfume?.rating
                  ? {
                      sillage: product.scentProfile.sillage,
                      longevity: product.scentProfile.longevity,
                      value: product.scentProfile.value,
                      projection: product.scentProfile.sillage,
                      complexity: product.scentProfile.uniqueness,
                      review: userPerfume.review,
                    }
                  : undefined
              }
              onSubmit={handleRatingSubmit}
            />
          </AuthCheck>
        </TabsContent>
      </Tabs>
    </div>
  );
}
