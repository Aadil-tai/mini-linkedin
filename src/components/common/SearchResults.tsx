"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, User, FileText, Hash, Clock } from "lucide-react";
import { SearchResult } from "@/lib/superbase/searchActions";

interface SearchResultsProps {
  results: {
    users: SearchResult[];
    skills: SearchResult[];
    posts: SearchResult[];
  };
  query: string;
  onClose: () => void;
  isVisible: boolean;
}

export default function SearchResults({
  results,
  query,
  onClose,
  isVisible,
}: SearchResultsProps) {
  const router = useRouter();

  const handleResultClick = (result: SearchResult) => {
    if (result.type === "user") {
      router.push(`/members/${result.id}`);
    } else if (result.type === "post") {
      router.push(`/feed?post=${result.id}`);
    }
    onClose();
  };

  const getUserInitials = (title: string) => {
    return title
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalResults =
    results.users.length + results.skills.length + results.posts.length;

  if (!isVisible || !query.trim()) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 z-50 max-h-96 overflow-hidden">
      {totalResults === 0 ? (
        <div className="p-6 text-center">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            No results found for "{query}"
          </p>
          <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
            Try searching for names, skills, or post content
          </p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {/* Users Section */}
          {results.users.length > 0 && (
            <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <User className="w-4 h-4 text-blue-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  People ({results.users.length})
                </h3>
              </div>
              <div className="space-y-1">
                {results.users.map((result) => (
                  <button
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors text-left"
                  >
                    {result.avatar_url ? (
                      <img
                        src={result.avatar_url}
                        alt={result.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                        {getUserInitials(result.title)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Skills Section */}
          {results.skills.length > 0 && (
            <div className="p-3 border-b border-gray-200/50 dark:border-gray-700/50">
              <div className="flex items-center space-x-2 mb-3">
                <Hash className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  By Skills ({results.skills.length})
                </h3>
              </div>
              <div className="space-y-1">
                {results.skills.map((result) => (
                  <button
                    key={`skill-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center space-x-3 w-full p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors text-left"
                  >
                    {result.avatar_url ? (
                      <img
                        src={result.avatar_url}
                        alt={result.title}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                        {getUserInitials(result.title)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {result.subtitle}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Posts Section */}
          {results.posts.length > 0 && (
            <div className="p-3">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="w-4 h-4 text-purple-500" />
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Posts ({results.posts.length})
                </h3>
              </div>
              <div className="space-y-1">
                {results.posts.map((result) => (
                  <button
                    key={`post-${result.id}`}
                    onClick={() => handleResultClick(result)}
                    className="flex items-start space-x-3 w-full p-2 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-700/80 transition-colors text-left"
                  >
                    <div className="flex-shrink-0">
                      {result.avatar_url ? (
                        <img
                          src={result.avatar_url}
                          alt={result.profile?.first_name || "User"}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-semibold">
                          {getUserInitials(result.profile?.first_name || "U")}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-white line-clamp-2">
                        {result.title}
                      </p>
                      {result.subtitle && (
                        <div className="flex items-center space-x-1 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {result.subtitle}
                          </p>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
