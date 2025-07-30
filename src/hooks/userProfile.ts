import { supabase } from "@/lib/superbase/client";
import { useState, useEffect } from "react";

export interface ProfileData {
  id: string;
  user_id?: string;
  avatar_url?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  email?: string | null;
  phone?: string | null;
  job_title?: string | null;
  bio?: string | null;
  skills?: string[] | null;
  company?: string | null;
  company_size?: string | null;
  industry?: string | null;
  location?: string | null;
  website?: string | null;
  created_at?: string;
  updated_at?: string;
}

export function useProfile(userId?: string) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);

        // Get current user first
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError) {
          throw userError;
        }

        if (user) {
          setUser(user);
          
          // Use userId parameter if provided, otherwise use current user's id
          const targetUserId = userId || user.id;
          
          const { data: profileData, error: profileError } = await supabase
            .from("profiles")
            .select("*")
            .eq("user_id", targetUserId)
            .single();

          console.log("useProfile hook - query result:", { profileData, profileError });

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          console.log("useProfile hook - setting profile:", profileData);
          setProfile(profileData);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, user, loading, error };
}
