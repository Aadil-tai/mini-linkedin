"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/superbase/client";
import {
  getProfileCompleteCookieClient,
  setProfileCompleteCookieClient,
  clearProfileCompleteCookieClient,
} from "@/lib/utils";

export function AuthHandler() {
  const router = useRouter();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        // Check cookie first for faster response
        const hasProfileCookie = getProfileCompleteCookieClient();

        if (hasProfileCookie) {
          router.push("/feed");
          return;
        }

        // If no cookie, check database
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", session.user.id)
          .single();

        if (profile && !error) {
          // User has profile, set cookie and redirect to feed
          setProfileCompleteCookieClient();
          router.push("/feed");
        } else {
          // New user, redirect to onboarding
          router.push("/onboarding");
        }
      } else if (event === "SIGNED_OUT") {
        // User signed out, clear profile cookie and redirect to home
        clearProfileCompleteCookieClient();
        router.push("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return null; // This component doesn't render anything
}
