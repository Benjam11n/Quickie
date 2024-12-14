"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth";
import { useUserPerfumes } from "@/hooks/use-user-perfumes";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  User,
  Home,
  Search,
  Scale,
  MapPin,
  Heart,
  BookOpen,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  Star,
  Grid,
  TrendingUp,
  Newspaper,
  Sparkles,
} from "lucide-react";

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
        <Menu className="h-5 w-5" />
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
              onClick={() => setIsOpen(false)}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 20 }}
              className="fixed inset-y-0 left-0 w-full max-w-xs bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-r z-50 md:hidden"
            >
              <div className="flex h-full flex-col">
                {/* Header */}
                <div className="p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <span className="font-bold">Quickie</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ThemeToggle />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setIsOpen(false)}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* User Profile */}
                {user ? (
                  <div className="p-4 border-b">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-semibold">{user.name}</div>
                        <Link
                          href="/profile"
                          className="text-sm text-muted-foreground hover:text-primary transition-colors"
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
                  <div className="p-4 border-b">
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
                            <item.icon className="mr-2 h-4 w-4" />
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
                            <item.icon className="mr-2 h-4 w-4" />
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
                              <item.icon className="mr-2 h-4 w-4" />
                              <span>{item.label}</span>
                            </span>
                          </Link>
                        ))}
                        <button
                          onClick={() => {
                            logout();
                            setIsOpen(false);
                          }}
                          className="w-full group flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors text-destructive"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
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
