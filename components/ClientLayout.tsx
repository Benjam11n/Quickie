'use client';

import { AuthDialog } from '@/components/auth/AuthDialog';
import { NavBar } from '@/components/navigation';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <NavBar />
      {children}
      <AuthDialog />
    </>
  );
}
