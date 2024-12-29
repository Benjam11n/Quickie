'use client';

import { DialogDescription } from '@radix-ui/react-dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { Sparkles, Menu, LogIn, UserPen } from 'lucide-react';
import Link from 'next/link';
import { User } from 'next-auth';

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
import { ROUTES } from '@/constants/routes';

import { MobileNavLink } from './MobileNavLink';
import { NavUser } from './NavUser';
import { Button } from '../ui/button';

interface MobileSidebarProps {
  user?: User;
}

const MobileSidebar = ({ user }: MobileSidebarProps) => {
  const mainNavItems = getMainNavItems(user);

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer rounded-md p-3 hover:bg-accent hover:text-accent-foreground lg:hidden">
        <Menu className="size-5" />
      </SheetTrigger>
      <VisuallyHidden>
        <DialogDescription>
          Sidebar for navigation on mobile view
        </DialogDescription>
      </VisuallyHidden>
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
                  <MobileNavLink
                    key={item.href}
                    label={item.label}
                    href={item.href}
                  />
                ))}
              </div>
              {/* Community Section */}
              <div className="space-y-1">
                <h4 className="mt-2 px-3 text-sm font-medium text-muted-foreground">
                  Community
                </h4>
                {communityNavItems.map((item) => (
                  <MobileNavLink
                    key={item.href}
                    label={item.label}
                    href={item.href}
                  />
                ))}
              </div>
            </ScrollArea>

            {user ? (
              <NavUser user={user} />
            ) : (
              <div className="m-2 space-y-2 rounded-md p-2">
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_IN} className="block w-full">
                    <Button className="w-full justify-center">
                      <LogIn className="mr-2 size-5" />
                      <span>Sign In</span>
                    </Button>
                  </Link>
                </SheetClose>
                <SheetClose asChild>
                  <Link href={ROUTES.SIGN_UP} className="block w-full">
                    <Button variant="premium" className="w-full justify-center">
                      <UserPen className="mr-2 size-5" />
                      <span>Sign Up</span>
                    </Button>
                  </Link>
                </SheetClose>
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
