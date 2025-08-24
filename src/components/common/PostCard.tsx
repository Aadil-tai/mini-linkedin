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
import { togglePostLike, deletePost } from "@/lib/supabase/postActions";
import { createBrowserSupabase } from "@/lib/supabase/client";
import CommentSection from "./CommentSection";

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
      id?: string;
      user_id?: string;
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
  const [commentCount, setCommentCount] = useState(post.comments);
  const [isCommentsExpanded, setIsCommentsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // Create supabase client
  const supabase = createBrowserSupabase();

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

  const handleCommentClick = () => {
    setIsCommentsExpanded(!isCommentsExpanded);
  };

  const handleCommentCountChange = (newCount: number) => {
    setCommentCount(newCount);
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

  // Get profile image with better fallback handling
  const getProfileImage = () => {
    if (post.profiles?.avatar_url) {
      return post.profiles.avatar_url;
    }
    return null; // No fallback image, will show initials instead
  };

  const authorAvatar = getProfileImage();
  const authorTitle = post.profiles?.job_title || "Professional";
  const isAuthor = currentUserId === post.profiles?.user_id; // Compare with profile's user_id

  // Get initials for fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-4">
      {/* Post Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
              onError={(e) => {
                console.error("Failed to load profile image:", authorAvatar);
                // Hide the image on error and show initials fallback
                e.currentTarget.style.display = "none";
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold ring-2 ring-gray-200 dark:ring-gray-700">
              {getInitials(authorName)}
            </div>
          )}
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
          />
        )}
      </div>

      {/* Post Stats */}
      <div className="mt-3 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
        <span>{likeCount} likes</span>
        <span>{commentCount} comments</span>
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
        <button
          onClick={handleCommentClick}
          className={`flex items-center space-x-1 px-4 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 ${
            isCommentsExpanded ? "text-blue-500" : "text-gray-500"
          }`}
        >
          <MessageSquare size={18} />
          <span>Comment</span>
        </button>
        <button className="flex items-center space-x-1 px-4 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500">
          <Share2 size={18} />
          <span>Share</span>
        </button>
      </div>

      {/* Comment Section */}
      <CommentSection
        postId={post.id}
        initialCommentCount={commentCount}
        isExpanded={isCommentsExpanded}
        onToggle={handleCommentClick}
        onCommentCountChange={handleCommentCountChange}
      />
    </div>
  );
}
