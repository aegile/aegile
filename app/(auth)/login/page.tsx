import { Metadata } from 'next';
import { UserLoginForm } from './components/user-login-form';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your aegile account.',
};

export default function LoginPage() {
  return (
    <>
      <Link
        href="/register"
        className={cn(
          buttonVariants({ variant: 'ghost' }),
          'absolute right-4 top-4 md:right-8 md:top-8'
        )}
      >
        Register
      </Link>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
          <p className="text-sm text-muted-foreground">
            Enter your details below to sign in to your account
          </p>
        </div>
        <UserLoginForm />
        <p className="px-8 text-center text-sm text-muted-foreground">
          By signing in to your account, you agree to our{' '}
          <Link
            href="/terms"
            className="underline underline-offset-4 hover:text-primary"
          >
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link
            href="/privacy"
            className="underline underline-offset-4 hover:text-primary"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </div>
    </>
  );
}
