"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send } from "lucide-react";
import { createComment } from "@/lib/supabase/commentActions";
import type { Comment } from "@/lib/supabase/commentActions";
import { useProfile } from "@/hooks/userProfile";

// Validation schema for comments
const commentSchema = z.object({
  content: z
    .string()
    .min(1, "Comment cannot be empty")
    .max(500, "Comment is too long"),
});

type CommentFormData = z.infer<typeof commentSchema>;

interface CommentFormProps {
  postId: string;
  onCommentCreated: (comment: Comment) => void;
  placeholder?: string;
  autoFocus?: boolean;
}

export default function CommentForm({
  postId,
  onCommentCreated,
  placeholder = "Write a comment...",
  autoFocus = false,
}: CommentFormProps) {
  const { profile } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<CommentFormData>({
    resolver: zodResolver(commentSchema),
    defaultValues: {
      content: "",
    },
  });

  const commentContent = watch("content");

  const onSubmit = async (data: CommentFormData) => {
    try {
      const newComment = await createComment({
        post_id: postId,
        content: data.content.trim(),
      });

      onCommentCreated(newComment);
      reset();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Failed to post comment. Please try again.");
    }
  };

  // Get user avatar
  const getUserAvatar = () => {
    if (profile?.avatar_url) {
      return (
        <img
          src={profile.avatar_url}
          alt="Your avatar"
          className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-200 dark:ring-gray-700"
        />
      );
    }

    // Fallback initials
    const initials =
      profile?.first_name && profile?.last_name
        ? `${profile.first_name[0]}${profile.last_name[0]}`
        : "U";

    return (
      <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium">
        {initials}
      </div>
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-start space-x-3 p-3 border-t border-gray-200 dark:border-gray-700"
    >
      {getUserAvatar()}

      <div className="flex-1 space-y-2">
        <div className="flex space-x-2">
          <div className="flex-1 relative">
            <input
              {...register("content")}
              type="text"
              placeholder={placeholder}
              autoFocus={autoFocus}
              className={`w-full bg-gray-100 dark:bg-gray-700 border-0 rounded-full px-4 py-2 text-sm placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                errors.content ? "ring-2 ring-red-500" : ""
              }`}
              disabled={isSubmitting}
            />
            {commentContent && (
              <button
                type="submit"
                disabled={isSubmitting || !commentContent.trim()}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <Send className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        {errors.content && (
          <p className="text-red-500 text-xs px-4">{errors.content.message}</p>
        )}
      </div>
    </form>
  );
}
