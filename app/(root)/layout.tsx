import { ReactNode } from 'react';

import { ClientLayout } from '@/components/ClientLayout';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <ClientLayout>{children}</ClientLayout>;
};

export default RootLayout;
