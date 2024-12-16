'use client';

import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

import { ROUTES } from '@/constants/routes';

import { Button } from '../ui/button';

const SocialAuthForm = () => {
  const buttonClass = 'min-h-12 flex-1 rounded-2 px-4 py-3.5';

  const handleSignIn = async (provider: 'github' | 'google') => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      console.log(error);

      toast.error('Sign-in Failed', {
        description:
          error instanceof Error
            ? error.message
            : 'An error occured during sign-in',
      });
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      <Button
        variant="outline"
        className={buttonClass}
        onClick={() => handleSignIn('github')}
      >
        <Image
          src="/icons/github.svg"
          alt="Github Logo"
          width={20}
          height={20}
          className="invert-colors mr-2.5 object-contain"
        />
        <span>Log in with GitHub</span>
      </Button>

      <Button
        variant="outline"
        className={buttonClass}
        onClick={() => handleSignIn('google')}
      >
        <Image
          src="/icons/google.svg"
          alt="Google Logo"
          width={20}
          height={20}
          className="mr-2.5 object-contain"
        />
        <span>Log in with Google</span>
      </Button>
    </div>
  );
};

export default SocialAuthForm;
