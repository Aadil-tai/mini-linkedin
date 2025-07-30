"use client";

import { useState } from "react";
import Link from "next/link";
import {
  User,
  Edit,
  Mail,
  Phone,
  Building,
  MapPin,
  Calendar,
  Briefcase,
} from "lucide-react";
import Header from "@/components/common/Header";
import { useProfile } from "@/hooks/userProfile";

const Accordion = ({
  title,
  icon: Icon,
  children,
  defaultOpen = true,
}: {
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-left"
      >
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
          {Icon && <Icon className="w-5 h-5 mr-2" />}
          {title}
        </h2>
        <span className="text-gray-400">{isOpen ? "−" : "+"}</span>
      </button>
      {isOpen && <div className="mt-4 space-y-4">{children}</div>}
    </div>
  );
};

interface ProfileFieldProps {
  icon?: React.ComponentType<{ className?: string }> | null;

  label: string;
  value?: string | null; // Allow null values
  isLink?: boolean;
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  icon: Icon,
  label,
  value,
  isLink = false,
}) => {
  // Handle null/undefined values
  if (value == null) return null;

  return (
    <div className="flex items-center">
      {Icon && <Icon className="w-4 h-4 mr-3 text-gray-400" />}
      <div>
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </h3>
        {isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline"
          >
            {value}
          </a>
        ) : (
          <p className="text-gray-900 dark:text-white">{value}</p>
        )}
      </div>
    </div>
  );
};
export default function ProfilePage() {
  const { profile, user, loading, error } = useProfile();

  const displayName =
    profile?.first_name && profile?.last_name
      ? `${profile.first_name} ${profile.last_name}`
      : profile?.full_name ||
        user?.user_metadata?.full_name ||
        user?.email ||
        "User";

  const getUserInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);

  if (loading)
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 dark:border-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-200">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );

  if (error)
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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="pt-16">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Profile Header */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
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
                    <Building className="w-4 h-4 mr-2" /> {profile.company}
                  </p>
                )}
                {profile?.location && (
                  <p className="text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start">
                    <MapPin className="w-4 h-4 mr-2" /> {profile.location}
                  </p>
                )}
              </div>

              <Link
                href="/onboarding"
                className="inline-flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Edit className="w-4 h-4" /> <span>Edit Profile</span>
              </Link>
            </div>
          </div>

          {/* Profile Sections */}
          <div className="space-y-6">
            {profile?.bio && (
              <Accordion title="About">
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {profile.bio}
                </p>
              </Accordion>
            )}

            <Accordion title="Professional Information" icon={Briefcase}>
              <ProfileField label="Job Title" value={profile?.job_title} />
              <ProfileField label="Company" value={profile?.company} />
              <ProfileField label="Industry" value={profile?.industry} />
              <ProfileField
                label="Company Size"
                value={profile?.company_size}
              />
              {profile?.skills && profile.skills.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
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
            </Accordion>

            <Accordion title="Contact Information" icon={Mail}>
              <ProfileField icon={Mail} label="Email" value={profile?.email} />
              <ProfileField icon={Phone} label="Phone" value={profile?.phone} />
              <ProfileField
                icon={null}
                label="Website"
                value={profile?.website}
                isLink
              />
              <ProfileField
                icon={Calendar}
                label="Member Since"
                value={
                  profile?.created_at &&
                  new Date(profile.created_at).toLocaleDateString()
                }
              />
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
