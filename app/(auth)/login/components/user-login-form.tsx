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
import { LoginSchema } from '@/lib/schemas';

export function UserLoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: 'z5555555@ad.unsw.edu.au',
      password: 'AlexXu123!',
    },
    mode: 'onChange',
  });

  async function onSubmit(values: z.infer<typeof LoginSchema>) {
    toast(
      <div className="w-full">
        <p>You submitted the following values:</p>
        <pre className="mt-2 w-full rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(values, null, 2)}</code>
        </pre>
      </div>
    );
    setIsLoading(true);
    const res = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(values),
    });
    const data = await res.json();
    console.log(data);
    if (data?.access_token) {
      setCookie('access_token', data.access_token);
    }
    if (data?.success) toast.success(data.success);
    data?.error ? toast.error(data.error) : toast.success('Login successful!');
    setIsLoading(false);

    // router.push('/dashboard');
    setIsLoading(false);
    return;
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
