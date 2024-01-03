import { NextResponse, NextRequest } from 'next/server'
import { parseCookies } from 'nookies'
import { checkAuth } from '@/lib/utils';

export async function middleware(req: NextRequest) {
  const cookies = parseCookies({ req })
  const token = cookies.token
  
  if (!await checkAuth(token)) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  req.headers.set('Authorization', `Bearer ${token}`)
  return NextResponse.next();
}

export const config = {
  matcher: ['/courses', '/dashboard'],
}