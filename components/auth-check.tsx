"use client";

import { useAuth } from "@/lib/auth";
import { useAuthDialog } from "@/hooks/use-auth-dialog";
import { ReactNode } from "react";

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
