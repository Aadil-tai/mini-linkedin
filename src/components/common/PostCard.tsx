// components/common/PostCard.tsx
"use client";

import { useState, useEffect } from "react";
import {
  Heart,
  MessageSquare,
  Share2,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { togglePostLike, deletePost } from "@/lib/superbase/postActions";
import { supabase } from "@/lib/superbase/client";

interface PostCardProps {
  post: {
    id: string;
    profile_id: string;
    content: string;
    image_url?: string;
    likes: number;
    comments: number;
    shares: number;
    is_liked: boolean;
    created_at: string;
    profiles?: {
      first_name?: string;
      last_name?: string;
      avatar_url?: string;
      job_title?: string;
    };
  };
  onPostDeleted?: (postId: string) => void;
}

export default function PostCard({ post, onPostDeleted }: PostCardProps) {
  const [isLiked, setIsLiked] = useState(post.is_liked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Debug: Log post data
  console.log("PostCard rendering post:", post);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleLike = async () => {
    try {
      const newIsLiked = !isLiked;
      const result = await togglePostLike(post.id, newIsLiked);
      setIsLiked(result.is_liked);
      setLikeCount(result.likes);
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      setIsDeleting(true);
      await deletePost(post.id);
      onPostDeleted?.(post.id);
    } catch (error) {
      console.error("Error deleting post:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  // Helper function to render rich text content
  const renderContent = (content: string) => {
    return (
      <div
        className="prose prose-sm max-w-none text-gray-800 dark:text-gray-200 dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  const authorName =
    post.profiles?.first_name && post.profiles?.last_name
      ? `${post.profiles.first_name} ${post.profiles.last_name}`
      : "Anonymous User";
  const authorAvatar = post.profiles?.avatar_url || "/default-avatar.png";
  const authorTitle = post.profiles?.job_title || "User";
  const isAuthor = currentUserId === post.profile_id;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <img
            src={authorAvatar}
            alt={authorName}
            className="w-12 h-12 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {authorName}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {authorTitle}
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {new Date(post.created_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <MoreHorizontal size={18} />
          </button>
          {isAuthor && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="text-red-500 hover:text-red-700 disabled:opacity-50"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Post Content */}
      <div className="mt-3">
        {renderContent(post.content)}
        {post.image_url && (
          <img
            src={post.image_url}
            alt="Post"
            className="mt-3 w-full rounded-lg object-cover max-h-96"
            onLoad={() =>
              console.log("Image loaded successfully:", post.image_url)
            }
            onError={(e) =>
              console.error("Image failed to load:", post.image_url, e)
            }
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
