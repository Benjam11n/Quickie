'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
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
import { createMoodBoard } from '@/lib/actions/moodboard.action';
import { MoodBoard } from '@/types/models/moodboard';

const MoodboardNewSchema = z.object({
  name: z.string().min(1, { message: 'Name is required' }),
  description: z.string().optional(),
});

type FormValues = z.infer<typeof MoodboardNewSchema>;

export default function CreateBoardPage() {
  const router = useRouter();

  const form = useForm<FormValues>({
    resolver: zodResolver(MoodboardNewSchema),
    defaultValues: {
      name: '',
      description: '',
    },
  });

  const handleSubmit = async (data: FormValues) => {
    try {
      const result = (await createMoodBoard({
        name: data.name,
        description: data.description,
        tags: [],
        isPublic: false,
      })) as ActionResponse<MoodBoard>;

      if (result.success && result.data) {
        toast.success('Success', {
          description: 'Moodboard created successfully',
        });
        router.push(ROUTES.BOARDS_EDIT(result.data._id));
      } else {
        if (result.error?.details) {
          Object.entries(result.error.details).forEach(([field, errors]) => {
            form.setError(field as keyof FormValues, {
              message: errors[0],
            });
          });
        }

        toast.error('Error', {
          description: result.error?.message || 'Failed to create board.',
        });
      }
    } catch (error) {
      toast.error('Error', {
        description: (error as Error)?.message || 'Something went wrong.',
      });
    }
  };

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="size-4" />
          </Button>
          <h1 className="text-3xl font-bold">
            <span className="holographic-text">Create New Board</span>
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
                    <FormLabel>Board Name</FormLabel>
                    <FormControl>
                      <Input placeholder="My Summer Fragrances..." {...field} />
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
                <Button type="submit">Create Board</Button>
              </div>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
}
