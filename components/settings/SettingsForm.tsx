'use client';

import { LogOut } from 'lucide-react';
import { User } from 'next-auth';
import { useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { updateAccount } from '@/lib/actions/account.action';
import { signOutAction } from '@/lib/actions/auth.action';
import { updateUser } from '@/lib/actions/user.action';

interface SettingsFormProps {
  user: User;
}

export function SettingsForm({ user }: SettingsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: user.name || '',
    email: user.email || '',
    username: user.username || '',
    isPrivate: user.isPrivate || false,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await updateUser({ userId: user.id || '', ...formData });

    if (result.success) {
      toast.success('Settings updated', {
        description: 'Your profile has been updated successfully.',
      });
      setIsEditing(false);
    } else {
      toast.error('Error', {
        description: result.error?.message,
      });
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Error', {
        description: "New passwords don't match",
      });
      return;
    }

    const result = await updateAccount({
      userId: user.id || '',
      oldPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    });

    if (result.success) {
      toast.success('Password updated', {
        description: 'Your password has been updated successfully.',
      });
      setIsChangingPassword(false);
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } else {
      toast.error('Error', {
        description: result.error?.message,
      });
    }
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Profile</CardTitle>
              <CardDescription>
                This is how others see you on the site.
              </CardDescription>
            </div>
            <Button
              variant={isEditing ? 'destructive' : 'outline'}
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          {isEditing ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="private"
                  checked={formData.isPrivate}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPrivate: checked })
                  }
                />
                <Label htmlFor="private">Private Account</Label>
              </div>
              <Button type="submit">Save Changes</Button>
            </form>
          ) : (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium">Name</label>
                <p className="text-sm text-muted-foreground">{user.name}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Username</label>
                <p className="text-sm text-muted-foreground">
                  {user.username || 'Not set'}
                </p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Account Privacy</label>
                <p className="text-sm text-muted-foreground">
                  {user.isPrivate ? 'Private' : 'Public'}
                </p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Security</CardTitle>
              <CardDescription>Manage your password</CardDescription>
            </div>
            <Button
              variant={isChangingPassword ? 'destructive' : 'outline'}
              onClick={() => setIsChangingPassword(!isChangingPassword)}
            >
              {isChangingPassword ? 'Cancel' : 'Change Password'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Separator />
          {isChangingPassword && (
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      currentPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      confirmPassword: e.target.value,
                    })
                  }
                />
              </div>
              <Button type="submit">Update Password</Button>
            </form>
          )}
        </CardContent>
      </Card>

      <Button variant="destructive" onClick={signOutAction}>
        <LogOut className="size-4" />
        Sign Out
      </Button>
    </div>
  );
}
