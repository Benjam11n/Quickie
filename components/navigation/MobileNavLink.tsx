'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

import { SheetClose } from '../ui/sheet';

interface MobileNavLinkProps {
  href: string;
  label: string;
  icon?: LucideIcon; // This is correct
}

export function MobileNavLink({ href, label, icon: Icon }: MobileNavLinkProps) {
  const pathname = usePathname();

  return (
    <SheetClose key={label} asChild>
      <Link href={href} className="block">
        <span
          className={cn(
            'group flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
            pathname === href ? 'bg-accent' : ''
          )}
        >
          {Icon && <Icon className="mr-2 size-4" />}
          <span>{label}</span>
        </span>
      </Link>
    </SheetClose>
  );
}
