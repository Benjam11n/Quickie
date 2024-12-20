// 'use client';

// import { AuthDialog } from '@/components/auth/AuthDialog';
// import { useAuthDialog } from '@/hooks/use-auth-dialog';

import { Footer } from './Footer';
import { NavBar } from './navigation';
import MobileSidebar from './navigation/MobileSidebar';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  // const { isOpen, close, onSuccess } = useAuthDialog();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="w-full flex-1 bg-background/85">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <NavBar />
          {children}
          <Footer />
        </div>
      </main>

      <MobileSidebar />
      {/* <AuthDialog open={isOpen} onOpenChange={close} onSuccess={onSuccess} /> */}
    </div>
  );
}
