# WorkOS + Convex Authentication Setup

This document describes the authentication setup using WorkOS AuthKit and Convex.

## Overview

The application uses:
- **WorkOS AuthKit** for authentication and user management
- **Convex** as the backend database
- **Next.js App Router** for the frontend

## Environment Variables

Add these to your `.env` file:

```env
# WorkOS Configuration
WORKOS_CLIENT_ID=your_workos_client_id
WORKOS_API_KEY=your_workos_api_key
WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback
WORKOS_COOKIE_PASSWORD=complex_password_at_least_32_characters_long

# Convex Configuration
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
CONVEX_DEPLOYMENT=your_convex_deployment_name
```

### Getting WorkOS Credentials

1. Sign up at [WorkOS Dashboard](https://dashboard.workos.com/)
2. Create a new application
3. Copy your `WORKOS_CLIENT_ID` and `WORKOS_API_KEY`
4. Set up your redirect URI to `http://localhost:3000/api/auth/callback`
5. Generate a secure cookie password (minimum 32 characters)

### Getting Convex URL

1. Run `npx convex dev` to start the Convex development server
2. Copy the deployment URL provided
3. Add it to your `.env` file

## Architecture

### Authentication Flow

1. User visits `/sign-in`
2. WorkOS AuthKit handles the authentication UI
3. After successful auth, user is redirected to `/api/auth/callback`
4. Middleware protects dashboard routes
5. `UserSync` component syncs user data to Convex on dashboard access

### File Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── sign-in/           # Sign-in page with WorkOS AuthKit
│   ├── dashboard/
│   │   ├── layout.tsx         # Includes UserSync component
│   │   └── _components/
│   │       └── user-sync.tsx  # Syncs WorkOS user to Convex
│   └── api/
│       └── auth/
│           ├── callback/      # OAuth callback handler
│           └── signout/       # Sign-out handler
├── hooks/
│   └── use-sync-user.ts       # Hook to sync user data
├── lib/
│   └── auth.ts                # Server-side auth utilities
├── middleware.ts              # Route protection
└── providers/
    └── convex-provider.tsx    # Convex with WorkOS integration

convex/
├── auth.config.ts             # Convex auth configuration
├── schema.ts                  # Database schema
├── tables/
│   └── users.ts               # User table definition
└── functions/
    └── users.ts               # User CRUD operations
```

## Usage

### Protecting Routes

Routes under `/dashboard` are automatically protected by middleware.

### Server Components

```typescript
import { getCurrentUser, requireAuth } from '@/lib/auth';

// Optional auth
export default async function Page() {
  const user = await getCurrentUser();
  if (!user) {
    return <div>Please sign in</div>;
  }
  return <div>Hello {user.firstName}</div>;
}

// Required auth (throws error if not authenticated)
export default async function ProtectedPage() {
  const user = await requireAuth();
  return <div>Hello {user.firstName}</div>;
}
```

### Client Components

```typescript
'use client';

import { useUser } from '@workos-inc/authkit-nextjs';

export function MyComponent() {
  const { user, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return <div>Hello {user.firstName}</div>;
}
```

### Accessing User Data in Convex

```typescript
import { useMutation, useQuery } from 'convex/react';
import { api } from '@/../convex/_generated/api';

export function MyComponent() {
  // Get current user from Convex
  const user = useQuery(api.functions.users.getByWorkosId, {
    workosId: 'user_123',
  });

  return <div>{user?.name}</div>;
}
```

### Sign Out

```typescript
import { SignOut } from '@workos-inc/authkit-nextjs';

export function LogoutButton() {
  return <SignOut />;
}

// Or use a custom button
export function CustomLogoutButton() {
  return (
    <a href="/api/auth/signout">
      <Button>Sign Out</Button>
    </a>
  );
}
```

## User Sync

User data is automatically synced from WorkOS to Convex when:
1. User accesses the dashboard
2. User data is updated in WorkOS

The sync includes:
- WorkOS user ID
- Email
- First name
- Last name
- Profile picture URL
- Organization ID
- Role (default: member)

## Database Schema

### Users Table

```typescript
{
  workosId: string,
  email: string,
  name?: string,
  firstName?: string,
  lastName?: string,
  imageUrl?: string,
  organizationId?: string,
  role: 'admin' | 'member' | 'viewer',
  createdAt: number,
  updatedAt: number,
}
```

### Indexes

- `by_workos_id`: Fast lookup by WorkOS user ID
- `by_email`: Fast lookup by email
- `by_organization`: Fast lookup by organization

## Multi-tenant Support

WorkOS supports multi-tenant applications out of the box:

1. Organizations are managed in WorkOS
2. Users are associated with organizations via `organizationId`
3. Filter queries by organization:

```typescript
const orgUsers = await ctx.db
  .query('users')
  .withIndex('by_organization', (q) =>
    q.eq('organizationId', organizationId)
  )
  .collect();
```

## Next Steps

- Configure WorkOS organization settings
- Customize user roles and permissions
- Add role-based access control (RBAC)
- Set up WorkOS webhooks for user events
- Implement organization switching UI
