"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Home,
  Search,
  Scale,
  MapPin,
  Heart,
  Settings,
  HelpCircle,
  LogOut,
  Star,
  Grid,
  TrendingUp,
  Newspaper,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUserPerfumes } from "@/hooks/use-user-perfumes";
import { useAuth } from "@/lib/auth";
import { cn } from "@/lib/utils";

const mainNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/catalog", label: "Explore Perfumes", icon: Search },
  { href: "/compare", label: "Compare", icon: Scale },
  { href: "/locations", label: "Vending Machines", icon: MapPin },
  { href: "/profile", label: "My Collection", icon: Grid },
  { href: "/profile?tab=favorites", label: "Wishlist", icon: Heart },
];

const communityNavItems = [
  { href: "/reviews", label: "Latest Reviews", icon: Star },
  { href: "/trending", label: "Trending", icon: TrendingUp },
  { href: "/news", label: "News & Articles", icon: Newspaper },
];

const userNavItems = [
  { href: "/settings", label: "Settings", icon: Settings },
  { href: "/help", label: "Help & Support", icon: HelpCircle },
];

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { collections } = useUserPerfumes();

  // Lock body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const stats = {
    reviews: collections.filter((item) => item.rating).length,
    tried: collections.filter((item) => item.inCollection).length,
  };

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setIsOpen(true)}
      >
        <Menu className="size-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs border-r bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="border-b p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="size-5 text-primary" />
                      <span className="font-bold">Quickie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="size-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* User Profile */}
                {user ? (
                  <div className="border-b p-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex size-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500 font-bold text-white">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <Link
                          href="/profile"
                          className="text-sm text-muted-foreground transition-colors hover:text-primary"
                          onClick={() => setIsOpen(false)}
                        >
                          View Profile
                        </Link>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{stats.reviews} Reviews</span>
                      <span>{stats.tried} Perfumes Tried</span>
                    </div>
                  </div>
                ) : (
                  <div className="border-b p-4">
                    <Button
                      className="w-full"
                      onClick={() => {
                        setIsOpen(false);
                        // Open auth dialog
                      }}
                    >
                      Sign In
                    </Button>
                  </div>
                )}

                {/* Navigation */}
                <ScrollArea className="flex-1 px-2">
                  <div className="space-y-4 py-4">
                    {/* Main Navigation */}
                    <div className="space-y-1">
                      {mainNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                        >
                          <span
                            className={cn(
                              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                              pathname === item.href
                                ? "bg-accent"
                                : "transparent"
                            )}
                          >
                            <item.icon className="mr-2 size-4" />
                            <span>{item.label}</span>
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* Community Section */}
                    <div className="space-y-1">
                      <h4 className="px-3 text-sm font-medium text-muted-foreground">
                        Community
                      </h4>
                      {communityNavItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                        >
                          <span
                            className={cn(
                              "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                              pathname === item.href
                                ? "bg-accent"
                                : "transparent"
                            )}
                          >
                            <item.icon className="mr-2 size-4" />
                            <span>{item.label}</span>
                          </span>
                        </Link>
                      ))}
                    </div>

                    {/* User Actions */}
                    {user && (
                      <div className="space-y-1">
                        <h4 className="px-3 text-sm font-medium text-muted-foreground">
                          Settings
                        </h4>
                        {userNavItems.map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                          >
                            <span
                              className={cn(
                                "group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors",
                                pathname === item.href
                                  ? "bg-accent"
                                  : "transparent"
                              )}
                            >
                              <item.icon className="mr-2 size-4" />
                              <span>{item.label}</span>
                            </span>
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-accent hover:text-accent-foreground"
                        >
                          <LogOut className="mr-2 size-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
