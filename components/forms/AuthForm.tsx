'use client';

import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { z, ZodType } from 'zod';
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { ROUTES } from '@/constants/routes';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Link from 'next/link';
import { toast } from 'sonner';

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: 'SIGN_IN' | 'SIGN_UP';
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
}: AuthFormProps<T>) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues as DefaultValues<T>,
  });

  const handleSubmit: SubmitHandler<T> = async (data) => {
    const result = (await onSubmit(data)) as ActionResponse;

    if (result?.success) {
      toast.success('Success', {
        description:
          formType === 'SIGN_IN'
            ? 'Signed in successfully'
            : 'Signed up successfully',
      });

      router.push(ROUTES.HOME);
    } else {
      toast.error(`Error ${result?.status}`, {
        description: result?.error?.message,
      });
    }
  };

  const buttonText = formType === 'SIGN_IN' ? 'Sign In' : 'Sign Up';

  return (
    <div className="container py-10">
      <div className="mx-auto max-w-md space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold">
            {formType === 'SIGN_IN' ? 'Welcome Back' : 'Create Your Account'}
          </h1>
          <p className="text-muted-foreground">
            {formType === 'SIGN_IN'
              ? 'Sign in to continue your fragrance journey'
              : 'Start your fragrance journey today'}
          </p>
        </div>

        <Card className="p-6 border-none">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              {Object.keys(defaultValues).map((field) => (
                <FormField
                  key={field}
                  control={form.control}
                  name={field as Path<T>}
                  render={({ field }) => (
                    <FormItem className="flex w-full flex-col gap-2.5">
                      <FormLabel className="paragraph-medium">
                        {field.name === 'email'
                          ? 'Email Address'
                          : field.name.charAt(0).toUpperCase() +
                            field.name.slice(1)}
                      </FormLabel>
                      <FormControl>
                        <Input
                          required
                          type={field.name === 'password' ? 'password' : 'text'}
                          {...field}
                          className="min-h-12 rounded-1.5 border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
              <div className="space-y-2">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting && (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  )}
                  {buttonText}
                </Button>
                {formType === 'SIGN_UP' && (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                    onClick={() => router.push('/register')}
                  >
                    Create Account
                  </Button>
                )}
              </div>

              {formType === 'SIGN_IN' ? (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Don&apos;t have an account?{' '}
                  <Link
                    href={ROUTES.SIGN_UP}
                    className="text-primary hover:underline"
                  >
                    Sign up
                  </Link>
                </p>
              ) : (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Already have an account?{' '}
                  <Link
                    href={ROUTES.SIGN_IN}
                    className="text-primary hover:underline"
                  >
                    Sign in
                  </Link>
                </p>
              )}
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;
