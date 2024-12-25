import { Bookmark, ExternalLink, Heart } from 'lucide-react';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { UserPerfume } from '@/types/fragrance';

import AffiliateNotice from './AffiliateNotice';
import { AuthCheck } from '../auth/AuthCheck';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface ProductInfoProps {
  brand: string;
  price: number;
  description: string;
  categories: string[];
  userPerfume?: UserPerfume;
  affiliateLink: string;
  onCollectionClick: () => void;
  onFavoriteClick: () => void;
}

export function ProductInfo({
  brand,
  price,
  description,
  categories,
  userPerfume,
  affiliateLink,
  onCollectionClick,
  onFavoriteClick,
}: ProductInfoProps) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xl text-muted-foreground">{brand}</p>
        <p className="mt-2 text-3xl font-bold">${price}</p>
      </div>

      <p className="text-muted-foreground">{description}</p>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Badge key={category} variant="secondary">
            {category}
          </Badge>
        ))}
      </div>

      <div className="flex w-full gap-4">
        <AuthCheck onAuthSuccess={onCollectionClick}>
          <Button
            className={cn(
              'w-full',
              userPerfume?.inCollection ? 'bg-green-500 hover:bg-green-600' : ''
            )}
            size="lg"
          >
            <Bookmark className="mr-2 size-5" />
            {userPerfume?.inCollection ? 'In Collection' : 'Add to Collection'}
          </Button>
        </AuthCheck>
        <AuthCheck onAuthSuccess={onFavoriteClick}>
          <Button
            variant="outline"
            size="icon"
            className={userPerfume?.isFavorite ? 'text-red-500' : ''}
          >
            <Heart
              className={`size-5 ${userPerfume?.isFavorite ? 'fill-current' : ''}`}
            />
          </Button>
        </AuthCheck>
        <AffiliateNotice>
          <Button variant="outline" size="lg" asChild className="flex-1">
            <Link href={affiliateLink} passHref>
              <ExternalLink className="mr-2 size-4" />
              Buy from Partner
            </Link>
          </Button>
        </AffiliateNotice>
      </div>
    </div>
  );
}
