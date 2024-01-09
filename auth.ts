// import NextAuth from 'next-auth';
// import { authConfig } from '@/auth.config';

// export const {
//   handlers: { GET, POST },
//   auth,
//   signIn,
//   signOut,
// } = NextAuth({
//   session: { strategy: 'jwt' },
//   ...authConfig,
// });

import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { getCookie } from 'cookies-next';
import { cookies } from 'next/headers';

// import { sql } from '@vercel/postgres';
// import type { User } from '@/app/lib/definitions';
// import bcrypt from 'bcrypt';

async function loginUser(email: string, password: string) {
  try {
    const body = JSON.stringify({ email, password });
    console.log(
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/v1/auth/login`
    );
    const res = await fetch(
      `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api/v1/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Cookie: `_vercel_jwt=${getCookie('_vercel_jwt', { cookies })}}`,
        },
        body,
      }
    );
    // const user = await sql<User>`SELECT * FROM users WHERE email=${email}`;
    // return user.rows[0];
    console.log('Response status:', res.status);
    console.log('Response headers:', res.headers);

    if (res.status === 400 || res.status === 401) return null;
    const result = await res.json();
    console.log(result);
    return result;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);
        console.log(parsedCredentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await loginUser(email, password);
          if (!user) return null;
          // const passwordsMatch = await bcrypt.compare(password, user.password);

          // if (passwordsMatch) return user;
          return user;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});
