"use client";

import { Navigation } from "@/components/navigation";
import { Footer } from "@/components/footer";
import { AuthDialog } from "@/components/auth-dialog";
import { useAuthDialog } from "@/hooks/use-auth-dialog";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isOpen, close, onSuccess } = useAuthDialog();

  return (
    <>
      <Navigation />
      <main className="min-h-screen bg-background px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1400px] mx-auto">{children}</div>
      </main>
      <Footer />
      <AuthDialog open={isOpen} onOpenChange={close} onSuccess={onSuccess} />
    </>
  );
}
