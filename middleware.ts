import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  // If there's an error getting the session, clear any auth cookies
  if (error) {
    console.error('Middleware auth error:', error)
    // Clear auth cookies on error
    res.cookies.delete('sb-access-token')
    res.cookies.delete('sb-refresh-token')
  }

  // Protected routes
  const protectedRoutes = ['/feed', '/profile', '/onboarding', '/members']
  const authRoutes = ['/login', '/sign-up']
  const pathname = req.nextUrl.pathname

  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes, redirect to feed
  if (isAuthRoute && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/feed'
    return NextResponse.redirect(redirectUrl)
  }

  // For onboarding route, check if user has completed profile
  if (pathname === '/onboarding' && session) {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', session.user.id)
        .single()

      // If profile exists, redirect to feed
      if (profile) {
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/feed'
        return NextResponse.redirect(redirectUrl)
      }
    } catch (error) {
      console.error('Error checking profile in middleware:', error)
      // Continue to onboarding on error
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
