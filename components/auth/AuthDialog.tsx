'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { useSession } from 'next-auth/react';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useAuthDialogStore } from '@/hooks/stores/use-auth-dialog-store';
import { signInWithCredentials } from '@/lib/actions/auth.action';
import { SignInSchema } from '@/lib/validations';

import AuthForm from '../forms/AuthForm';

export function AuthDialog() {
  const { update } = useSession();
  const { isOpen, close, onSuccess } = useAuthDialogStore();

  return (
    <Dialog open={isOpen} onOpenChange={close}>
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
            onSuccess?.();
            close();
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
