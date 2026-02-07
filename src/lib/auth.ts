import { getSession, type SessionData } from './session';

import type { User } from '@workos-inc/node';

export async function getCurrentUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function requireAuth(): Promise<User> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function getCurrentSession(): Promise<SessionData | null> {
  return await getSession();
}
