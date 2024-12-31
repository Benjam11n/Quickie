'use client';

import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/constants/routes';
import { resendVerification, verifyEmail } from '@/lib/actions/waitlist.action';

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading'
  );
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const verify = async () => {
      const token = searchParams.get('token');
      const email = searchParams.get('email');

      if (!token || !email) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      const result = await verifyEmail({ token, email });

      if (result.success) {
        setStatus('success');
        setMessage(result.message || '');
      } else {
        setStatus('error');
        setMessage(
          typeof result.error === 'string'
            ? result.error
            : 'Verification failed'
        );
      }
    };

    verify();
  }, [searchParams]);

  const handleResend = async () => {
    const email = searchParams.get('email');
    if (!email) return;

    setIsResending(true);
    try {
      const result = await resendVerification({ email });
      if (result.success) {
        setMessage('New verification email sent. Please check your inbox.');
      } else {
        setMessage(
          typeof result.error === 'string'
            ? result.error
            : 'Failed to resend verification email'
        );
      }
    } catch {
      setMessage('Failed to resend verification email');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex justify-center py-16">
      <div className="w-full max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {status === 'loading' ? (
              <div className="flex justify-center py-8">
                <Loader2 className="size-8 animate-spin" />
              </div>
            ) : (
              <>
                <p
                  className={
                    status === 'error' ? 'text-destructive' : 'text-green-600'
                  }
                >
                  {message}
                </p>

                {status === 'error' ? (
                  <Button
                    onClick={handleResend}
                    disabled={isResending}
                    className="w-full"
                  >
                    {isResending && (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    )}
                    Resend Verification Email
                  </Button>
                ) : (
                  <>
                    <Button
                      disabled={isResending}
                      variant="outline"
                      className="w-full"
                    >
                      <Link href={ROUTES.HOME}>Continue to Quickie</Link>
                    </Button>
                  </>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
