"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { routes } from "./routes";
import { NavLink } from "./nav-link";
import { AuthButtons } from "./auth-buttons";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { MobileNav } from "../mobile-nav";

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center px-4">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span className="font-bold inline-block">Quickie</span>
          </Link>
          <div className="hidden md:flex gap-6">
            {routes.map((route) => (
              <NavLink
                key={route.href}
                href={route.href}
                label={route.label}
                active={route.active(pathname)}
              />
            ))}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            <AuthButtons />
          </div>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
