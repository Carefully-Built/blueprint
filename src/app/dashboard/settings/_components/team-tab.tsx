'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UserPlus, Mail, Trash2, AlertCircle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface Member {
  id: string;
  email: string;
  name?: string;
  role: string;
  imageUrl?: string;
}

interface TeamTabProps {
  organizationId: string;
}

export function TeamTab({ organizationId }: TeamTabProps) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('member');
  const [inviting, setInviting] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, [organizationId]);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/organizations/${organizationId}/members`);
      if (response.ok) {
        const data = await response.json();
        setMembers(data.members || []);
        setError(null);
      } else {
        setError('Failed to load team members');
      }
    } catch (err) {
      setError('Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail.trim()) return;

    setInviting(true);
    try {
      const response = await fetch(`/api/organizations/${organizationId}/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: inviteEmail, role: inviteRole }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to send invite');
      }

      toast.success(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      setInviteOpen(false);
      fetchMembers();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const handleRemove = async (memberId: string, memberName: string) => {
    if (!confirm(`Remove ${memberName} from the organization?`)) return;
    
    try {
      const response = await fetch(`/api/organizations/${organizationId}/members/${memberId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove member');
      }

      toast.success('Member removed');
      fetchMembers();
    } catch (err) {
      toast.error('Failed to remove member');
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <div>
          <CardTitle className="text-base font-medium">Team Members</CardTitle>
          <CardDescription className="text-sm">
            Invite and manage your team
          </CardDescription>
        </div>
        <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="mr-2 size-4" />
              Invite
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your organization
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setInviteOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleInvite} disabled={inviting || !inviteEmail.trim()}>
                {inviting ? 'Sending...' : 'Send Invite'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading...</p>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : members.length === 0 ? (
          <div className="text-center py-6">
            <Mail className="mx-auto size-10 text-muted-foreground/50" />
            <p className="mt-2 text-sm text-muted-foreground">No team members yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {members.map((member) => (
              <div key={member.id} className="flex items-center justify-between py-2 px-2 rounded-md hover:bg-muted/50">
                <div className="flex items-center gap-3">
                  <Avatar className="size-8">
                    <AvatarImage src={member.imageUrl} />
                    <AvatarFallback className="text-xs">
                      {member.name?.charAt(0) || member.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name || member.email}</p>
                    {member.name && <p className="text-xs text-muted-foreground">{member.email}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground capitalize px-2 py-0.5 bg-muted rounded">
                    {member.role}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-7"
                    onClick={() => handleRemove(member.id, member.name || member.email)}
                  >
                    <Trash2 className="size-3.5 text-muted-foreground hover:text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
