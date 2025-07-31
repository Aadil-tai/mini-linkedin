"use client";

import { useState, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { deleteComment } from "@/lib/superbase/commentActions";
import { supabase } from "@/lib/superbase/client";
import type { Comment } from "@/lib/superbase/commentActions";

// Simple time ago function without external dependencies
const timeAgo = (date: string | Date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  return past.toLocaleDateString();
};

interface CommentListProps {
  comments: Comment[];
  onCommentDeleted: (commentId: string) => void;
  loading?: boolean;
}

export default function CommentList({
  comments,
  onCommentDeleted,
  loading,
}: CommentListProps) {
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setCurrentUserId(user?.id || null);
    };
    getUser();
  }, []);

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("Are you sure you want to delete this comment?")) return;

    setDeletingCommentId(commentId);
    try {
      await deleteComment(commentId);
      onCommentDeleted(commentId);
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setDeletingCommentId(null);
    }
  };

  const getUserAvatar = (comment: Comment) => {
    if (comment.profiles?.avatar_url) {
      return (
        <img
          src={comment.profiles.avatar_url}
          alt={getUserName(comment)}
          className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        />
      );
    }

    // Fallback initials
    const name = getUserName(comment);
    const initials = name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

    return (
      <div className="w-8 h-8 rounded-full bg-gray-500 text-white flex items-center justify-center text-sm font-medium">
        {initials}
      </div>
    );
  };

  const getUserName = (comment: Comment) => {
    if (comment.profiles?.first_name && comment.profiles?.last_name) {
      return `${comment.profiles.first_name} ${comment.profiles.last_name}`;
    }
    return "Anonymous User";
  };

  const isCommentOwner = (comment: Comment) => {
    return currentUserId && comment.profiles?.user_id === currentUserId;
  };

  if (loading) {
    return (
      <div className="space-y-3 p-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex space-x-3 animate-pulse">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-300 rounded w-1/4"></div>
              <div className="h-3 bg-gray-300 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (comments.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
        No comments yet. Be the first to comment!
      </div>
    );
  }

  return (
    <div className="space-y-3 p-3 max-h-96 overflow-y-auto">
      {comments.map((comment) => (
        <div key={comment.id} className="flex space-x-3 group">
          {getUserAvatar(comment)}

          <div className="flex-1 min-w-0">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 relative">
              {/* Comment header */}
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center space-x-2">
                  <span className="font-medium text-sm text-gray-900 dark:text-white">
                    {getUserName(comment)}
                  </span>
                  {comment.profiles?.job_title && (
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {comment.profiles.job_title}
                    </span>
                  )}
                </div>

                {/* Comment actions */}
                {isCommentOwner(comment) && (
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      disabled={deletingCommentId === comment.id}
                      className="p-1 text-gray-400 hover:text-red-500 disabled:opacity-50"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Comment content */}
              <p className="text-sm text-gray-800 dark:text-gray-200 break-words">
                {comment.content}
              </p>
            </div>

            {/* Comment timestamp */}
            <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500 dark:text-gray-400">
              <span>{timeAgo(comment.created_at)}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
