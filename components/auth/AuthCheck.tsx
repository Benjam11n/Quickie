'use client';

import { useSession } from 'next-auth/react';
import { ReactNode } from 'react';

import { useAuthDialog } from '@/hooks/use-auth-dialog';

interface AuthCheckProps {
  children: ReactNode;
  onAuthSuccess?: () => void;
}

export function AuthCheck({ children, onAuthSuccess }: AuthCheckProps) {
  const { data: session } = useSession();
  const { open } = useAuthDialog();

  const handleClick = (e: React.MouseEvent) => {
    if (!session) {
      e.preventDefault();
      e.stopPropagation();
      open(onAuthSuccess);
    }
  };

  return <div onClick={handleClick}>{children}</div>;
}
