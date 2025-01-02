import Image from 'next/image';
import Link from 'next/link';

import { auth } from '@/auth';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { navLinks } from '@/constants';
import { ROUTES } from '@/constants/routes';

import { AuthButtons } from './AuthButtons';
import MobileSidebar from './MobileSidebar';
import { NavLink } from './NavLink';

export async function NavBar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 mb-8 w-full border-b bg-background/80 backdrop-blur">
      <nav className="container flex h-16 items-center px-4">
        <div className="flex gap-6 lg:gap-10">
          <Link
            href={ROUTES.HOME}
            prefetch
            className="flex items-center space-x-2"
          >
            <Image
              src="/images/nav-logo.png"
              alt="Quickie logo"
              width={40}
              height={40}
            />
            <span className="inline-block font-bold">Quickie</span>
          </Link>
          <div className="hidden gap-6 lg:flex">
            {navLinks.map((navLink) => (
              <NavLink
                key={navLink.href}
                href={navLink.href}
                label={navLink.label}
              />
            ))}

            {/* todo: complete AI recommendations */}
            {/* <Link
              href={ROUTES.RECOMMENDATION}
              className="flex items-center text-lg font-medium sm:text-sm"
            >
              <Sparkles className="mr-2 size-4 text-primary" />
              <h2 className="holographic-text text-lg font-medium sm:text-sm">
                AI Recommendations
              </h2>
            </Link> */}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
          <div className="hidden items-center gap-2 lg:flex">
            <AuthButtons user={session?.user} />
          </div>
          <MobileSidebar user={session?.user} />
        </div>
      </nav>
    </header>
  );
}
