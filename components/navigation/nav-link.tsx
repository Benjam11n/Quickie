"use client";

import { LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface NavLinkProps {
  href: string;
  label: string;
  active: boolean;
  icon?: LucideIcon;
}

export function NavLink({ href, label, active, icon: Icon }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center text-lg font-medium transition-colors hover:text-foreground/80 sm:text-sm",
        active ? "text-foreground" : "text-foreground/60"
      )}
    >
      {Icon && <Icon className="mr-2 size-4" />}
      {label}
    </Link>
  );
}
