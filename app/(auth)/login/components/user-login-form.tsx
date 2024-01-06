'use client';

import * as React from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { setCookie } from 'cookies-next';
import * as z from 'zod';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const FormSchema = z.object({
  email: z
    .string()
    .email({
      message: 'Invalid email address.',
    })
    .refine(
      (value) =>
        // /^[\w.-]+@student\.unsw\.edu\.au$/.test(value) ||
        /^z\d{7}@ad\.unsw\.edu\.au$/.test(value),
      {
        message: 'Email must follow: z5555555@ad.unsw.edu.au',
      }
    ),
  password: z
    .string()
    .min(8, {
      message: 'Password must be at least 8 characters.',
    })
    .refine((value) => /[A-Z]/.test(value), {
      message: 'Password must contain at least one uppercase letter.',
    })
    .refine((value) => /\W|_/.test(value), {
      message: 'Password must contain at least one symbol.',
    }),
});

export function UserLoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      </div>
    );
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log(result);

    if (!response.ok) {
      // Handle error
      console.error('Login failed');
      toast.error(result.message);
      return;
    }

    setCookie('accessToken', result.access_token);
    // handle JWT token
    // handle success
    // navigate to login page
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full gap-y-4 grid"
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="z5555555@ad.unsw.edu.au" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {/* {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />} */}
          Sign In
        </Button>
      </form>
    </Form>
  );
}

//       <div className="relative">
//         <div className="absolute inset-0 flex items-center">
//           <span className="w-full border-t" />
//         </div>
//         <div className="relative flex justify-center text-xs uppercase">
//           <span className="bg-background px-2 text-muted-foreground">
//             Or continue with
//           </span>
//         </div>
//       </div>
//       {/* <Button variant="outline" type="button" disabled={isLoading}>
//         {isLoading ? (
//           <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
//         ) : (
//           <Icons.gitHub className="mr-2 h-4 w-4" />
//         )}{' '}
//         Github
//       </Button> */}
//     </div>
