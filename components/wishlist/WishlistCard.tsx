'use client';

import { MoreHorizontal } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import { WishlistView } from '@/types';

import ConfirmationDialog from '../ConfirmationDialog';

interface WishlistCardProps {
  wishlist: WishlistView;
  onDelete: () => void;
  onEdit: () => void;
}

export function WishlistCard({
  wishlist,
  onDelete,
  onEdit,
}: WishlistCardProps) {
  const hasItems = wishlist.perfumes.length > 0;
  const firstPerfume = wishlist.perfumes[0]?.perfume;

  return (
    <Card className="group relative overflow-hidden">
      <CardHeader className="space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle>{wishlist.name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>

              <ConfirmationDialog
                trigger={
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    Delete
                  </DropdownMenuItem>
                }
                item="wishlist"
                onConfirm={onDelete}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription>
          {hasItems ? `${wishlist.perfumes.length} perfumes` : 'Empty wishlist'}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Link href={ROUTES.WISHLISTS_VIEW(wishlist._id)}>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {hasItems ? (
              <Image
                src={firstPerfume.images[0]}
                alt={firstPerfume.name}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No perfumes added
              </div>
            )}
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}
