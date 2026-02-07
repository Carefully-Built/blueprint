'use client';

import { Building2, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function NoOrgView(): React.ReactElement {
  const router = useRouter();
  const [name, setName] = useState('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = (): void => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.SyntheticEvent): void => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    void fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const data = (await response.json()) as { error?: string };
          throw new Error(data.error ?? 'Failed to create organization');
        }
        router.refresh();
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : 'Something went wrong');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10">
          <Building2 className="size-6 text-primary" />
        </div>
        <CardTitle>Create Your Organization</CardTitle>
        <CardDescription>
          Set up your organization to start inviting team members.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Organization Logo</Label>
            <div className="flex items-center gap-4">
              <div className="relative size-16 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden">
                {logoPreview ? (
                  <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
                ) : (
                  <Upload className="size-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <Input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Organization Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Acme Inc."
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" className="w-full" disabled={loading || !name.trim()}>
            {loading ? 'Creating...' : 'Create Organization'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
