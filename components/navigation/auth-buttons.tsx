"use client";

import { User } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useAuth } from "@/lib/auth";

export function AuthButtons() {
  const { isAuthenticated } = useAuth();
  const { open } = useAuthDialog();

  if (isAuthenticated) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/profile">
          <User className="mr-2 size-4" />
          Profile
        </Link>
      </Button>
    );
  }

  return (
    <>
      <Button variant="ghost" size="sm" onClick={() => open()}>
        Sign In
      </Button>
      <Button asChild size="sm">
        <Link href="/register">Get Started</Link>
      </Button>
    </>
  );
}
