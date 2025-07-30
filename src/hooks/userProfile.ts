import { supabase } from "@/lib/superbase/client";
import { useState, useEffect } from "react";

interface ProfileData {
  id: string;
  user_id: string;
  avatar_url: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string;
  job_title: string;
  bio: string;
  skills: string[];
  company: string;
  company_size: string;
  industry: string;
  location: string;
  website: string;
  created_at: string;
  updated_at: string;
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
          query = query.eq("user_id", userId);
        } else {
          // If no userId provided, get current user's profile
          const {
            data: { user },
          } = await supabase.auth.getUser();
          if (user) {
            query = query.eq("user_id", user.id);
          } else {
            throw new Error("No user found");
          }
        }

        const { data, error } = await query.single();

        if (error) {
          throw error;
        }

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
