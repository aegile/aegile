'use client';

import { useEffect } from 'react';

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

export default function ErrorAlert({ error }: { error: { error: string } }) {
  useEffect(() => {
    toast.error(error.error);
  }, []);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Card className="w-[500px]">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold">
            {error.error || 'Unexpected Error'}
          </CardTitle>
          <CardDescription>An unexpected error has occurred.</CardDescription>
        </CardHeader>
        <CardContent>Please try logging in again.</CardContent>
        <CardFooter className="flex justify-around gap-3">
          <Button className="w-full">Log In</Button>
        </CardFooter>
      </Card>
    </main>
  );
}
