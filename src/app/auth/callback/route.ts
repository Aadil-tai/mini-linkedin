import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    console.error('No code in callback URL');
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
  }

  try {
    const cookieStore = cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: Record<string, unknown>) {
            try {
              cookieStore.set({ name, value, ...options });
            } catch {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: Record<string, unknown>) {
            try {
              cookieStore.set({ name, value: "", ...options });
            } catch {
              // The `remove` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    );

    console.log('Exchanging code for session:', code);
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`);
    }

    const { user, session } = data;

    if (!session || !user) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_session`);
    }

    console.log('User confirmed email:', user.id);
    
    // For email confirmation flow, ALWAYS redirect to onboarding first
    // The onboarding page will handle checking if profile is complete
    console.log('Email confirmation successful - redirecting to onboarding');
    return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`);
  }
}
