'use client';

import { Mail, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { IWaitlistDoc } from '@/database/waitlist.model';
import {
  getWaitlists,
  sendWaitlistEmails,
} from '@/lib/actions/waitlist.action';

export default function WaitlistAdmin() {
  const [waitlist, setWaitlist] = useState<IWaitlistDoc[]>([]);
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [notifying, setNotifying] = useState(false);

  const loadWaitlist = async () => {
    setLoading(true);
    try {
      const response = await getWaitlists();

      if (response.success && response.data) {
        setWaitlist(response.data);
      } else {
        toast.error('Error', {
          description: 'Failed to load waitlist',
        });
      }
    } catch {
      toast.error('Error', {
        description: 'Failed to load waitlist',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWaitlist();
  }, []);

  const handleSelectAll = () => {
    if (selectedEmails.length === waitlist.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(waitlist.map((entry) => entry.email));
    }
  };

  const handleSelect = (email: string) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter((e) => e !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleNotifySelected = async () => {
    if (selectedEmails.length === 0) return;

    setNotifying(true);
    try {
      const response = await sendWaitlistEmails({ emails: selectedEmails });

      if (response.success) {
        toast('Success', {
          description: `Notified ${selectedEmails.length} subscribers`,
        });
        loadWaitlist(); // Refresh the list
        setSelectedEmails([]); // Clear selection
      } else {
        throw new Error('Failed to notify subscribers');
      }
    } catch {
      toast.error('Error', {
        description: 'Failed to send notifications',
      });
    } finally {
      setNotifying(false);
    }
  };

  return (
    <div className="flex justify-center py-10">
      <div className="w-full max-w-7xl">
        <Card className="space-y-8">
          <CardHeader>
            <CardTitle>Waitlist Management</CardTitle>
            <CardDescription>
              Manage and notify waitlist subscribers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={selectedEmails.length === waitlist.length}
                  onCheckedChange={handleSelectAll}
                />
                <span className="text-sm text-muted-foreground">
                  {selectedEmails.length} selected
                </span>
              </div>
              <Button
                onClick={handleNotifySelected}
                disabled={selectedEmails.length === 0 || notifying}
              >
                {notifying ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Mail className="mr-2 size-4" />
                )}
                Notify Selected
              </Button>
            </div>

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Verified</TableHead>
                    <TableHead>Last Verified</TableHead>
                    <TableHead>Last Notified</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-8 text-center">
                        <Loader2 className="mx-auto size-6 animate-spin" />
                      </TableCell>
                    </TableRow>
                  ) : (
                    waitlist.map((entry) => (
                      <TableRow key={entry._id as string}>
                        <TableCell>
                          <Checkbox
                            checked={selectedEmails.includes(entry.email)}
                            onCheckedChange={() => handleSelect(entry.email)}
                          />
                        </TableCell>
                        <TableCell>{entry.name || '-'}</TableCell>
                        <TableCell>{entry.email}</TableCell>
                        <TableCell>{entry.status}</TableCell>
                        <TableCell>
                          {entry.verified ? 'True' : 'False'}
                        </TableCell>
                        <TableCell>
                          {entry.verifiedAt
                            ? new Date(entry.verifiedAt).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                        <TableCell>
                          {entry.lastNotifiedAt
                            ? new Date(
                                entry.lastNotifiedAt
                              ).toLocaleDateString()
                            : 'Never'}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
