import React, { useEffect, useState } from "react";
import { X, Search, Clock } from "lucide-react";
import { getRecentPostsForSidebar } from "@/lib/superbase/postActions";
import { stripHtml } from "@/lib/utils";

interface Profile {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
}

interface Post {
  id: string;
  content: string;
  created_at: string;
  profiles: Profile; // Changed from Profile[] to Profile
}

const RightSidebar = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const loadRecentPosts = async () => {
      try {
        const posts = await getRecentPostsForSidebar(5);
        // Transform the data to match our interface
        const formattedPosts =
          posts?.map((post) => ({
            ...post,
            profiles: Array.isArray(post.profiles)
              ? post.profiles[0] || {}
              : post.profiles || {},
          })) || [];
        setRecentPosts(formattedPosts);
      } catch (error) {
        console.error("Error loading recent posts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadRecentPosts();
  }, []);

  const clearSearch = () => setSearchQuery("");
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

  return (
    <aside className="hidden md:flex flex-col w-full max-w-xs h-screen sticky top-0 overflow-y-auto bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-4 space-y-6 scrollbar-hide">
      {" "}
      {/* Search Section */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search posts or people"
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
          </button>
        )}
      </div>
      {/* Recent Posts Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-gray-900 dark:text-white flex items-center">
            <Clock className="h-4 w-4 mr-2 text-gray-500" />
            Recent Activity
          </h3>
          <button className="text-xs text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
            See All
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
          </div>
        ) : recentPosts.length === 0 ? (
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No recent activity
          </p>
        ) : (
          <div className="space-y-3">
            {recentPosts.slice(0, 3).map((post) => (
              <article
                key={post.id}
                className="group p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors cursor-pointer"
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {post.profiles?.avatar_url ? (
                      <img
                        src={post.profiles.avatar_url}
                        alt={`${post.profiles.first_name || ""} ${
                          post.profiles.last_name || ""
                        }`}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                          {post.profiles?.first_name?.[0] || "U"}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {post.profiles?.first_name || "User"}{" "}
                      {post.profiles?.last_name}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      {stripHtml(post.content)?.slice(0, 60) || "Shared a post"}
                      {post.content?.length > 60 ? "..." : ""}
                    </p>
                    <time
                      dateTime={post.created_at}
                      className="text-xs text-gray-400 dark:text-gray-500 mt-1 flex items-center"
                    >
                      <Clock className="h-3 w-3 mr-1" />
                      {post.created_at
                        ? formatDate(post.created_at)
                        : "Recently"}
                    </time>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </aside>
  );
};

export default RightSidebar;
