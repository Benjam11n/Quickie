import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

import Account, { IAccountDoc } from './database/account.model';
import User, { IUserDoc, UserRole } from './database/user.model';
import { api } from './lib/api';
import { SignInSchema } from './lib/validations';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      async authorize(credentials) {
        const validatedFields = SignInSchema.safeParse(credentials);
        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          // Use direct database query
          const account = await Account.findOne({
            provider: 'credentials',
            providerAccountId: email.toLowerCase(),
          }).select('+password');

          if (!account) return null;

          const user = await User.findById(account.userId);
          if (!user) return null;

          const isValidPassword = await bcrypt.compare(
            password,
            account.password!
          );
          if (isValidPassword) {
            return {
              id: user.id,
              name: user.name,
              username: user.username,
              email: user.email,
              image: user.image,
              isPrivate: user.isPrivate,
              role: user.role,
            };
          }
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.id = token.sub as string;
      session.user.role = token.role as UserRole;

      if (token.sub) {
        const { data: userData, success } = (await api.users.getById(
          token.sub
        )) as ActionResponse<IUserDoc>;
        if (success && userData) {
          session.user.name = userData.name;
          session.user.username = userData.username;
          session.user.image = userData.image;
          session.user.isPrivate = userData.isPrivate;
        }
      }

      return session;
    },
    async jwt({ token, user, account }) {
      // Type user properly when it comes from credentials
      if (user && 'role' in user) {
        token.role = user.role as UserRole;
      }

      if (account && account.type !== 'credentials') {
        const { data: existingAccount, success } =
          (await api.accounts.getByProvider(
            account.providerAccountId
          )) as APIResponse<IAccountDoc>;

        if (success && existingAccount) {
          const userId = existingAccount.userId;
          if (userId) {
            token.sub = userId.toString();

            const { data: userData, success: userSuccess } =
              (await api.users.getById(userId)) as APIResponse<IUserDoc>;

            if (userSuccess && userData) {
              token.role = userData.role;
            }
          }
        }
      }
      return token;
    },
    async signIn({ user, profile, account }) {
      if (account?.type === 'credentials') return true;
      if (!account || !user) return false;

      const userInfo = {
        name: user.name!,
        email: user.email!,
        image: user.image!,
        isPrivate: user.isPrivate!,
        username:
          account.provider === 'github'
            ? (profile?.login as string)
            : (user.name?.toLowerCase() as string),
      };

      const { success } = (await api.auth.oAuthSignIn({
        user: userInfo,
        provider: account.provider as 'github' | 'google',
        providerAccountId: account.providerAccountId,
      })) as ActionResponse;

      if (!success) return false;

      return true;
    },
  },
});
