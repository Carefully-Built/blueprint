# WorkOS + Convex Authentication - Setup Complete! 🎉

## What's Been Set Up

✅ WorkOS AuthKit integration
✅ Convex database schema updated for WorkOS
✅ Authentication routes (login, callback, signout, user API)
✅ Middleware for route protection
✅ Automatic user synchronization with Convex
✅ Server and client utilities for authentication

## Next Steps to Get Running

### 1. Set Up WorkOS

1. **Create a WorkOS Account** (if you haven't already)
   - Go to [WorkOS Dashboard](https://dashboard.workos.com/)
   - Create a new application

2. **Update Your `.env` File**
   Replace the placeholder values:
   ```env
   # WorkOS Configuration
   WORKOS_CLIENT_ID=your_actual_client_id_from_workos
   WORKOS_API_KEY=your_actual_api_key_from_workos
   WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback
   WORKOS_COOKIE_PASSWORD=generate_a_32_character_random_string_here

   # Convex Configuration
   NEXT_PUBLIC_CONVEX_URL=will_be_generated_when_you_run_convex_dev
   CONVEX_DEPLOYMENT=will_be_generated_when_you_run_convex_dev
   ```

3. **Generate a Secure Cookie Password**
   ```bash
   # Generate a random 32-character string
   openssl rand -base64 32
   ```

### 2. Configure WorkOS Redirect URI

In your WorkOS Dashboard:
1. Go to your application settings
2. Add `http://localhost:3000/api/auth/callback` as an allowed redirect URI
3. For production, add your production URL callback as well

### 3. Start Convex Development Server

```bash
npx convex dev
```

This will:
- Initialize your Convex backend
- Generate the deployment URL (add to `.env` as `NEXT_PUBLIC_CONVEX_URL`)
- Regenerate TypeScript types (fixing the remaining type error)
- Sync your database schema

### 4. Start Your Next.js App

In a new terminal:
```bash
bun dev
```

## How It Works

### Authentication Flow

1. User visits `/sign-in`
2. Clicks "Sign in with WorkOS"
3. Gets redirected to WorkOS-hosted auth UI
4. After successful auth, returns to `/api/auth/callback`
5. Middleware protects `/dashboard/*` routes
6. User data automatically syncs to Convex when accessing dashboard

### File Structure

```
src/
├── app/
│   ├── (auth)/sign-in/        # Sign-in page
│   ├── dashboard/              # Protected dashboard
│   │   └── _components/
│   │       └── user-sync.tsx   # Auto-syncs user to Convex
│   └── api/auth/
│       ├── callback/           # OAuth callback
│       ├── login/              # Initiates sign-in
│       ├── signout/            # Signs user out
│       └── user/               # Returns current user
├── hooks/
│   └── use-sync-user.ts        # User sync hook
├── lib/
│   └── auth.ts                 # Server-side auth utils
└── middleware.ts               # Route protection

convex/
├── auth.config.ts              # Auth configuration
├── schema.ts                   # Database schema
├── tables/users.ts             # User table definition
└── functions/users.ts          # User CRUD + sync
```

### Using Authentication

#### Server Components
```typescript
import { getCurrentUser, requireAuth } from '@/lib/auth';

// Optional auth
export default async function Page() {
  const user = await getCurrentUser();
  if (!user) return <div>Not signed in</div>;
  return <div>Hello {user.firstName}</div>;
}

// Required auth (throws if not authenticated)
export default async function ProtectedPage() {
  const user = await requireAuth();
  return <div>Hello {user.firstName}</div>;
}
```

#### Client Components
```typescript
'use client';

import { useSyncUser } from '@/hooks/use-sync-user';

export function MyComponent() {
  const { user } = useSyncUser();

  if (!user) return <div>Loading...</div>;
  return <div>Hello {user.firstName}</div>;
}
```

#### Sign Out Button
```typescript
export function SignOutButton() {
  return (
    <a href="/api/auth/signout">
      <Button>Sign Out</Button>
    </a>
  );
}
```

## Database Schema

### Users Table
```typescript
{
  workosId: string,           // WorkOS user ID
  email: string,
  name?: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  organizationId?: string,    // For multi-tenancy
  role: 'admin' | 'member' | 'viewer',
  createdAt: number,
  updatedAt: number,
}
```

Indexes:
- `by_workos_id`: Fast lookup by WorkOS ID
- `by_email`: Fast lookup by email
- `by_organization`: Multi-tenant queries

## Testing the Setup

1. Start both Convex and Next.js servers
2. Visit `http://localhost:3000`
3. Navigate to `/sign-in`
4. Click "Sign in with WorkOS"
5. Complete the WorkOS authentication
6. You should be redirected to `/dashboard`
7. Check your Convex dashboard to see the user created

## Troubleshooting

### "Cannot find module '@workos-inc/authkit-nextjs'"
Run: `bun install`

### Type errors in Convex functions
Make sure `npx convex dev` is running to regenerate types

### Redirect URI mismatch
Ensure the redirect URI in WorkOS dashboard matches your `.env` file

### User not syncing to Convex
- Check that `NEXT_PUBLIC_CONVEX_URL` is set
- Verify Convex dev server is running
- Check browser console for errors

## Next: Multi-Tenancy (Optional)

To enable organizations:
1. Set up organizations in WorkOS dashboard
2. Users will automatically get `organizationId` from WorkOS
3. Filter queries by organization:
   ```typescript
   const orgUsers = await ctx.db
     .query('users')
     .withIndex('by_organization', (q) =>
       q.eq('organizationId', orgId)
     )
     .collect();
   ```

## Resources

- [WorkOS Documentation](https://workos.com/docs)
- [Convex Documentation](https://docs.convex.dev)
- [Full Setup Guide](./docs/AUTH_SETUP.md)

Happy coding! 🚀
