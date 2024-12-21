'use client';

import { Sparkles, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';

import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { communityNavItems, getMainNavItems } from '@/constants';
import { cn } from '@/lib/utils';

import { NavUser } from './NavUser';

const MobileSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const user = session?.user;
  const mainNavItems = getMainNavItems(session?.user);

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer rounded-md p-3 hover:bg-accent hover:text-accent-foreground lg:hidden">
        <Menu className="size-5" />
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
            </div>
          </SheetHeader>

          {/* Navigation */}
          <div className="flex h-full flex-col justify-between">
            <ScrollArea className="flex-1 p-2">
              {/* Main Navigation */}
              <div className="mt-2 space-y-1">
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
                <h4 className="mt-2 px-3 text-sm font-medium text-muted-foreground">
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
            </ScrollArea>

            {user && <NavUser user={user} />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
