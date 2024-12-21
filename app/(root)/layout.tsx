import { ClientLayout } from '@/components/ClientLayout';
import Footer from '@/components/Footer';

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="w-full flex-1 bg-background/85">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <ClientLayout>{children}</ClientLayout>
          <Footer />
        </div>
      </main>
    </div>
  );
}

export default RootLayout;
