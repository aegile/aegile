import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { UserRegistrationForm } from './components/user-registration-form';

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
};

const images = [
  '/pages/hero-library.jpg',
  '/pages/hero-lecture.jpg',
  '/pages/hero-tutorial.jpg',
];

export default function AuthenticationPage() {
  return (
    <>
      <div className="container relative h-dvh h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: 'ghost' }),
            'absolute right-4 top-4 md:right-8 md:top-8'
          )}
        >
          Login
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <Image
            // src="https://unsplash.it/960/1080?random&blur&gravity=center"
            src={images[Math.floor(Math.random() * images.length)]}
            width={1920}
            height={1080}
            alt="Authentication"
            className="absolute h-full inset-0 object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-70" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <Image
              src="/aegile-horizontal-text.svg"
              width={125}
              height={40}
              alt="aegile logo with text on the right of the logo"
              className="filter brightness-110"
            />
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Ut voluptatibus cumque maxime itaque quod ullam illo vitae porro
                iste suscipit laborum, molestiae at sapiente facere repellendus,
                officiis quae repudiandae maiores?&rdquo;
              </p>
              <footer className="text-sm">John Smith</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Create an account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your details below to create your account
              </p>
            </div>
            <UserRegistrationForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By creating an account, you agree to our{' '}
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
        </div>
      </div>
    </>
  );
}
