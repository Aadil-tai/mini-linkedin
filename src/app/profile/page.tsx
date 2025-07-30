"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Edit } from "lucide-react";
import Header from "@/components/common/Header";
import ProfileCard from "@/components/profile/ProfileCard";
import AboutSection from "@/components/profile/AboutSection";
import ExperienceSection from "@/components/profile/ExperienceSection";
import SkillsSection from "@/components/profile/SkillsSection";
import EducationSection from "@/components/profile/EducationSection";
import CareerOpportunitiesSection from "@/components/profile/CareerOpportunitiesSection";
import { fetchUserProfile, ProfileData } from "@/lib/profile";
import { useProfile } from "@/hooks/userProfile";

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    about: true,
    experience: true,
    skills: true,
    education: true,
    opportunities: true,
  });

  // Get user info for AboutSection
  const { user } = useProfile();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchUserProfile();
        setProfile(profileData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-200">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
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
              <p className="text-gray-600 dark:text-gray-300 mt-2">{error}</p>
            </div>
            <div className="space-y-3 mt-6">
              <Link
                href="/onboarding"
                className="block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                Complete Onboarding
              </Link>
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

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              No profile data available
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />

      <div className="pt-16">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Profile Card */}
            <div className="lg:col-span-1">
              <ProfileCard profile={profile} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <AboutSection userId={user?.id} />

              <ExperienceSection
                profile={profile}
                expanded={expandedSections.experience}
                onToggle={() => toggleSection("experience")}
              />

              <SkillsSection
                skills={profile.skills}
                expanded={expandedSections.skills}
                onToggle={() => toggleSection("skills")}
              />

              <EducationSection
                education={profile.education}
                certifications={profile.certifications}
                expanded={expandedSections.education}
                onToggle={() => toggleSection("education")}
              />

              <CareerOpportunitiesSection
                availableForHire={profile.available_for_hire}
                openToOpportunities={profile.open_to_opportunities}
                professionalPhone={profile.professional_phone}
                phone={profile.phone}
                expanded={expandedSections.opportunities}
                onToggle={() => toggleSection("opportunities")}
              />

              {/* Edit Profile Button */}
              <div className="mt-6">
                <Link
                  href="/onboarding"
                  className="inline-flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Edit Profile</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
