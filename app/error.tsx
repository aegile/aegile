'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 bg-white rounded shadow-xl">
        <h1 className="mb-4 text-2xl font-semibold text-red-600">
          {error.message || 'Error'}
        </h1>
        <p className="mb-6 text-gray-700">
          Something went wrong. Please try logging in again.
        </p>
        <Button
          className="transition-colors"
          onClick={
            // Attempt to recover by trying to re-render the invoices route
            () => reset()
          }
        >
          Try again
        </Button>
        <Link href="/login">Sign In</Link>
      </div>
    </main>
  );
}
