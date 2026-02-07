import { getSession } from './session';
import { workos } from './workos';

export type WidgetScopes =
  | 'widgets:users-table:manage'
  | 'widgets:sso:manage'
  | 'widgets:domain-verification:manage'
  | 'widgets:api-keys:manage';

interface GetWidgetTokenOptions {
  organizationId: string;
  scopes: WidgetScopes[];
}

export async function getWidgetToken(options: GetWidgetTokenOptions): Promise<string> {
  const session = await getSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const result = await workos.widgets.getToken({
    organizationId: options.organizationId,
    userId: session.user.id,
    scopes: options.scopes,
  });

  return (result as any).token ?? (result as unknown as string);
}

export async function getOrganizationSwitchUrl(
  organizationId: string,
  redirectUri: string
): Promise<string | null> {
  const session = await getSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  try {
    const org = await workos.organizations.getOrganization(organizationId);

    if (org.domains?.some(d => d.state === 'verified')) {
      const authUrl = workos.userManagement.getAuthorizationUrl({
        clientId: process.env.WORKOS_CLIENT_ID!,
        redirectUri,
        organizationId,
        provider: 'authkit',
      });
      return authUrl;
    }
  } catch (error) {
    console.error('Error checking organization:', error);
  }

  return null;
}
