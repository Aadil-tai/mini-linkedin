import { supabase } from "@/lib/supabase/client";

export interface Comment {
  id: string;
  post_id: string;
  profile_id: string;
  content: string;
  created_at: string;
  profiles?: {
    id?: string;
    user_id?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    job_title?: string;
  };
}

export interface CreateCommentData {
  post_id: string;
  content: string;
}

// Get comments for a specific post
export async function getComments(postId: string): Promise<Comment[]> {
  const { data: comments, error } = await supabase
    .from("post_interactions")
    .select(`
      id,
      post_id,
      profile_id,
      content,
      created_at,
      profiles!post_interactions_profile_id_fkey (
        id,
        user_id,
        first_name,
        last_name,
        avatar_url,
        job_title
      )
    `)
    .eq("post_id", postId)
    .eq("type", "comment")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }

  return comments as Comment[];
}

// Create a new comment
export async function createComment(data: CreateCommentData): Promise<Comment> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, user_id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Profile not found or error:", profileError);
    throw new Error("User profile not found. Please complete your profile first.");
  }

  // Create the comment
  const { data: comment, error } = await supabase
    .from("post_interactions")
    .insert({
      post_id: data.post_id,
      profile_id: profile.id,
      type: "comment",
      content: data.content,
    })
    .select(`
      id,
      post_id,
      profile_id,
      content,
      created_at,
      profiles!post_interactions_profile_id_fkey (
        id,
        user_id,
        first_name,
        last_name,
        avatar_url,
        job_title
      )
    `)
    .single();

  if (error) {
    console.error("Error creating comment:", error);
    throw error;
  }

  // Update the post's comment count
  await updatePostCommentCount(data.post_id);

  return comment as Comment;
}

// Delete a comment (only by the author)
export async function deleteComment(commentId: string): Promise<boolean> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Get user's profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("User profile not found");
  }

  // Get the comment to check ownership and get post_id
  const { data: comment, error: commentError } = await supabase
    .from("post_interactions")
    .select("post_id, profile_id")
    .eq("id", commentId)
    .eq("type", "comment")
    .single();

  if (commentError || !comment) {
    throw new Error("Comment not found");
  }

  // Check if user owns the comment
  if (comment.profile_id !== profile.id) {
    throw new Error("You can only delete your own comments");
  }

  // Delete the comment
  const { error } = await supabase
    .from("post_interactions")
    .delete()
    .eq("id", commentId)
    .eq("profile_id", profile.id);

  if (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }

  // Update the post's comment count
  await updatePostCommentCount(comment.post_id);

  return true;
}

// Update post comment count
async function updatePostCommentCount(postId: string): Promise<void> {
  // Count comments for this post
  const { count, error: countError } = await supabase
    .from("post_interactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("type", "comment");

  if (countError) {
    console.error("Error counting comments:", countError);
    return;
  }

  // Update the post's comment count
  const { error: updateError } = await supabase
    .from("posts")
    .update({ comments: count || 0 })
    .eq("id", postId);

  if (updateError) {
    console.error("Error updating post comment count:", updateError);
  }
}

// Get comment count for a post
export async function getCommentCount(postId: string): Promise<number> {
  const { count, error } = await supabase
    .from("post_interactions")
    .select("*", { count: "exact", head: true })
    .eq("post_id", postId)
    .eq("type", "comment");

  if (error) {
    console.error("Error getting comment count:", error);
    return 0;
  }

  return count || 0;
}
