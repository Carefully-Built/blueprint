import { getSession } from './session';
import { workos, WORKOS_CLIENT_ID } from './workos';

export type WidgetScopes =
  | 'widgets:users-table:manage'
  | 'widgets:sso:manage'
  | 'widgets:domain-verification:manage'
  | 'widgets:api-keys:manage';

interface GetWidgetTokenOptions {
  organizationId: string;
  scopes: WidgetScopes[];
}

interface WidgetTokenResult {
  token: string;
}

export async function getWidgetToken(options: GetWidgetTokenOptions): Promise<string> {
  const session = await getSession();

  if (!session?.user) {
    throw new Error('Unauthorized');
  }

  const result = (await workos.widgets.getToken({
    organizationId: options.organizationId,
    userId: session.user.id,
    scopes: options.scopes,
  })) as unknown as WidgetTokenResult;

  return result.token;
}

interface OrganizationDomain {
  state: string;
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
    const domains = org.domains as OrganizationDomain[] | undefined;

    if (domains?.some(d => d.state === 'verified')) {
      const authUrl = workos.userManagement.getAuthorizationUrl({
        clientId: WORKOS_CLIENT_ID,
        redirectUri,
        organizationId,
        provider: 'authkit',
      });
      return authUrl;
    }
  } catch (err) {
    console.error('Error checking organization:', err);
  }

  return null;
}
