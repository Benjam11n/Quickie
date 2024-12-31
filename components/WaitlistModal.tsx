'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWaitlistStore } from '@/hooks/stores/use-waitlist-store';
import { createWaitlist } from '@/lib/actions/waitlist.action';

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  name: z.string().min(2, 'Name must be at least 2 characters').max(50),
});

export function WaitlistModal() {
  const [isOpen, setIsOpen] = useState(false);
  const { shouldShowWaitlist, setHasSeenWaitlist, setLastShown, setEmail } =
    useWaitlistStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: '',
    },
  });

  useEffect(() => {
    // Show modal after a short delay for better UX
    const timer = setTimeout(() => {
      if (shouldShowWaitlist()) {
        setIsOpen(true);
        setLastShown(Date.now());
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [shouldShowWaitlist, setLastShown]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const response = await createWaitlist(values);

      if (!response.success) {
        throw new Error(
          typeof response.error === 'string'
            ? response.error
            : 'Failed to join waitlist'
        );
      }

      setEmail(values.email);
      setHasSeenWaitlist(true);
      setIsOpen(false);

      toast('Welcome to the waitlist!', {
        description:
          "We'll notify you when we launch. Keep an eye on your inbox!",
      });
    } catch (error) {
      toast.error('Oops! Something went wrong', {
        description:
          error instanceof Error ? error.message : 'Please try again later.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setHasSeenWaitlist(true);
    setLastShown(Date.now());
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-3xl">
            Join Our Exclusive Waitlist
          </DialogTitle>
          <DialogDescription className="text-sm">
            Be among the first to experience our vending machines when we
            launch.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Your name"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Enter your email"
                      type="email"
                      {...field}
                      className="h-12"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button
                type="submit"
                variant="premium"
                className="h-10 w-full"
                disabled={isSubmitting}
              >
                {isSubmitting && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}
                Join Waitlist
              </Button>
              <Button
                type="button"
                variant="outline"
                className="h-10"
                onClick={handleClose}
              >
                Maybe Later
              </Button>
            </div>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          By joining, you agree to receive updates about our launch and
          exclusive offers.
        </p>
      </DialogContent>
    </Dialog>
  );
}
