'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  DefaultValues,
  FieldValues,
  Path,
  SubmitHandler,
  useForm,
} from 'react-hook-form';
import { toast } from 'sonner';
import { z, ZodType } from 'zod';

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
import { ROUTES } from '@/constants/routes';

interface AuthFormProps<T extends FieldValues> {
  schema: ZodType<T>;
  defaultValues: T;
  onSubmit: (data: T) => Promise<ActionResponse>;
  formType: 'SIGN_IN' | 'SIGN_UP';
  onSuccess?: () => void;
}

const AuthForm = <T extends FieldValues>({
  schema,
  defaultValues,
  formType,
  onSubmit,
  onSuccess,
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
      onSuccess?.();

      router.push(ROUTES.HOME);
    } else {
      toast.error(`Error ${result?.status}`, {
        description: result?.error?.message,
      });
    }
  };

  const buttonText = formType === 'SIGN_IN' ? 'Sign In' : 'Sign Up';

  return (
    <div className="container pb-4">
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

        <Card className="border-none p-6">
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
                          className="min-h-12 rounded-md border"
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

                <Button
                  variant="outline"
                  className="w-full"
                  disabled={form.formState.isSubmitting}
                >
                  <Link href={ROUTES.HOME}>
                    {formType === 'SIGN_IN'
                      ? 'Continue to Quickie without signing in'
                      : 'Continue to Quickie without signing up'}
                  </Link>
                </Button>
              </div>

              {formType === 'SIGN_IN' ? (
                <div className="space-y-3 pt-2">
                  <p className="text-center text-sm text-muted-foreground">
                    Don&apos;t have an account?{' '}
                    <Link
                      href={ROUTES.SIGN_UP}
                      className="text-primary hover:underline"
                    >
                      Sign up
                    </Link>
                  </p>
                </div>
              ) : (
                <p className="mt-4 text-center text-sm text-muted-foreground">
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
