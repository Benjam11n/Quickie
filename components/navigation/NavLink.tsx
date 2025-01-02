'use client';

import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { cn } from '@/lib/utils';

interface NavLinkProps {
  href: string;
  label: string;
  icon?: LucideIcon;
  classname?: string;
}

export function NavLink({ href, label, icon: Icon, classname }: NavLinkProps) {
  const pathname = usePathname();
  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        `flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm ${classname}`,
        active ? 'text-foreground' : 'text-foreground/60'
      )}
    >
      {Icon && <Icon className="mr-2 size-4" />}
      {label}
    </Link>
  );
}
