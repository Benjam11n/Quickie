'use client';

import { LogOut, Sparkles, Menu } from 'lucide-react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { signOut } from '@/auth';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { communityNavItems, getMainNavItems, userNavItems } from '@/constants';
import { ROUTES } from '@/constants/routes';
import { useUserPerfumes } from '@/hooks/use-user-perfumes';
import { cn } from '@/lib/utils';

import { ThemeToggle } from '../theme';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

const MobileSidebar = () => {
  const pathname = usePathname();
  const { collections } = useUserPerfumes();

  const { data: session } = useSession();
  if (!session?.user) {
    return redirect('/sign-in');
  }

  const user = session.user;
  const displayName = user.name || 'user';
  const mainNavItems = getMainNavItems(session?.user);
  const stats = {
    reviews: collections.filter((item) => item.rating).length,
    tried: collections.filter((item) => item.inCollection).length,
  };

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer rounded-md p-3 hover:bg-accent hover:text-accent-foreground lg:hidden">
        {/* <Button variant="ghost"> */}
        <Menu className="size-5" />
        {/* </Button> */}
      </SheetTrigger>
      <SheetContent side="right" className="w-full max-w-xs p-0">
        <div className="flex h-full flex-col">
          {/* Header */}
          <SheetHeader className="border-b p-4">
            <div className="flex items-center justify-start gap-3">
              <SheetTitle className="flex items-center gap-2">
                <Sparkles className="size-5 text-primary" />
                <span className="font-bold">Quickie</span>
              </SheetTitle>
              <div className="flex items-center gap-2">
                <ThemeToggle />
              </div>
            </div>
          </SheetHeader>

          {/* User Profile */}
          <div className="border-b p-4">
            <div className="mb-3 flex items-center gap-3">
              <Avatar className="m-2 size-12">
                <AvatarImage src="/images/default-avatar.png" />
                <AvatarFallback>
                  {user.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div>
                <div className="font-semibold">{user.name || displayName}</div>
                <SheetClose asChild>
                  <Link
                    href={ROUTES.PROFILE(displayName)}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    View Profile
                  </Link>
                </SheetClose>
              </div>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{stats.reviews} Reviews</span>
              <span>{stats.tried} Perfumes Tried</span>
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-2">
            <div className="space-y-4 py-4">
              {/* Main Navigation */}
              <div className="space-y-1">
                {mainNavItems.map((item) => (
                  <SheetClose key={item.label} asChild>
                    <Link href={item.href} className="block">
                      <span
                        className={cn(
                          'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          pathname === item.href ? 'bg-accent' : ''
                        )}
                      >
                        <item.icon className="mr-2 size-4" />
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  </SheetClose>
                ))}
              </div>

              {/* Community Section */}
              <div className="space-y-1">
                <h4 className="px-3 py-1 text-sm font-medium text-muted-foreground">
                  Community
                </h4>
                {communityNavItems.map((item) => (
                  <SheetClose key={item.label} asChild>
                    <Link href={item.href} className="block">
                      <span
                        className={cn(
                          'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          pathname === item.href ? 'bg-accent' : ''
                        )}
                      >
                        <item.icon className="mr-2 size-4" />
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  </SheetClose>
                ))}
              </div>

              {/* User Actions */}
              <div className="space-y-1">
                <h4 className="px-3 text-sm font-medium text-muted-foreground">
                  Settings
                </h4>
                {userNavItems.map((item) => (
                  <SheetClose key={item.label} asChild>
                    <Link href={item.href} className="block">
                      <span
                        className={cn(
                          'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                          pathname === item.href ? 'bg-accent' : ''
                        )}
                      >
                        <item.icon className="mr-2 size-4" />
                        <span>{item.label}</span>
                      </span>
                    </Link>
                  </SheetClose>
                ))}
                <form
                  action={async () => {
                    await signOut();
                  }}
                >
                  <button
                    type="submit"
                    className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogOut className="mr-2 size-4" />
                    <span>Log Out</span>
                  </button>
                </form>
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
