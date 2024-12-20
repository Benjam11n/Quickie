import { ROUTES } from '@/constants/routes';
import { IMoodBoard } from '@/database';
import { IAccount } from '@/database/account.model';
import { IUser } from '@/database/user.model';

import { fetchHandler } from './handlers/fetch';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api';

export const api = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOAuthParams) =>
      fetchHandler(`${API_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: 'POST',
        body: JSON.stringify({ user, provider, providerAccountId }),
      }),
  },
  users: {
    getAll: () => fetchHandler(`${API_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/users/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${API_BASE_URL}/users/email`, {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    create: (userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users`, {
        method: 'POST',
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: Partial<IUser>) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/users/${id}`, {
        method: 'DELETE',
      }),
  },
  accounts: {
    getAll: () => fetchHandler(`${API_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${API_BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/provider`, {
        method: 'POST',
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts`, {
        method: 'POST',
        body: JSON.stringify(accountData),
      }),
    update: (id: string, accountData: Partial<IAccount>) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(accountData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/accounts/${id}`, { method: 'DELETE' }),
  },
  moodboards: {
    getAll: () => fetchHandler(`${API_BASE_URL}/moodboards`),
    getById: (id: string) =>
      fetchHandler<IMoodBoard>(`${API_BASE_URL}/moodboards/${id}`),
    create: (moodboardData: Partial<IMoodBoard>) =>
      fetchHandler(`${API_BASE_URL}/moodboards`, {
        method: 'POST',
        body: JSON.stringify(moodboardData),
      }),
    update: (id: string, moodboardData: Partial<IMoodBoard>) =>
      fetchHandler(`${API_BASE_URL}/moodboards/${id}`, {
        method: 'PUT',
        body: JSON.stringify(moodboardData),
      }),
    delete: (id: string) =>
      fetchHandler(`${API_BASE_URL}/moodboards/${id}`, { method: 'DELETE' }),
  },
};
