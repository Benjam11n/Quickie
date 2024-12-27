import { Check } from 'lucide-react';

import { WishlistView } from '@/types';

import { Button } from '../ui/button';

const WishlistButton = ({
  wishlist,
  includesPerfume,
  onSelect,
  onUnSelect,
}: {
  wishlist: WishlistView;
  includesPerfume: boolean;
  onSelect: (wishlistId: string) => void;
  onUnSelect: (wishlistId: string) => void;
}) => (
  <Button
    size="xl"
    variant={includesPerfume ? 'ghost' : 'outline'}
    key={wishlist._id}
    className={`flex w-full items-center justify-between px-6 py-4 text-left ${
      includesPerfume ? 'gradient-border bg-accent text-accent-foreground' : ''
    }`}
    onClick={() =>
      includesPerfume ? onUnSelect(wishlist._id) : onSelect(wishlist._id)
    }
  >
    <div className="flex flex-row items-center justify-between">
      <div>
        <p className="text-lg font-medium">{wishlist.name}</p>
        <p className="text-xs text-muted-foreground">
          {wishlist.perfumes.length} perfumes
        </p>
      </div>
    </div>
    {includesPerfume && <Check />}
  </Button>
);

export default WishlistButton;
