'use server';

import { WORKOS_CLIENT_ID, WORKOS_REDIRECT_URI, workos } from '@/lib/workos';

// eslint-disable-next-line @typescript-eslint/require-await
export async function getGoogleAuthUrl(): Promise<string> {
  const authUrl = workos.userManagement.getAuthorizationUrl({
    clientId: WORKOS_CLIENT_ID,
    redirectUri: WORKOS_REDIRECT_URI,
    provider: 'GoogleOAuth',
  });

  return authUrl;
}
