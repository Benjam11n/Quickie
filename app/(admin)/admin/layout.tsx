import { ReactNode } from 'react';

import { AdminGuard } from '@/components/AdminGuard';

const AdminLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <AdminGuard>{children}</AdminGuard>
    </main>
  );
};

export default AdminLayout;
