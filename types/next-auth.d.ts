import { DefaultUser } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      username?: string;
      name?: string;
      email?: string;
      image?: string;
    };
  }

  interface User extends DefaultUser {
    username?: string;
  }
}
