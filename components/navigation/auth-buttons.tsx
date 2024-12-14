"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { User } from "lucide-react";

export function AuthButtons() {
  const { isAuthenticated } = useAuth();
  const { open } = useAuthDialog();

  if (isAuthenticated) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link href="/profile">
          <User className="h-4 w-4 mr-2" />
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
