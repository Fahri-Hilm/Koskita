import { auth } from '@/auth'
import { NextResponse } from 'next/server'

export const middleware = auth((req: any) => {
  const pathname = req.nextUrl.pathname
  const isLoggedIn = !!req.auth?.user

  // Redirect to login if not authenticated
  if (
    !isLoggedIn &&
    (pathname.startsWith('/owner') || pathname.startsWith('/penghuni'))
  ) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  // Auto-redirect based on role
  if (pathname === '/' && isLoggedIn) {
    const role = req.auth?.user?.role
    const redirect =
      role === 'OWNER' ? '/owner/dashboard' : '/penghuni/dashboard'
    return NextResponse.redirect(new URL(redirect, req.url))
  }

  // Role-based access control
  if (pathname.startsWith('/owner') && req.auth?.user?.role !== 'OWNER') {
    return NextResponse.redirect(new URL('/penghuni/dashboard', req.url))
  }

  if (pathname.startsWith('/penghuni') && req.auth?.user?.role !== 'PENGHUNI') {
    return NextResponse.redirect(new URL('/owner/dashboard', req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}