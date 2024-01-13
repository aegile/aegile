import type { NextAuthConfig } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { LoginSchema } from '@/lib/schemas';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';
import { fetchServerAPIRequest } from '@/lib/server-utils';

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
      if (token) {
        session.accessToken = token.accessToken as string;
      }
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
          const { email, password } = validatedFields.data;
          // fetch to backend
          const jwtCookie = getCookie('_vercel_jwt', { cookies });
          // const res = await fetchServerAPIRequest(
          //   '/api/v1/auth/login',
          //   'POST',
          //   { email, password }
          // );
          const protocol = process.env.LOCAL === 'true' ? 'http' : 'https';
          const res = await fetch(
            `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/v1/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Cookie: `_vercel_jwt=${jwtCookie}`,
              },
              body: JSON.stringify(validatedFields.data),
            }
          );
          console.log('Response status:', res.status);
          console.log('Response headers:', res.headers);

          if (res.status === 400 || res.status === 401) {
            // Handle error
            console.error('Login failed');
            return null;
          } else {
            const result = await res.json();
            console.log(result);
            return result;
          }
        }
      },
    }),
  ], // Add providers with an empty array for now
} satisfies NextAuthConfig;
