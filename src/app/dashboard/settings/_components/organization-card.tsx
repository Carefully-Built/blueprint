'use client';

import { Building2, Pencil, Upload } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';

function triggerOrgRefresh(): void {
  globalThis.dispatchEvent(new CustomEvent('org-updated'));
}

interface Organization {
  readonly id: string;
  readonly name: string;
  readonly role: string;
}

interface OrganizationCardProps {
  readonly organization: Organization;
}

// Extracted EditForm component
interface EditFormProps {
  readonly name: string;
  readonly setName: (name: string) => void;
  readonly logoPreview: string | null;
  readonly onLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

function EditForm({ name, setName, logoPreview, onLogoChange }: EditFormProps): React.ReactElement {
  return (
    <div className="space-y-6 py-4 px-4">
      <div className="space-y-2">
        <Label>Organization Logo</Label>
        <div className="flex items-center gap-4">
          <div className="relative size-20 rounded-lg border-2 border-dashed border-muted-foreground/25 flex items-center justify-center overflow-hidden bg-muted shrink-0">
            {logoPreview ? (
              <Image src={logoPreview} alt="Logo preview" fill className="object-cover" />
            ) : (
              <Upload className="size-8 text-muted-foreground" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <Input type="file" accept="image/*" onChange={onLogoChange} className="text-sm" />
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 2MB</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="orgName">Organization Name</Label>
        <Input id="orgName" value={name} onChange={(e) => setName(e.target.value)} />
      </div>
    </div>
  );
}

// Extracted SaveButton component
interface SaveButtonProps {
  readonly loading: boolean;
  readonly disabled: boolean;
  readonly onClick: () => void;
}

function SaveButton({ loading, disabled, onClick }: SaveButtonProps): React.ReactElement {
  return (
    <Button onClick={onClick} disabled={disabled} className="w-full">
      {loading ? 'Saving...' : 'Save Changes'}
    </Button>
  );
}

// Extracted OrganizationInfo component
interface OrganizationInfoProps {
  readonly name: string;
  readonly role: string;
  readonly logoPreview: string | null;
}

function OrganizationInfo({ name, role, logoPreview }: OrganizationInfoProps): React.ReactElement {
  return (
    <>
      <div className="relative size-14 rounded-lg border bg-muted flex items-center justify-center overflow-hidden shrink-0">
        {logoPreview ? (
          <Image src={logoPreview} alt="Logo" fill className="object-cover" />
        ) : (
          <Building2 className="size-6 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-base truncate">{name}</h3>
        <p className="text-sm text-muted-foreground capitalize">{role}</p>
      </div>
    </>
  );
}

export function OrganizationCard({ organization }: OrganizationCardProps): React.ReactElement {
  const router = useRouter();
  const isMobile = useIsMobile();
  const [name, setName] = useState(organization.name);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
        setIsOpen(false);
      })
      .catch(() => {
        toast.error('Failed to update organization');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleOpenChange = (open: boolean): void => {
    setIsOpen(open);
    if (open) {
      // Reset form state when opening
      setName(organization.name);
      setLogoPreview(null);
    }
  };

  // Use Drawer on mobile, Sheet on desktop
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={handleOpenChange}>
        <Card className="overflow-hidden py-0">
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              <OrganizationInfo name={organization.name} role={organization.role} logoPreview={logoPreview} />
              {isAdmin && (
                <DrawerTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-1.5">
                    <Pencil className="size-3.5" />
                    Edit
                  </Button>
                </DrawerTrigger>
              )}
            </div>
          </CardContent>
        </Card>

        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Edit Organization</DrawerTitle>
            <DrawerDescription>
              Update your organization details
            </DrawerDescription>
          </DrawerHeader>
          <EditForm
            name={name}
            setName={setName}
            logoPreview={logoPreview}
            onLogoChange={handleLogoChange}
          />
          <DrawerFooter>
            <SaveButton
              loading={loading}
              disabled={loading || name === organization.name}
              onClick={handleSave}
            />
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    );
  }

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <Card className="overflow-hidden py-0">
        <CardContent className="py-4">
          <div className="flex items-center gap-4">
            <OrganizationInfo name={organization.name} role={organization.role} logoPreview={logoPreview} />
            {isAdmin && (
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Pencil className="size-3.5" />
                  Edit
                </Button>
              </SheetTrigger>
            )}
          </div>
        </CardContent>
      </Card>

      <SheetContent side="right" className="p-0">
        <SheetHeader className="p-4 pb-0">
          <SheetTitle>Edit Organization</SheetTitle>
          <SheetDescription>
            Update your organization details
          </SheetDescription>
        </SheetHeader>
        <EditForm
          name={name}
          setName={setName}
          logoPreview={logoPreview}
          onLogoChange={handleLogoChange}
        />
        <SheetFooter className="p-4 pt-0">
          <SaveButton
            loading={loading}
            disabled={loading || name === organization.name}
            onClick={handleSave}
          />
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
