import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const supabase = createRouteHandlerClient({ cookies });
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    
    if (error) {
      // If there's an error, redirect to login with error
      return NextResponse.redirect(`${requestUrl.origin}/(auth)/login?error=auth_error`);
    }
  }

  // Redirect to onboarding page after successful email verification
  return NextResponse.redirect(`${requestUrl.origin}/onboarding`);
}
