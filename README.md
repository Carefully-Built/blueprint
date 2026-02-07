# Blueprint

Production-ready Next.js dashboard template with strict TypeScript, modern tooling, and beautiful UI.

## Stack

- **Framework**: Next.js 15 (App Router, Turbopack)
- **Runtime**: Bun
- **Styling**: Tailwind CSS 4 + shadcn/ui (Nova theme)
- **Database**: Convex (real-time)
- **Auth**: WorkOS + Clerk (multi-tenant)
- **Payments**: Stripe
- **Validation**: Zod
- **Icons**: Hugeicons

## Getting Started

```bash
bun install
bun dev
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun dev` | Start dev server with Turbopack |
| `bun build` | Production build |
| `bun lint` | ESLint (strict, zero warnings) |
| `bun typecheck` | TypeScript check |
| `bun check` | Run typecheck + lint |
| `bun format` | Format with Prettier |

## Project Structure

```
├── app
│   ├── (landing)/       # Public pages
│   ├── (dashboard)/     # Authenticated dashboard
│   ├── (auth)/          # Auth pages
│   └── api/             # API routes
├── components
│   ├── ui/              # shadcn components
│   ├── layout/          # Layout components
│   ├── forms/           # Form system
│   └── shared/          # Shared components
├── convex
│   └── schema/          # Modular schema files
├── lib/                 # Utilities
├── hooks/               # Custom hooks
├── types/               # TypeScript types
└── config/              # App configuration
```

## Code Standards

- **Zero `any`**: Strict TypeScript, no exceptions
- **Airbnb ESLint**: Enforced with additional strict rules
- **Max 120 lines**: Keep components focused
- **Type imports**: Always use `import type` for types

## Environment Variables

```env
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CONVEX_URL=
WORKOS_API_KEY=
WORKOS_CLIENT_ID=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
```

## License

MIT
