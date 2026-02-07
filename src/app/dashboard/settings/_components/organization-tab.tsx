'use client';

import { Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

function triggerOrgRefresh(): void {
  window.dispatchEvent(new CustomEvent('org-updated'));
}

interface OrganizationTabProps {
  organization: {
    id: string;
    name: string;
    role: string;
  };
}

export function OrganizationTab({ organization }: OrganizationTabProps): React.ReactElement {
  const router = useRouter();
  const [name, setName] = useState(organization.name);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isAdmin = organization.role === 'admin';

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

  const handleSave = (): void => {
    if (!isAdmin) {
      toast.error('Only admins can update organization settings');
      return;
    }

    setLoading(true);
    fetch(`/api/organizations/${organization.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update organization');
        }
        toast.success('Organization updated');
        triggerOrgRefresh();
        router.refresh();
      })
      .catch(() => {
        toast.error('Failed to update organization');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Organization Settings</CardTitle>
        <CardDescription>
          {isAdmin ? 'Manage your organization details' : 'View your organization details'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Organization Logo</Label>
          <div className="flex items-center gap-4">
            <div className="relative size-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted">
              {logoPreview ? (
                <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
              ) : (
                <Upload className="size-8 text-muted-foreground" />
              )}
            </div>
            {isAdmin && (
              <div className="flex-1">
                <Input type="file" accept="image/*" onChange={handleLogoChange} className="text-sm" />
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgName">Organization Name</Label>
          <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} disabled={!isAdmin} />
        </div>

        <div className="space-y-2">
          <Label>Your Role</Label>
          <p className="text-sm text-muted-foreground capitalize">{organization.role}</p>
        </div>

        {isAdmin && (
          <Button onClick={handleSave} disabled={loading || name === organization.name}>
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
