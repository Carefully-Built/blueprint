import { workos } from './workos';
import { getSession } from './session';

/**
 * Available widget scopes from WorkOS SDK
 */
export type WidgetScopes = 
  | 'widgets:users-table:manage'
  | 'widgets:sso:manage'
  | 'widgets:domain-verification:manage'
  | 'widgets:api-keys:manage';

interface GetWidgetTokenOptions {
  /** Organization ID (required for WorkOS widgets) */
  organizationId: string;
  /** Required scopes for the widget */
  scopes: WidgetScopes[];
}

/**
 * Get a widget token for WorkOS widgets.
 * Must be called server-side (Server Component, Server Action, or API Route).
 * 
 * Note: organizationId is required. Use the current user's organization.
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

  const result = await workos.widgets.getToken({
    organizationId: options.organizationId,
    userId: session.user.id,
    scopes: options.scopes,
  });

  // WorkOS SDK returns the token directly as a string
  return result as unknown as string;
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
