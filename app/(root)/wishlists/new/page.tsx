'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ROUTES } from '@/constants/routes';
import { useWishlistMutations } from '@/hooks/mutations/use-wishlist-mutations';

const WishlistNewSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof WishlistNewSchema>;

export default function NewWishlistPage() {
  const router = useRouter();
  const { createWishlistMutation } = useWishlistMutations();

  const form = useForm<FormValues>({
    resolver: zodResolver(WishlistNewSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    await createWishlistMutation.mutateAsync(data, {
      onSuccess: (response) => {
        router.replace(ROUTES.WISHLISTS_VIEW(response._id));
      },
    });
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="holographic-text">Create New Wishlist</span>
          </h1>
        </div>

        <Card className="p-6">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-6"
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wishlist Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Wishlist..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="A collection of fresh and vibrant scents..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                >
                  Cancel
                </Button>
                <Button type="submit">Create Wishlist</Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
