'use client';

import { AuthDialog } from '@/components/auth/AuthDialog';
import { NavBar } from '@/components/navigation';
import { useAuthDialogStore } from '@/hooks/stores/use-auth-dialog';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close, onSuccess } = useAuthDialogStore();

  return (
    <>
      <NavBar />
      {children}
      <AuthDialog open={isOpen} onOpenChange={close} onSuccess={onSuccess} />
    </>
  );
}
