'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { SprayLoader } from '@/components/SprayLoader';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ROUTES } from '@/constants/routes';
import { WishlistView } from '@/types';

import WishlistButton from './WishlistButton';

interface WishlistSelectDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (wishlistId: string) => void;
  onUnSelect: (wishlistId: string) => void;
  perfumeId: string;
  perfumeName?: string;
  wishlists: WishlistView[];
  isLoading: boolean;
}

export function WishlistSelectDialog({
  isOpen,
  onOpenChange,
  onSelect,
  onUnSelect,
  perfumeId,
  perfumeName = 'this perfume',
  wishlists,
  isLoading,
}: WishlistSelectDialogProps) {
  const router = useRouter();

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <VisuallyHidden>
          <DialogTitle>
            {isLoading ? 'Wishlist loading...' : 'Error loading wishlists.'}
          </DialogTitle>
        </VisuallyHidden>

        <VisuallyHidden>
          <DialogDescription>
            {isLoading
              ? 'Loading your wishlists, please wait.'
              : 'An error occured loading your wishlists.'}
          </DialogDescription>
        </VisuallyHidden>
        <DialogContent>
          <div className="flex min-h-[300px] items-center justify-center">
            <SprayLoader />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const handleNewWishlist = () => {
    onOpenChange(false);
    router.push(ROUTES.WISHLISTS_NEW);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <VisuallyHidden>
          <DialogDescription>
            Select a wishlist to add the perfume to.
          </DialogDescription>
        </VisuallyHidden>
        <DialogHeader>
          <DialogTitle className="holographic-text text-2xl">
            Add to Wishlist
          </DialogTitle>
        </DialogHeader>
        <div className="pb-4">
          {wishlists.length === 0 ? (
            <div className="flex min-h-[200px] flex-col items-center justify-center gap-4 text-center">
              <p className="text-muted-foreground">No wishlists found</p>
              <Button onClick={handleNewWishlist} className="gap-2">
                <Plus className="size-4" />
                Create Your First Wishlist
              </Button>
            </div>
          ) : (
            <>
              <h4 className="mb-4 text-sm text-muted-foreground">
                Select a wishlist to add {perfumeName} to:
              </h4>
              <ScrollArea className="h-[300px] pr-4">
                <div className="space-y-2">
                  {wishlists.map((wishlist) => {
                    const includesPerfume = wishlist.perfumes
                      .map((perfume) => perfume.perfumeId._id)
                      .includes(perfumeId);

                    return (
                      <WishlistButton
                        key={wishlist._id}
                        wishlist={wishlist}
                        includesPerfume={includesPerfume}
                        onSelect={onSelect}
                        onUnSelect={onUnSelect}
                      />
                    );
                  })}
                </div>
              </ScrollArea>
              <div className="mt-4 flex justify-end">
                <Button onClick={handleNewWishlist} className="gap-2">
                  <Plus className="size-4" />
                  Create New Wishlist
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
