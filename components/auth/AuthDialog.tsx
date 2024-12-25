'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSession } from 'next-auth/react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuthDialogStore } from '@/hooks/stores/use-auth-dialog';
import { signInWithCredentials } from '@/lib/actions/auth.action';
import { SignInSchema } from '@/lib/validations';

import AuthForm from '../forms/AuthForm';

interface AuthDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const { update } = useSession();
  const { close } = useAuthDialogStore();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTitle>Sign In</DialogTitle>
      </VisuallyHidden>
      <DialogContent className="pt-12">
        <AuthForm
          formType="SIGN_IN"
          schema={SignInSchema}
          defaultValues={{ email: '', password: '' }}
          onSubmit={signInWithCredentials}
          onSuccess={async () => {
            await update(); // Refresh the session
            close();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
