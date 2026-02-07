import { getSession } from './session';

/**
 * Server-side utility to get the current user
 * Use this in Server Components, Server Actions, and API Routes
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user ?? null;
}

/**
 * Server-side utility to require authentication
 * Throws an error if user is not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized: Authentication required');
  }
  return user;
}

/**
 * Get the full session including tokens
 */
export async function getCurrentSession() {
  return await getSession();
}
