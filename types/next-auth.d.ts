import { DefaultSession, DefaultUser } from 'next-auth';

import { UserRole } from '@/database';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string;
      email?: string;
      image?: string;
      isPrivate?: boolean;
      role?: UserRole;
    } & DefaultSession['user'];
  }

  interface User extends DefaultUser {
    username?: string;
    isPrivate?: boolean;
    role?: UserRole;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role?: string;
    sub?: string;
  }
}
