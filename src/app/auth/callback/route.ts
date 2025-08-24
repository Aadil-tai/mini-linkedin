import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=no_code`);
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      console.error('Auth callback error:', error);
      return NextResponse.redirect(`${requestUrl.origin}/login?error=auth_error`);
    }

    const { user, session } = data;

    if (!session || !user) {
      return NextResponse.redirect(`${requestUrl.origin}/login?error=no_session`);
    }

    // Check if user profile exists in database
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, user_id')
      .eq('user_id', user.id)
      .single();

    // Redirect based on profile existence
    if (profile && !profileError) {
      // User has completed profile - redirect to feed
      return NextResponse.redirect(`${requestUrl.origin}/feed`);
    } else {
      // New user or incomplete profile - redirect to onboarding
      return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
    }
  } catch (error) {
    console.error('Unexpected error in auth callback:', error);
    return NextResponse.redirect(`${requestUrl.origin}/login?error=unexpected_error`);
  }
}
