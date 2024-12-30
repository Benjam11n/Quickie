import { Bookmark, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { PerfumeView } from '@/types/fragrance';

import AffiliateNotice from './AffiliateNotice';
import { AuthCheck } from '../auth/AuthCheck';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ProductInfoProps {
  perfume: PerfumeView;
  inCollection: boolean;
  isFavourite: boolean;
  onCollectionClick: () => void;
  onFavoriteClick: () => void;
}

export function ProductInfo({
  perfume,
  inCollection,
  isFavourite,
  onCollectionClick,
  onFavoriteClick,
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xl text-muted-foreground">{perfume.brand.name}</p>
        <p className="mt-2 text-3xl font-bold">${perfume.fullPrice}</p>
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
            onClick={onCollectionClick}
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
            onClick={onFavoriteClick}
            className={isFavourite ? 'min-w-10 text-red-500' : 'min-w-10'}
          >
            <Heart className={`size-5 ${isFavourite ? 'fill-current' : ''}`} />
          </Button>
        </AuthCheck>
        <AffiliateNotice>
          <Button variant="outline" size="lg" asChild className="flex-1">
            <Link
              href={perfume.affiliateLink}
              passHref
              target="_blank"
              rel="noopener noreferrer"
            >
              <ExternalLink className="mr-2 size-4" />
              Buy from Partner
            </Link>
          </Button>
        </AffiliateNotice>
      </div>
    </div>
  );
}
