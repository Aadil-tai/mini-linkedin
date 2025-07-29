// components/common/PostCard.tsx
"use client";

import { useState } from "react";
import { Heart, MessageSquare, Share2, MoreHorizontal } from "lucide-react";

interface PostCardProps {
  post: {
    id: string;
    user: {
      name: string;
      avatar: string;
      title: string;
    };
    content: string;
    image?: string;
    likes: number;
    comments: number;
    shares: number;
    createdAt: string;
    isLiked: boolean;
  };
}

export default function PostCard({ post }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikeCount(isLiked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {post.user.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {post.user.title}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <MoreHorizontal size={18} />
        </button>
      </div>

      {/* Post Content */}
      <div className="mt-3">
        <p className="text-gray-800 dark:text-gray-200">{post.content}</p>
        {post.image && (
          <img
            src={post.image}
            alt="Post"
            className="mt-3 w-full rounded-lg object-cover max-h-96"
          />
        )}
      </div>

      {/* Post Stats */}
      <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
        <span>{likeCount} likes</span>
        <span>{post.comments} comments</span>
        <span>{post.shares} shares</span>
      </div>

      {/* Post Actions */}
      <div className="mt-3 flex justify-between border-t border-gray-200 dark:border-gray-700 pt-3">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-1 px-4 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isLiked ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
          <span>Like</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
          <MessageSquare size={18} />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>
    </div>
  );
}
