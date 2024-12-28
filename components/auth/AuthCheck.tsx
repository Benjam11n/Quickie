'use client';

import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import React, { ReactNode, HTMLAttributes } from 'react';

import { useAuthDialogStore } from '@/hooks/stores/use-auth-dialog-store';

interface AuthCheckProps {
  children: ReactNode;
  onAuthSuccess?: () => void;
}

export function AuthCheck({ children, onAuthSuccess }: AuthCheckProps) {
  const { data: session } = useSession();
  const { open } = useAuthDialogStore();
  const pathname = usePathname();

  if (!session) {
    return React.Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        return React.cloneElement(
          child as React.ReactElement<HTMLAttributes<HTMLElement>>,
          {
            onClick: (e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
              open(onAuthSuccess, pathname); // Pass current path as callback
            },
          }
        );
      }
      return child;
    });
  }
  return <>{children}</>;
}
