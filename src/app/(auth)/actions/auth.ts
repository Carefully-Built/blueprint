'use server';

import { redirect } from 'next/navigation';

import { syncUserToConvex } from '@/lib/convex-server';
import { createSession, deleteSession } from '@/lib/session';
import { WORKOS_CLIENT_ID, workos } from '@/lib/workos';

export async function signUp(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    await workos.userManagement.createUser({
      email,
      password,
      emailVerified: true,
    });

    const { user: authenticatedUser, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithPassword({
        clientId: WORKOS_CLIENT_ID,
        email,
        password,
      });

    await syncUserToConvex(authenticatedUser);

    await createSession({
      user: authenticatedUser,
      accessToken,
      refreshToken,
    });

    return { success: true };
  } catch (error) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create account',
    };
  }
}

export async function signIn(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { user, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithPassword({
        clientId: WORKOS_CLIENT_ID,
        email,
        password,
      });

    await syncUserToConvex(user);

    await createSession({
      user,
      accessToken,
      refreshToken,
    });

    return { success: true };
  } catch (error) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Invalid email or password',
    };
  }
}

export async function signOut(): Promise<void> {
  await deleteSession();
  redirect('/');
}
