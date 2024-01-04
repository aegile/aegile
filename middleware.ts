import { NextResponse, NextRequest } from 'next/server'
import { fetchAPIRequest } from './lib/utils';
// import { checkAuth } from '@/lib/utils';

export async function middleware(req: NextRequest) {
  // console.log(">>>>>>", req.nextUrl.pathname);
  // let token = '';
  // const accessTokenCookie = req.cookies.get('accessToken');
  // if (accessTokenCookie) {
  //   token = accessTokenCookie.value;
  // }

  // if (!token) {
  //   console.log("NO TOKEN FOUND, REDIRECTING")
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }
  // try {
  //   const res = await fetchAPIRequest('/api/v1/auth/check', 'GET', token);
  //   if (!res.ok) return NextResponse.next()
  // } catch (error) {
  //   return NextResponse.redirect(new URL('/login', req.url))
  // }
  return NextResponse.next()
}

export const config = {
  matcher: ['/courses', '/dashboard'],
}