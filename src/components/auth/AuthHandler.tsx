"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { AuthService } from "@/lib/auth/authService";

export function AuthHandler() {
  const router = useRouter();

  // Create supabase client
  const supabase = createBrowserSupabase();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        try {
          // Check if user profile exists in database
          const profile = await AuthService.checkUserProfile(session.user.id);

          if (profile) {
            // User has completed profile - redirect to feed
            router.push("/feed");
          } else {
            // New user or incomplete profile - redirect to onboarding
            router.push("/onboarding");
          }
        } catch (error) {
          console.error("Error checking user profile:", error);
          // Default to onboarding on error
          router.push("/onboarding");
        }
      } else if (event === "SIGNED_OUT") {
        // User signed out, redirect to home
        router.push("/");
      } else if (event === "TOKEN_REFRESHED") {
        // Token was refreshed, no action needed
        console.log("Token refreshed successfully");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null; // This component doesn't render anything
}
