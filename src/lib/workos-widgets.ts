import { workos } from './workos';
import { getSession } from './session';

/**
 * Available widget scopes from WorkOS
 */
export type WidgetScopes = 
  | 'widgets:users-table:manage'
  | 'widgets:sso:manage'
  | 'widgets:organization-switcher:read';

interface GetWidgetTokenOptions {
  /** Organization ID (required for org-scoped widgets) */
  organizationId?: string;
  /** Required scopes for the widget */
  scopes: WidgetScopes[];
}

/**
 * Get a widget token for WorkOS widgets.
 * Must be called server-side (Server Component, Server Action, or API Route).
 * 
 * @example
 * ```ts
 * // In a Server Component
 * const token = await getWidgetToken({
 *   organizationId: session.organizationId,
 *   scopes: ['widgets:users-table:manage']
 * });
 * ```
 */
export async function getWidgetToken(options: GetWidgetTokenOptions): Promise<string> {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error('User must be authenticated to get widget token');
  }

  const tokenParams: {
    userId: string;
    scopes: string[];
    organizationId?: string;
  } = {
    userId: session.user.id,
    scopes: options.scopes,
  };

  if (options.organizationId) {
    tokenParams.organizationId = options.organizationId;
  }

  const token = await workos.widgets.getToken(tokenParams as any);

  return token;
}

/**
 * Get authorization URL for organization switching.
 * If the target org requires SSO or MFA, user needs to re-authenticate.
 */
export async function getOrganizationSwitchUrl(
  organizationId: string,
  redirectUri: string
): Promise<string | null> {
  const session = await getSession();
  
  if (!session?.user) {
    throw new Error('User must be authenticated');
  }

  // Check if the organization requires re-authentication
  try {
    const org = await workos.organizations.getOrganization(organizationId);
    
    // If org has SSO or MFA requirements, generate auth URL
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
