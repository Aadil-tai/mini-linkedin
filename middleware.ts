import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: Record<string, unknown>) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: Record<string, unknown>) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Refresh session if expired - required for Server Components
  const { data: { session }, error } = await supabase.auth.getSession()

  // If there's an error getting the session, continue without blocking
  if (error) {
    console.error('Middleware auth error:', error)
  }

  // Protected routes
  const protectedRoutes = ['/feed', '/profile', '/members']
  const authRoutes = ['/login', '/sign-up', '/forgot-password']
  const publicRoutes = ['/', '/about', '/contact']
  const pathname = req.nextUrl.pathname

  // Check route types
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  const isPublicRoute = publicRoutes.some(route => 
    pathname === route
  )

  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = '/login'
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If user is authenticated and trying to access auth routes
  if (isAuthRoute && session) {
    console.log('=== MIDDLEWARE AUTH ROUTE CHECK ===');
    console.log('User ID:', session.user.id);
    console.log('User Email:', session.user.email);
    
    // Check if profile is complete
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, company, user_id, email, first_name, last_name')
      .eq('user_id', session.user.id)

    console.log('Profile query result:', { 
      profiles_count: profiles ? profiles.length : 0,
      error: profileError?.message,
      profiles: profiles
    });

    if (profiles && profiles.length > 0 && !profileError) {
      // If multiple profiles, find the most complete one
      console.log('Found multiple profiles, selecting most complete one');
      const profile = profiles.reduce((best, current) => {
        const bestScore = (best?.full_name ? 1 : 0) + (best?.company ? 1 : 0) + 
                         (best?.first_name ? 1 : 0) + (best?.last_name ? 1 : 0);
        const currentScore = (current?.full_name ? 1 : 0) + (current?.company ? 1 : 0) + 
                           (current?.first_name ? 1 : 0) + (current?.last_name ? 1 : 0);
        return currentScore > bestScore ? current : best;
      });
      
      console.log('Using profile for auth route validation:', {
        total_profiles: profiles.length,
        selected_profile: profile,
        all_profiles: profiles
      });

      const isProfileComplete = profile?.full_name && profile?.company
      console.log('Profile completeness:', {
        full_name: profile?.full_name,
        company: profile?.company,
        isComplete: isProfileComplete
      });
      
      // Redirect to feed if profile is complete, otherwise to onboarding
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = isProfileComplete ? '/feed' : '/onboarding'
      console.log('Redirecting to:', redirectUrl.pathname);
      return NextResponse.redirect(redirectUrl)
    } else {
      console.log('No profiles found - redirecting to onboarding');
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/onboarding'
      return NextResponse.redirect(redirectUrl)
    }
  }

  // If user is authenticated and accessing onboarding, check if they should be redirected
  if (pathname === '/onboarding' && session) {
    console.log('=== MIDDLEWARE ONBOARDING CHECK ===');
    console.log('User ID:', session.user.id);
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, company, user_id')
      .eq('user_id', session.user.id)

    console.log('Onboarding profile check:', { 
      profiles_count: profiles ? profiles.length : 0,
      error: profileError?.message,
      profiles: profiles
    });

    if (profiles && profiles.length > 0 && !profileError) {
      // If multiple profiles, take the first one
      const profile = profiles[0];
      console.log('Using profile for onboarding validation:', {
        total_profiles: profiles.length,
        selected_profile: profile
      });

      const isProfileComplete = profile?.full_name && profile?.company
      console.log('Profile completeness on onboarding:', {
        full_name: profile?.full_name,
        company: profile?.company,
        isComplete: isProfileComplete
      });
      
      if (isProfileComplete) {
        console.log('Profile complete - redirecting to feed');
        const redirectUrl = req.nextUrl.clone()
        redirectUrl.pathname = '/feed'
        return NextResponse.redirect(redirectUrl)
      } else {
        console.log('Profile incomplete - staying on onboarding');
      }
    } else {
      console.log('No profiles found - staying on onboarding');
    }
  }

  // If user is authenticated and accessing feed, check if they need onboarding
  if (pathname === '/feed' && session) {
    console.log('=== MIDDLEWARE FEED CHECK ===');
    console.log('User ID:', session.user.id);
    console.log('Terminal Log: Checking feed access for user');
    
    const { data: profiles, error: profileError } = await supabase
      .from('profiles')
      .select('full_name, company, user_id')
      .eq('user_id', session.user.id)

    console.log('Terminal Log: Feed profile check result');
    console.log('Profiles count:', profiles ? profiles.length : 0);
    console.log('Error:', profileError?.message || 'None');
    if (profiles && profiles.length > 0) {
      console.log('First profile data:', JSON.stringify(profiles[0], null, 2));
    }

    if (!profiles || profiles.length === 0 || profileError) {
      console.log('Terminal Log: No profiles found or error - redirecting to onboarding');
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/onboarding'
      return NextResponse.redirect(redirectUrl)
    }

    // If multiple profiles, take the first one
    const profile = profiles[0];
    console.log('Terminal Log: Using profile for validation');
    console.log('Total profiles:', profiles.length);
    console.log('Selected profile:', JSON.stringify(profile, null, 2));

    const isProfileComplete = profile?.full_name && profile?.company
    console.log('Terminal Log: Profile completeness check');
    console.log('full_name:', profile?.full_name);
    console.log('company:', profile?.company);
    console.log('isComplete:', isProfileComplete);
    
    if (!isProfileComplete) {
      console.log('Terminal Log: Profile incomplete - redirecting to onboarding');
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/onboarding'
      return NextResponse.redirect(redirectUrl)
    } else {
      console.log('Terminal Log: Profile complete - staying on feed');
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api (API routes)
     * - auth (auth callback routes)
     */
    '/((?!_next/static|_next/image|favicon.ico|public|api|auth).*)',
  ],
}