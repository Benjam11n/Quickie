"use client";

import { ReactNode } from "react";

import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { useAuth } from "@/lib/auth";

interface AuthCheckProps {
  children: ReactNode;
  onAuthSuccess?: () => void;
}

export function AuthCheck({ children, onAuthSuccess }: AuthCheckProps) {
  const { isAuthenticated } = useAuth();
  const { open } = useAuthDialog();

  const handleClick = (e: React.MouseEvent) => {
    if (!isAuthenticated) {
      e.preventDefault();
      e.stopPropagation();
      open(onAuthSuccess);
    }
  };

  return <div onClick={handleClick}>{children}</div>;
}
