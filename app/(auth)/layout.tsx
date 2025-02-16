import { ReactNode } from 'react';

import SocialAuthForm from '@/components/forms/SocialAuthForm';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className="flex min-h-screen items-center justify-center 
        bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
        bg-cover bg-center bg-no-repeat px-4 py-24"
    >
      <section
        className="min-w-full rounded-[10px] border bg-white px-4 py-16 text-black shadow-md 
          dark:bg-black dark:text-white sm:min-w-[520px] sm:px-8"
      >
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
