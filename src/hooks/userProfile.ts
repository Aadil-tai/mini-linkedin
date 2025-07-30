import { supabase } from "@/lib/superbase/client";
import { useState, useEffect } from "react";

interface ProfileData {
  id: string;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProfile() {
      try {
        setLoading(true);

        let query = supabase.from("profiles").select("*");

        if (userId) {
          query = query.eq("id", userId); // Changed from "user_id" to "id"
        } else {
          // If no userId provided, get current user's profile
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            query = query.eq("id", user.id); // Changed from "user_id" to "id"
          } else {
            throw new Error("No user found");
          }
        }

        const { data, error } = await query.single();

        console.log("useProfile hook - query result:", { data, error });

        if (error) {
          throw error;
        }

        console.log("useProfile hook - setting profile:", data);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [userId]);

  return { profile, loading, error };
}
