import SocialAuthForm from '@/components/forms/SocialAuthForm';
import { ReactNode } from 'react';

const AuthLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main
      className="flex min-h-screen items-center justify-center 
        bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
        bg-cover bg-center bg-no-repeat px-4 py-24"
    >
      <section
        className="min-w-full rounded-[10px] border px-4 py-10 shadow-md sm:min-w-[520px] sm:px-8 
          bg-white dark:bg-black text-black dark:text-white"
      >
        {children}
        <SocialAuthForm />
      </section>
    </main>
  );
};

export default AuthLayout;
