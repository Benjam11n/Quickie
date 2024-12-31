'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { createWaitlist } from '@/lib/actions/waitlist.action';

import { Button } from './ui/button';
import { Form, FormControl, FormField, FormItem, FormMessage } from './ui/form';
import { Input } from './ui/input';

// todo: this is supposed to be a newsletter sign up but
// it is used as a waitlist sign up for now.

const formSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const NewsletterForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
    },
  });

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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="max-w-[220px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" variant="premium" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
          Subscribe
        </Button>
      </form>
    </Form>
  );
};

export default NewsletterForm;
