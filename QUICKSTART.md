# Quick Start Guide 🚀

## Step 1: Initialize Convex

Run this command to initialize your Convex backend:

```bash
npx convex dev
```

This will:
- Open your browser to create/link a Convex project
- Generate a deployment URL
- Create `.env.local` with `CONVEX_URL` and `NEXT_PUBLIC_CONVEX_URL`
- Generate TypeScript types

**Keep this terminal running!**

## Step 2: Verify Environment Variables

After running `npx convex dev`, check that `.env.local` was created with:

```bash
cat .env.local
```

You should see:
```env
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
```

Your `.env` file already has:
```env
WORKOS_CLIENT_ID=client_01KGVXFY8DKDBMEP1B4RR0NGEN
WORKOS_API_KEY=sk_01KGVXFY8DKDBMEP1B4RR0NGEN
WORKOS_REDIRECT_URI=http://localhost:3000/api/auth/callback
WORKOS_COOKIE_PASSWORD=complex_password_at_least_32_characters_long_change_this
```

## Step 3: Configure WorkOS

1. Go to [WorkOS Dashboard](https://dashboard.workos.com/)
2. Find your application
3. Add redirect URI: `http://localhost:3000/api/auth/callback`
4. **Important**: Make sure your Client ID and API Key in `.env` are correct

## Step 4: Generate Secure Cookie Password

Replace the placeholder cookie password in `.env`:

```bash
# On macOS/Linux:
openssl rand -base64 32

# Or use any secure random string generator
```

Update `.env`:
```env
WORKOS_COOKIE_PASSWORD=your_generated_secure_password_here
```

## Step 5: Start the Development Server

In a **new terminal** (keep `npx convex dev` running):

```bash
bun dev
```

## Step 6: Test Authentication

1. Visit `http://localhost:3000`
2. Click "Sign In" or navigate to `http://localhost:3000/sign-in`
3. Click "Sign in with WorkOS"
4. You'll be redirected to WorkOS authentication
5. After signing in, you'll be redirected back to your dashboard

## Verify Everything Works

### Check Convex Dashboard
- Open https://dashboard.convex.dev
- Go to your project
- Click on "Data" tab
- You should see a `users` table with your user data after signing in

### Check Browser Console
- Open browser DevTools (F12)
- Check Console for any errors
- Network tab should show successful API calls

## Troubleshooting

### ❌ "Couldn't parse deployment name"
- Make sure you've run `npx convex dev` first
- Check that `.env.local` exists and has valid Convex URLs
- Don't have placeholder values uncommented in `.env`

### ❌ "You must provide a redirect URI"
- Check that `WORKOS_REDIRECT_URI` is set in `.env`
- Make sure the value matches what's in your WorkOS dashboard
- Restart your dev server after changing `.env`

### ❌ "Invalid redirect URI" from WorkOS
- Add `http://localhost:3000/api/auth/callback` to allowed redirect URIs in WorkOS dashboard
- Make sure there are no trailing slashes

### ❌ User not syncing to Convex
- Ensure `npx convex dev` is running
- Check browser console for errors
- Verify `NEXT_PUBLIC_CONVEX_URL` is set in `.env.local`

### ❌ Type errors in IDE
- Run `npx convex dev` to regenerate types
- Restart your TypeScript server in VS Code (Cmd+Shift+P → "TypeScript: Restart TS Server")

## What's Next?

Once authentication is working, you can:

1. **Customize user roles**: Edit [convex/tables/users.ts](convex/tables/users.ts)
2. **Add protected pages**: Use `getCurrentUser()` or `requireAuth()` from [src/lib/auth.ts](src/lib/auth.ts)
3. **Set up organizations**: Configure multi-tenancy in WorkOS
4. **Add more features**: Continue building your blueprint!

## File Structure Reference

```
├── .env                    # WorkOS config (committed to git)
├── .env.local              # Convex URLs (auto-generated, gitignored)
├── src/
│   ├── middleware.ts       # Route protection
│   ├── lib/auth.ts         # Server-side auth utils
│   ├── hooks/
│   │   └── use-sync-user.ts    # Client-side user sync
│   └── app/
│       ├── (auth)/sign-in/     # Login page
│       ├── dashboard/          # Protected routes
│       └── api/auth/           # Auth endpoints
└── convex/
    ├── schema.ts           # Database schema
    ├── tables/users.ts     # User table
    └── functions/users.ts  # User CRUD + sync
```

## Commands Reference

```bash
# Start Convex (Terminal 1)
npx convex dev

# Start Next.js (Terminal 2)
bun dev

# Type check
bun run typecheck

# Lint
bun run lint

# Format
bun run format
```

Happy coding! 🎉
