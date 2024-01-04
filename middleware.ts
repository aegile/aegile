import { NextResponse, NextRequest } from 'next/server'
import { checkAuth } from '@/lib/utils';

export async function middleware(req: NextRequest) {
  
  if (!checkAuth()) {
    return NextResponse.redirect(new URL('/login', req.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/courses', '/dashboard'],
}