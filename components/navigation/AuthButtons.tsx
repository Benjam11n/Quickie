'use client';

import { User } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';
import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { useAuth } from '@/lib/utils/auth';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

export function AuthButtons() {
  const { isAuthenticated, user } = useAuth();
  const { open } = useAuthDialog();

  if (isAuthenticated && user) {
    return (
      <>
        <Button asChild variant="ghost" size="sm">
          <Link href={ROUTES.PROFILE(user.name)}>
            <User className="mr-2 size-4" />
            Profile
          </Link>
        </Button>

        <Link href={ROUTES.PROFILE(user.name)}>
          <Avatar className="my-3 size-8">
            <AvatarImage src="/images/default-avatar.png" />
            <AvatarFallback>
              {user.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Link>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => open()}>
        Sign In
      </Button>
      <Button asChild size="sm">
        <Link href={ROUTES.SIGN_UP}>Get Started</Link>
      </Button>
    </>
  );
}
