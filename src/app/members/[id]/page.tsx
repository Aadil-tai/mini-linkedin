"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Briefcase,
  ArrowLeft,
} from "lucide-react";
import Header from "@/components/common/Header";
import { supabase } from "@/lib/supabase/client";

interface ProfileData {
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
}

export default function MemberPage() {
  const params = useParams();
  const memberId = params.id as string;
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMemberProfile() {
      try {
        // First try to get by profile ID
        const query = supabase
          .from("profiles")
          .select("*")
          .eq("id", memberId)
          .single();

        let { data: profileData, error: profileError } = await query;

        // If not found by profile ID, try by user_id
        if (profileError && profileError.code === "PGRST116") {
          const { data: userProfileData, error: userProfileError } =
            await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", memberId)
              .single();

          profileData = userProfileData;
          profileError = userProfileError;
        }

        if (profileError) {
          throw profileError;
        }

        setProfile(profileData);
      } catch (err) {
        console.error("Error fetching member profile:", err);
        setError(err instanceof Error ? err.message : "Profile not found");
      } finally {
        setLoading(false);
      }
    }

    if (memberId) {
      fetchMemberProfile();
    }
  }, [memberId]);

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Compute display name
  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.full_name || "User";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-200">
              Loading profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center max-w-md mx-auto p-8 bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="text-red-500 mb-4">
              <User className="w-16 h-16 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                Profile Not Found
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                This user profile could not be found.
              </p>
            </div>
            <div className="space-y-3 mt-6">
              <Link
                href="/feed"
                className="block text-blue-500 dark:text-blue-400 hover:underline"
              >
                Back to Feed
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              href="/feed"
              className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Feed</span>
            </Link>
          </div>

          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
              {/* Avatar */}
              <div className="flex-shrink-0">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={displayName}
                    className="w-24 h-24 rounded-full object-cover ring-4 ring-gray-200 dark:ring-gray-700"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-2xl font-semibold ring-4 ring-gray-200 dark:ring-gray-700">
                    {getUserInitials(displayName)}
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {displayName}
                </h1>
                {profile?.job_title && (
                  <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                    {profile.job_title}
                  </p>
                )}
                {profile?.company && (
                  <p className="text-gray-500 dark:text-gray-400 mb-2 flex items-center justify-center md:justify-start">
                    <Building className="w-4 h-4 mr-2" />
                    {profile.company}
                  </p>
                )}
                {profile?.location && (
                  <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start">
                    <MapPin className="w-4 h-4 mr-2" />
                    {profile.location}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            {/* About Section */}
            {profile?.bio && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  About
                </h2>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            )}

            {/* Professional Section */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                <Briefcase className="w-5 h-5 mr-2" />
                Professional Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.job_title && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Job Title
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {profile.job_title}
                    </p>
                  </div>
                )}
                {profile?.company && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Company
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {profile.company}
                    </p>
                  </div>
                )}
                {profile?.industry && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Industry
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {profile.industry}
                    </p>
                  </div>
                )}
                {profile?.company_size && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                      Company Size
                    </h3>
                    <p className="text-gray-900 dark:text-white">
                      {profile.company_size}
                    </p>
                  </div>
                )}
              </div>

              {profile?.skills && profile.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">
                    Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center mb-4">
                <Mail className="w-5 h-5 mr-2" />
                Contact Information
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {profile?.email && (
                  <div className="flex items-center space-x-3">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Email
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {profile.email}
                      </p>
                    </div>
                  </div>
                )}
                {profile?.phone && (
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Phone
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {profile.phone}
                      </p>
                    </div>
                  </div>
                )}
                {profile?.website && (
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 text-gray-400">🌐</div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Website
                      </h3>
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {profile.website}
                      </a>
                    </div>
                  </div>
                )}
                {profile?.created_at && (
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <div>
                      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                        Member Since
                      </h3>
                      <p className="text-gray-900 dark:text-white">
                        {new Date(profile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
