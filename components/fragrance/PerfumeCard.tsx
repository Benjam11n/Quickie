'use client';

import { Heart, Check, ExternalLink, Scale, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { StarRating } from '@/components/StarRating';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { useCollectionMutations } from '@/hooks/mutations/use-collection-mutations';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { cn } from '@/lib/utils';
import { CollectionView } from '@/types';
import { Perfume, UserPerfume } from '@/types/fragrance';

import AffiliateNotice from './AffiliateNotice';
import { AuthCheck } from '../auth/AuthCheck';

interface PerfumeCardProps {
  perfume: Perfume;
  userPerfume?: UserPerfume;
  onCompareToggle?: () => void;
  isSelectedForComparison?: boolean;
  collection?: CollectionView;
}

export function PerfumeCard({
  perfume,
  userPerfume,
  onCompareToggle,
  isSelectedForComparison,
  collection,
}: PerfumeCardProps) {
  const router = useRouter();
  const { toggleFavorite } = useUserPerfumes();

  const { addToCollectionMutation, removeFromCollectionMutation } =
    useCollectionMutations(perfume._id);

  const inCollection =
    collection?.perfumes
      ?.map((perfume) => perfume.perfumeId._id)
      .includes(perfume._id) ?? false;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!(e.target as HTMLElement).closest('button')) {
      router.push(ROUTES.PRODUCT(perfume._id));
    }
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(perfume.id);
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
        <Image
          src={perfume.images[0]}
          alt={perfume.name}
          fill
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
              {perfume.name}
            </h3>
            <p className="text-sm text-muted-foreground">{perfume.brand}</p>
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
            ${perfume.price}
          </span>
          <div className="flex gap-2">
            <AffiliateNotice>
              <Button size="sm" variant="outline">
                <Link
                  href={perfume.affiliateLink}
                  passHref
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex"
                >
                  <ExternalLink className="mr-1 size-4" />
                  Buy
                </Link>
              </Button>
            </AffiliateNotice>
            <AuthCheck>
              <Button
                size="sm"
                className={cn(
                  inCollection && 'bg-green-500 hover:bg-green-600'
                )}
                onClick={() => {
                  if (collection) {
                    if (inCollection) {
                      removeFromCollectionMutation.mutate();
                    } else {
                      addToCollectionMutation.mutate();
                    }
                  }
                }}
              >
                {inCollection ? (
                  <>
                    <Check className="mr-1 size-4" />
                    In Collection
                  </>
                ) : (
                  <>
                    <Bookmark className="mr-1 size-4" />
                    Add
                  </>
                )}
              </Button>
            </AuthCheck>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
