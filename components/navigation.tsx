"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { cn } from "@/lib/utils";
import { Sparkles, Scale, User } from "lucide-react";

const routes = [
  {
    href: "/",
    label: "Home",
    active: (pathname: string) => pathname === "/",
  },
  {
    href: "/catalog",
    label: "Temptations",
    active: (pathname: string) => pathname === "/catalog",
  },
  {
    href: "/compare",
    label: "Compare",
    icon: Scale,
    active: (pathname: string) => pathname === "/compare",
  },
  {
    href: "/locations",
    label: "Find Me",
    active: (pathname: string) => pathname === "/locations",
  },
];

export function Navigation() {
  const pathname = usePathname();
  const { isAuthenticated } = useAuth();
  const { open } = useAuthDialog();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <nav className="container flex h-16 items-center">
        <div className="flex gap-6 md:gap-10">
          <Link href="/" className="flex items-center space-x-2">
            <Sparkles className="h-6 w-6" />
            <span className="font-bold inline-block">Quickie</span>
          </Link>
          <div className="hidden md:flex gap-6">
            {routes.map((route) => (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
                  route.active(pathname)
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {route.icon && <route.icon className="mr-2 h-4 w-4" />}
                {route.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <ThemeToggle />
            {isAuthenticated ? (
              <Button asChild variant="ghost" size="sm">
                <Link href="/profile">
                  <User className="h-4 w-4 mr-2" />
                  Profile
                </Link>
              </Button>
            ) : (
              <>
                <Button variant="ghost" size="sm" onClick={() => open()}>
                  Sign In
                </Button>
                <Button asChild size="sm">
                  <Link href="/register">Get Started</Link>
                </Button>
              </>
            )}
          </div>
          <MobileNav />
        </div>
      </nav>
    </header>
  );
}
