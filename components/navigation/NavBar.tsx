'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/theme/theme-toggle';

import { AuthButtons } from './AuthButtons';
import { NavLink } from './NavLink';
import { navLinks } from '@/constants';
import { MobileNavTrigger } from './MobileNavTrigger';

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[1000] mb-8 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="size-6" />
            <span className="inline-block font-bold">Quickie</span>
          </Link>
          <div className="hidden gap-6 md:flex">
            {navLinks.map((navLink) => (
              <NavLink
                key={navLink.href}
                href={navLink.href}
                label={navLink.label}
                active={navLink.active(pathname)}
              />
            ))}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <AuthButtons />
          </div>
          <MobileNavTrigger />
        </div>
      </nav>
    </header>
  );
}
