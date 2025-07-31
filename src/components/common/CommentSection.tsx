"use client";

import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { getComments } from "@/lib/superbase/commentActions";
import type { Comment } from "@/lib/superbase/commentActions";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

interface CommentSectionProps {
  postId: string;
  initialCommentCount?: number;
  isExpanded: boolean;
  onToggle: () => void;
  onCommentCountChange: (count: number) => void;
}

export default function CommentSection({
  postId,
  initialCommentCount = 0,
  isExpanded,
  onToggle,
  onCommentCountChange,
}: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  // Load comments when section is expanded
  useEffect(() => {
    if (isExpanded && comments.length === 0) {
      loadComments();
    }
  }, [isExpanded]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const fetchedComments = await getComments(postId);
      setComments(fetchedComments);
      setCommentCount(fetchedComments.length);
      onCommentCountChange(fetchedComments.length);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCommentCreated = (newComment: Comment) => {
    setComments((prev) => [...prev, newComment]);
    const newCount = commentCount + 1;
    setCommentCount(newCount);
    onCommentCountChange(newCount);
  };

  const handleCommentDeleted = (commentId: string) => {
    setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    const newCount = commentCount - 1;
    setCommentCount(newCount);
    onCommentCountChange(newCount);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700">
      {/* Comment toggle header */}
      {commentCount > 0 && !isExpanded && (
        <button
          onClick={onToggle}
          className="w-full p-3 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200 flex items-center justify-between"
        >
          <span>
            View {commentCount === 1 ? "1 comment" : `${commentCount} comments`}
          </span>
          <ChevronDown className="w-4 h-4" />
        </button>
      )}

      {/* Expanded comment section */}
      {isExpanded && (
        <div className="bg-gray-50 dark:bg-gray-800">
          {/* Collapse button */}
          {commentCount > 0 && (
            <button
              onClick={onToggle}
              className="w-full p-3 text-left text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 flex items-center justify-between"
            >
              <span>
                Hide{" "}
                {commentCount === 1 ? "1 comment" : `${commentCount} comments`}
              </span>
              <ChevronUp className="w-4 h-4" />
            </button>
          )}

          {/* Comments list */}
          <CommentList
            comments={comments}
            onCommentDeleted={handleCommentDeleted}
            loading={loading}
          />

          {/* Comment form */}
          <CommentForm
            postId={postId}
            onCommentCreated={handleCommentCreated}
            autoFocus={comments.length === 0} // Auto-focus if no comments yet
          />
        </div>
      )}

      {/* Show comment form immediately if no comments exist and section is expanded */}
      {isExpanded && commentCount === 0 && !loading && (
        <div className="bg-gray-50 dark:bg-gray-800">
          <CommentForm
            postId={postId}
            onCommentCreated={handleCommentCreated}
            autoFocus={true}
            placeholder="Be the first to comment..."
          />
        </div>
      )}
    </div>
  );
}
