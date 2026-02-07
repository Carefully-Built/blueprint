# Development Guidelines

## Core Principles

### 1. File Size Limit
- **Maximum 100 lines per file**
- If a file exceeds 100 lines, split it into smaller, focused modules
- Exception: Generated files, type definitions

### 2. Separation of Concerns
- **UI components** in `_components/` directories
- **Business logic** in `hooks/` or `lib/`
- **Types** in `types/` directory
- **API routes** handle only HTTP concerns, delegate to lib functions

### 3. Single Responsibility Principle
- Each function does ONE thing
- Each component renders ONE concern
- Each file has ONE purpose

### 4. Naming Conventions
```
Components:     PascalCase.tsx     (UserProfile.tsx)
Hooks:          use-kebab-case.ts  (use-items.ts)
Utilities:      kebab-case.ts      (format-date.ts)
Types:          kebab-case.ts      (user.ts)
API routes:     route.ts           (standard Next.js)
```

### 5. Import Order
1. React/Next.js
2. External libraries
3. Internal aliases (@/)
4. Relative imports
5. Types (last)

### 6. TypeScript Rules
- **Explicit return types** on all functions
- **No `any`** - use proper types or `unknown`
- **No non-null assertions** (`!`) - handle nulls properly
- **No unused variables** - remove or use `_` prefix

## Convex Best Practices

### Use Native Hooks
```typescript
// ✅ Correct - use convex/react
import { useQuery, useMutation } from 'convex/react';
import { api } from '@convex/_generated/api';

const items = useQuery(api.items.list, { organizationId });
const createItem = useMutation(api.items.create);

// ❌ Wrong - don't use TanStack Query with Convex
import { useQuery } from '@tanstack/react-query';
```

### Organization-Scoped Data
```typescript
// All queries/mutations should include organizationId
export const list = query({
  args: { organizationId: v.string() },
  handler: async (ctx, { organizationId }) => {
    return ctx.db
      .query('items')
      .withIndex('by_organization', (q) => q.eq('organizationId', organizationId))
      .collect();
  },
});
```

## Component Patterns

### Use WorkOS Components
```typescript
// ✅ Use WorkOS built-in components
import { OrganizationSwitcher } from '@workos-inc/authkit-nextjs/components';

// ❌ Don't rebuild what WorkOS provides
```

### Hooks Pattern
```typescript
// src/hooks/use-items.ts
export function useItems(organizationId: string) {
  const items = useQuery(api.items.list, { organizationId });
  const create = useMutation(api.items.create);
  const update = useMutation(api.items.update);
  const remove = useMutation(api.items.remove);

  return {
    items,
    isLoading: items === undefined,
    create,
    update,
    remove,
  };
}
```

## Pre-Commit Checklist

- [ ] File under 100 lines?
- [ ] ESLint passes (`npm run lint`)?
- [ ] TypeScript compiles (`npm run build`)?
- [ ] Tested in browser?
- [ ] No console.log (use console.warn/error only)?
- [ ] Proper error handling?
- [ ] Organization-scoped data access?

## Testing Before Done

1. Run `npm run lint`
2. Run `npm run build`
3. Test in browser:
   - Sign in/up flow
   - Organization creation (if no org)
   - Organization switching (if multiple orgs)
   - CRUD operations (items page)
   - Settings pages

## File Structure

```
src/
├── app/                    # Next.js app router
│   ├── (auth)/            # Auth routes (sign-in, signup, etc.)
│   ├── (landing)/         # Public pages
│   ├── dashboard/         # Protected dashboard
│   │   ├── _components/   # Dashboard-specific components
│   │   ├── items/         # Items CRUD page
│   │   └── settings/      # Settings pages
│   └── api/               # API routes
├── components/            # Shared UI components
│   └── ui/               # shadcn/ui components
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── types/                 # TypeScript types
└── providers/            # React context providers
```
