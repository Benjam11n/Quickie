'use client';

import { User } from 'lucide-react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function AuthButtons() {
  const { data: session } = useSession();

  if (session && session.user && session.user.name) {
    return (
      <>
        <Button asChild variant="ghost" size="sm">
          <Link href={ROUTES.PROFILE(session.user.name)}>
            <User className="mr-2 size-4" />
            Profile
          </Link>
        </Button>

        <Link href={ROUTES.PROFILE(session.user.name)}>
          <Avatar className="my-3 size-8">
            <AvatarImage src="/images/default-avatar.png" />
            <AvatarFallback>
              {session.user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm">
        <Link href={ROUTES.SIGN_IN}>Sign In</Link>
      </Button>
      <Button asChild size="sm">
        <Link href={ROUTES.SIGN_UP}>Get Started</Link>
      </Button>
    </>
  );
}
