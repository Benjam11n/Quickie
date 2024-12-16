'use client';
import { Menu } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useNavStore } from '@/hooks/use-nav-store';

export function MobileNavTrigger() {
  const { openNav } = useNavStore();

  return (
    <Button variant="ghost" size="icon" className="lg:hidden" onClick={openNav}>
      <Menu className="size-5" />
    </Button>
  );
}
