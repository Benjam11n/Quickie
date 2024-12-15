import { ClientLayout } from '@/components/client-layout';
import { ReactNode } from 'react';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <ClientLayout>{children}</ClientLayout>;
};

export default RootLayout;
