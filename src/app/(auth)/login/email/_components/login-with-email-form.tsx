'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signIn } from '../../../actions';

export function LoginWithEmailForm(): React.ReactElement {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await signIn(formData);
      if (result.success) {
        router.push('/dashboard');
        return result;
      }
      return result;
    },
    { success: false, error: undefined }
  );

  return (
    <form action={formAction} className="space-y-3">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          autoComplete="email"
          id="email"
          name="email"
          placeholder="you@example.com"
          required
          type="email"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input autoComplete="current-password" id="password" name="password" required type="password" />
        <div className="flex justify-end">
          <Link className="text-sm underline-offset-4 hover:underline" href="/forgot-password">
            Forgot password?
          </Link>
        </div>
      </div>

      {state?.error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.error}</div>}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? 'Logging in...' : 'Log in'}
      </Button>
    </form>
  );
}
