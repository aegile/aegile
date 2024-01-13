// import { auth } from '@/auth';
import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

// export default NextAuth(authConfig).auth;

import {
  DEFAULT_LOGIN_REDIRECT,
  authRoutes,
  publicRoutes,
  apiAuthPrefix,
} from '@/routes';

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // console.log('requested route >>> ', req.nextUrl.pathname);
  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isPublicRoute = publicRoutes.includes(nextUrl.pathname);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute) return null;
  if (isAuthRoute) {
    if (isLoggedIn) {
      const callbackUrl =
        nextUrl.searchParams.get('callbackUrl') || DEFAULT_LOGIN_REDIRECT;
      return Response.redirect(new URL(callbackUrl, nextUrl));
    }
    return null;
  }
  if (!isLoggedIn && !isPublicRoute) {
    const loginUrl = new URL('/login', nextUrl);
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname);
    return Response.redirect(loginUrl);
    // return Response.redirect(new URL('/api/auth/signin', nextUrl));
  }
  return null;
});

// Optionally, don't invoke Middleware on some paths
// Read more: https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
