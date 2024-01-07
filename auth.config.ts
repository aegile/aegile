import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { LoginSchema } from '@/schemas';
import { access } from 'fs';

declare module 'next-auth' {
  interface User {
    /** The user's postal address. */
    address: string;
    access_token: string;
    handle: string;
  }
  interface Session {
    accessToken: string;
  }
}

export const authConfig = {
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async session({ session, token, user }) {
      // Add property to session, like an access_token from a provider.
      if (user) {
        session.user = user;
      }
      return session;
    },
    async jwt({ token, user }) {
      // Add access_token to the token right after signin
      if (user) {
        token.accessToken = user.access_token;
      }
      // token.handle = (user as AegileUser)?.handle;
      return token;
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);
        if (validatedFields.success) {
          //   const { email, password } = validatedFields.data;
          // fetch to backend
          const response = await fetch(
            `http://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/v1/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(validatedFields.data),
            }
          );

          const result = await response.json();
          console.log(response.status, result);

          if (!response.ok) {
            // Handle error
            console.error('Login failed');
            return null;
          } else {
            return result;
          }
        }
        return null;
      },
    }),
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;
