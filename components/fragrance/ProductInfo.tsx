import { Bookmark, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { CollectionView } from '@/types';
import { PerfumeView } from '@/types/fragrance';

import AffiliateNotice from './AffiliateNotice';
import { AuthCheck } from '../auth/AuthCheck';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ProductInfoProps {
  perfume: PerfumeView;
  collection?: CollectionView;
  onCollectionClick: () => void;
  onFavoriteClick: () => void;
}

export function ProductInfo({
  perfume,
  collection,
  onCollectionClick,
  onFavoriteClick,
}: ProductInfoProps) {
  const inCollection: boolean = collection
    ? collection.perfumes
        .map((perfume) => perfume.perfumeId._id)
        .includes(perfume._id)
    : false;

  // TODO:
  const inWishlist: boolean = false;

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xl text-muted-foreground">{perfume.brand.name}</p>
        <p className="mt-2 text-3xl font-bold">${perfume.price}</p>
      </div>

      <p className="text-muted-foreground">{perfume.description}</p>

      <div className="flex flex-wrap gap-2">
        {perfume.tags.map((tag) => (
          <Badge key={tag.name} variant="secondary">
            {tag.name}
          </Badge>
        ))}
      </div>

      <div className="flex w-full gap-4">
        <AuthCheck onAuthSuccess={onCollectionClick}>
          <Button
            className={cn(
              'w-full',
              inCollection ? 'bg-green-500 hover:bg-green-600' : ''
            )}
            size="lg"
          >
            <Bookmark className="mr-2 size-5" />
            {inCollection ? 'In Collection' : 'Add to Collection'}
          </Button>
        </AuthCheck>
        <AuthCheck onAuthSuccess={onFavoriteClick}>
          <Button
            variant="outline"
            size="icon"
            className={inWishlist ? 'text-red-500' : ''}
          >
            <Heart className={`size-5 ${inWishlist ? 'fill-current' : ''}`} />
          </Button>
        </AuthCheck>
        <AffiliateNotice>
          <Button variant="outline" size="lg" asChild className="flex-1">
            <Link href={perfume.affiliateLink} passHref>
              <ExternalLink className="mr-2 size-4" />
              Buy from Partner
            </Link>
          </Button>
        </AffiliateNotice>
      </div>
    </div>
  );
}
