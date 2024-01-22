'use client';

import { useEffect } from 'react';
// import { navigate } from './actions';

import { logout } from '@/lib/actions/logout';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { toast } from 'sonner';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.log(error);
    toast.error(error.message);
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {error.message || 'Unexpected Error'}
          </CardTitle>
          <CardDescription>An unexpected error has occurred.</CardDescription>
        </CardHeader>
        <CardContent>Please try logging in again.</CardContent>
        <CardFooter className="flex justify-around gap-3">
          <Button
            className="w-full"
            variant="secondary"
            onClick={() => reset()}
          >
            Try Again
          </Button>
          <Button className="w-full" onClick={() => logout()}>
            Log In
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
