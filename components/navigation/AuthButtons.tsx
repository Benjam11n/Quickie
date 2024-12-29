'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { User as UserType } from 'next-auth';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

interface AuthButtonsProps {
  user?: UserType;
}

export function AuthButtons({ user }: AuthButtonsProps) {
  const userName = user?.name;

  if (userName) {
    return (
      <>
        <Button asChild variant="ghost" size="sm" aria-label="Profile">
          <Link href={ROUTES.USER_PROFILE}>
            <User className="mr-2 size-4" />
            Profile
          </Link>
        </Button>

        <Link href={ROUTES.USER_PROFILE}>
          <Avatar className="my-3 size-8">
            <AvatarImage src={user?.image ?? '/images/default-avatar.png'} />
            <AvatarFallback>
              {userName.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" aria-label="Sign In">
        <Link href={ROUTES.SIGN_IN}>Sign In</Link>
      </Button>
      <Button asChild variant="premium" size="sm" aria-label="Get Started">
        <Link href={ROUTES.SIGN_UP}>Get Started</Link>
      </Button>
    </>
  );
}
