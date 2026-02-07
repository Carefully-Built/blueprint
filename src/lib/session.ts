import { sealData, unsealData } from 'iron-session';
import { cookies } from 'next/headers';

import { WORKOS_COOKIE_PASSWORD } from './workos';

import type { User } from '@workos-inc/node';


export interface SessionData {
  user: User;
  accessToken: string;
  refreshToken: string;
}

const SESSION_OPTIONS = {
  password: WORKOS_COOKIE_PASSWORD,
  ttl: 60 * 60 * 24 * 7, // 7 days
};

export async function createSession(data: SessionData) {
  const cookieStore = await cookies();
  const encryptedSession = await sealData(data, SESSION_OPTIONS);

  cookieStore.set('session', encryptedSession, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_OPTIONS.ttl,
    path: '/',
  });
}

export async function getSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  const encryptedSession = cookieStore.get('session');

  if (!encryptedSession?.value) {
    return null;
  }

  try {
    const session = await unsealData<SessionData>(
      encryptedSession.value,
      SESSION_OPTIONS
    );
    return session;
  } catch (error) {
    return null;
  }
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
