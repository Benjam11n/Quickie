import { ReactNode } from 'react';

import { ClientLayout } from '@/components/client-layout';

const RootLayout = ({ children }: { children: ReactNode }) => {
  return <ClientLayout>{children}</ClientLayout>;
};

export default RootLayout;
