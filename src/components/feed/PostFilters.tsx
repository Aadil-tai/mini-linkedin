"use client";
import React from "react";
import { Clock, TrendingUp, Heart, Calendar } from "lucide-react";
import { PostFilterType } from "@/lib/supabase/postActions";

interface PostFiltersProps {
  activeFilter: PostFilterType;
  onFilterChange: (filter: PostFilterType) => void;
}

const PostFilters: React.FC<PostFiltersProps> = ({
  activeFilter,
  onFilterChange,
}) => {
  const filters = [
    {
      key: "latest" as PostFilterType,
      label: "Latest",
      icon: Clock,
      description: "Most recent posts",
    },
    {
      key: "popular" as PostFilterType,
      label: "Popular",
      icon: Heart,
      description: "Most liked posts",
    },
    {
      key: "trending" as PostFilterType,
      label: "Trending",
      icon: TrendingUp,
      description: "Hot topics this week",
    },
    {
      key: "oldest" as PostFilterType,
      label: "Oldest",
      icon: Calendar,
      description: "Oldest posts first",
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
        Filter Posts
      </h3>
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const Icon = filter.icon;
          const isActive = activeFilter === filter.key;

          return (
            <button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                isActive
                  ? "bg-blue-500 text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
              }`}
              title={filter.description}
            >
              <Icon className="w-4 h-4" />
              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default PostFilters;
