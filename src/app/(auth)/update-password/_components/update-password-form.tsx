'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

import { resetPassword } from '../../actions';

export function UpdatePasswordForm(): React.ReactElement {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError(undefined);

    if (password !== confirmPassword) {
      setError("Passwords don't match");
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Invalid reset token');
      setLoading(false);
      return;
    }

    const result = await resetPassword(token, password);

    if (result.success) {
      router.push('/login/email?reset=success');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <form className="space-y-4" onSubmit={(e): void => { void handleSubmit(e); }}>
      <div className="space-y-2">
        <Label htmlFor="password">New password</Label>
        <Input
          autoComplete="new-password"
          id="password"
          placeholder="At least 8 characters"
          required
          type="password"
          value={password}
          onChange={(e): void => {
            setPassword(e.target.value);
          }}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input
          autoComplete="new-password"
          id="confirmPassword"
          placeholder="Re-enter your password"
          required
          type="password"
          value={confirmPassword}
          onChange={(e): void => {
            setConfirmPassword(e.target.value);
          }}
        />
      </div>

      {error && <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">{error}</div>}

      <Button className="w-full" disabled={loading} type="submit">
        {loading ? 'Updating...' : 'Update password'}
      </Button>
    </form>
  );
}
