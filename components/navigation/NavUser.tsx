'use client';

import {
  BadgeCheck,
  Bell,
  ChevronsUpDown,
  HelpCircle,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { User } from 'next-auth';
import { signOut } from 'next-auth/react';
import { useMediaQuery } from 'react-responsive';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/constants/routes';
import { useCollection } from '@/hooks/queries/use-collection';
import { useUserReviews } from '@/hooks/queries/use-reviews';

import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { SheetClose } from '../ui/sheet';

interface NavUserProps {
  user: User;
}

export function NavUser({ user }: NavUserProps) {
  const router = useRouter();
  const isMobile = useMediaQuery({ maxWidth: 768 });
  const { data: collectionResponse, isPending: isLoadingCollection } =
    useCollection(user.id);
  const { data: reviewsResponse, isPending: isLoadingReviews } = useUserReviews(
    user.id
  );

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.refresh();
  };

  if (isLoadingCollection || isLoadingReviews) {
    return (
      <Card className="flex flex-row gap-2 p-3">
        <div className="size-10 animate-pulse rounded-lg bg-muted" />{' '}
        {/* Avatar skeleton */}
        <div className="m-1 grid flex-1 gap-2">
          {/* Name and email skeletons */}
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-3 w-32 animate-pulse rounded bg-muted" />
        </div>
        <div className="size-8 animate-pulse rounded bg-muted" />{' '}
        {/* Button skeleton */}
      </Card>
    );
  }

  const collection = collectionResponse?.data;
  const reviews = reviewsResponse?.data;

  const stats = {
    reviews: reviews?.reviews?.length,
    tried: collection?.perfumes.length,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Card className="flex cursor-pointer flex-row gap-2 p-3 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
          <Avatar className="size-10 rounded-lg">
            <AvatarImage
              src={user.image ?? '/images/default-avatar.png'}
              alt={user.name ?? 'Avatar Image'}
            />
            <AvatarFallback className="rounded-lg">CN</AvatarFallback>
          </Avatar>
          <div className="m-1 grid flex-1 text-left text-sm leading-tight">
            <span className="truncate font-semibold">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">
              {user.email}
            </span>
          </div>
          <Button variant="ghost" size="sm">
            <ChevronsUpDown className="ml-auto size-2" />
          </Button>
        </Card>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
        side={isMobile ? 'bottom' : 'left'}
        align="end"
        sideOffset={4}
      >
        {user && (
          <DropdownMenuLabel>
            <SheetClose asChild>
              <Link href={ROUTES.USER_PROFILE}>
                <div className="py-1">
                  <div className="mb-3 flex items-center gap-3">
                    <Avatar className="m-2 size-12 rounded-lg">
                      <AvatarImage
                        src={user.image ?? '/images/default-avatar.png'}
                      />
                      <AvatarFallback>
                        {user.name?.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user.name}
                        </span>
                        <span className="ml-auto truncate text-xs font-normal text-muted-foreground">
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm font-normal text-muted-foreground">
                    <span>{stats.reviews} Reviews</span>
                    <span>{stats.tried} Perfumes Tried</span>
                  </div>
                </div>
              </Link>
            </SheetClose>
          </DropdownMenuLabel>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <SheetClose asChild>
            <Link href={ROUTES.USER_PROFILE}>
              <DropdownMenuItem>
                <BadgeCheck />
                Profile
              </DropdownMenuItem>
            </Link>
          </SheetClose>
          <DropdownMenuItem>
            <Bell />
            Notifications
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HelpCircle />
            Help & Support
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <button onClick={handleSignOut}>
          <DropdownMenuItem className="w-full">
            <LogOut />

            <span className="ml-2">Sign out</span>
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
