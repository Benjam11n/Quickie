'use client';

import { Sparkles } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { navLinks } from '@/constants';
import { ROUTES } from '@/constants/routes';

import { AuthButtons } from './AuthButtons';
import { MobileNavTrigger } from './MobileNavTrigger';
import { NavLink } from './NavLink';

export function NavBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-[1000] mb-8 w-full border-b bg-background/80 backdrop-blur">
      <nav className="container flex h-16 items-center px-4">
        <div className="flex gap-6 lg:gap-10">
          <Link href={ROUTES.HOME} className="flex items-center space-x-2">
            <Sparkles className="size-6" />
            <span className="inline-block font-bold">Quickie</span>
          </Link>
          <div className="hidden gap-6 lg:flex">
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
          <div className="hidden items-center gap-2 lg:flex">
            <ThemeToggle />
            <AuthButtons />
          </div>
          <MobileNavTrigger />
        </div>
      </nav>
    </header>
  );
}
