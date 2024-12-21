'use client';

import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { signInWithCredentials } from '@/lib/actions/auth.action';
import { SignInSchema } from '@/lib/validations';

import AuthForm from '../forms/AuthForm';

interface AuthDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onSuccess?: () => void;
}

export function AuthDialog({ open, onOpenChange, onSuccess }: AuthDialogProps) {
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
          onSuccess={onSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
