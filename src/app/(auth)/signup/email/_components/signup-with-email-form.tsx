'use client';

import { useActionState } from 'react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { signUp } from '../../../actions';

export function SignUpWithEmailForm(): React.ReactElement {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(
    async (_prevState: unknown, formData: FormData) => {
      const result = await signUp(formData);
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
        <Input
          autoComplete="new-password"
          id="password"
          name="password"
          placeholder="At least 8 characters"
          required
          type="password"
        />
      </div>

      {state?.error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{state.error}</div>}

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? 'Creating account...' : 'Sign up'}
      </Button>
    </form>
  );
}
