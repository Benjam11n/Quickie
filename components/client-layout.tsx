'use client';
import { AuthDialog } from '@/components/auth/auth-dialog';
import { Navigation } from '@/components/navigation/navigation';
import { useAuthDialog } from '@/hooks/use-auth-dialog';
import { Footer } from './Footer';

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close, onSuccess } = useAuthDialog();

  return (
    <div className="flex min-h-screen flex-col">
      <main className="w-full flex-1 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Navigation />
          {children}
          <Footer />
        </div>
      </main>
      <AuthDialog open={isOpen} onOpenChange={close} onSuccess={onSuccess} />
    </div>
  );
}
