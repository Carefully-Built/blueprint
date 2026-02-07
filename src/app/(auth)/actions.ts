'use server';

import { redirect } from 'next/navigation';

import { workos, WORKOS_CLIENT_ID } from '@/lib/workos';
import { createSession, deleteSession } from '@/lib/session';
import { syncUserToConvex } from '@/lib/convex-server';

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;

  try {
    // Create user in WorkOS
    await workos.userManagement.createUser({
      email,
      password,
      firstName,
      lastName,
      emailVerified: true, // Set to false if you want email verification
    });

    // Authenticate the user to get tokens
    const { user: authenticatedUser, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithPassword({
        clientId: WORKOS_CLIENT_ID,
        email,
        password,
      });

    // Sync user to Convex (server-side, reliable)
    await syncUserToConvex(authenticatedUser);

    // Create session
    await createSession({
      user: authenticatedUser,
      accessToken,
      refreshToken,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Sign up error:', error);
    return {
      success: false,
      error: error.message || 'Failed to create account',
    };
  }
}

export async function signIn(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const { user, accessToken, refreshToken } =
      await workos.userManagement.authenticateWithPassword({
        clientId: WORKOS_CLIENT_ID,
        email,
        password,
      });

    // Sync user to Convex (server-side, reliable)
    await syncUserToConvex(user);

    // Create session
    await createSession({
      user,
      accessToken,
      refreshToken,
    });

    return { success: true };
  } catch (error: any) {
    console.error('Sign in error:', error);
    return {
      success: false,
      error: error.message || 'Invalid email or password',
    };
  }
}

export async function signOutAction() {
  await deleteSession();
  redirect('/');
}
