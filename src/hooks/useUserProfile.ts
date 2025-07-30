import { useState, useEffect } from "react";
import { supabase } from "@/lib/superbase/client";

interface UserProfile {
  avatar_url?: string;
  first_name?: string;
  last_name?: string;
  job_title?: string;
  company?: string;
  bio?: string;
  phone?: string;
  website?: string;
}

export const useUserProfile = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setUserProfile(null);
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) {
        console.error("Error loading user profile:", profileError);
        setError(profileError.message);
        return;
      }

      setUserProfile(profile);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load profile";
      setError(errorMessage);
      console.error("Error in useUserProfile:", err);
    } finally {
      setLoading(false);
    }
  };

  const refreshProfile = () => {
    loadUserProfile();
  };

  return {
    userProfile,
    loading,
    error,
    refreshProfile,
  };
};
