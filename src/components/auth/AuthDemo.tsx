"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

export function AuthDemo() {
  const {
    user,
    session,
    profile,
    isLoading,
    isAuthenticated,
    hasProfile,
    logout,
  } = useAuth();

  const router = useRouter();

  if (isLoading) {
    return <div>Loading auth state...</div>;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  return (
    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Authentication Status</h3>

      <div className="space-y-2">
        <p>
          <strong>Authenticated:</strong> {isAuthenticated ? "Yes" : "No"}
        </p>
        <p>
          <strong>Has Profile:</strong> {hasProfile ? "Yes" : "No"}
        </p>
        <p>
          <strong>User ID:</strong> {user?.id || "None"}
        </p>
        <p>
          <strong>Email:</strong> {user?.email || "None"}
        </p>
        <p>
          <strong>Profile Name:</strong>{" "}
          {profile?.first_name || profile?.last_name
            ? `${profile.first_name} ${profile.last_name}`
            : "No profile"}
        </p>

        {session && (
          <div className="mt-4">
            <h4 className="font-medium">Session Details:</h4>
            <p className="text-sm">
              <strong>Access Token:</strong>{" "}
              {session.access_token.substring(0, 20)}...
            </p>
            <p className="text-sm">
              <strong>Refresh Token:</strong>{" "}
              {session.refresh_token.substring(0, 20)}...
            </p>
            <p className="text-sm">
              <strong>Expires At:</strong>{" "}
              {new Date((session.expires_at || 0) * 1000).toLocaleString()}
            </p>
          </div>
        )}

        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
