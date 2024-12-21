'use client';

import { AuthDialog } from '@/components/auth/AuthDialog';
import { NavBar } from '@/components/navigation';
import { useAuthDialog } from '@/hooks/use-auth-dialog';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close, onSuccess } = useAuthDialog();

  return (
    <>
      <NavBar />
      {children}
      <AuthDialog open={isOpen} onOpenChange={close} onSuccess={onSuccess} />
    </>
  );
}
