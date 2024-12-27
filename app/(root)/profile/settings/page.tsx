import { redirect } from 'next/navigation';

import { auth } from '@/auth';
import { SettingsForm } from '@/components/settings/SettingsForm';

export default async function SettingsPage() {
  const session = await auth();

  // Middleware already protects this route
  if (!session || !session.user) {
    redirect('/sign-in');
  }

  return (
    <div className="container py-10">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account settings and preferences.
          </p>
        </div>
        <SettingsForm user={session.user} />
      </div>
    </div>
  );
}
