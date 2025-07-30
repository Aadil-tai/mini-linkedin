import { supabase } from "@/lib/superbase/client";

export interface Post {
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
}

export interface CreatePostData {
  content: string;
  image_url?: string;
}

// Create a new post
export async function createPost(data: CreatePostData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  console.log("Creating post for user:", user.id);
  console.log("Post data:", data);

  // First, check if user has a profile using user_id
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, user_id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    console.error("Profile not found or error:", profileError);
    throw new Error("User profile not found. Please complete your profile first.");
  }

  const { data: post, error } = await supabase
    .from("posts")
    .insert({
      profile_id: profile.id, // Use profile.id instead of user.id
      content: data.content,
      image_url: data.image_url,
      likes: 0,
      comments: 0,
      shares: 0,
      is_liked: false,
    })
    .select(`
      *,
      profiles!posts_profile_id_fkey (
        first_name,
        last_name,
        avatar_url,
        job_title
      )
    `)
    .single();

  if (error) {
    console.error("Error creating post:", error);
    throw error;
  }

  console.log("Post created successfully:", post);
  return post;
}

// Get posts for feed (with pagination)
export async function getPosts(page = 0, limit = 10) {
  const from = page * limit;
  const to = from + limit - 1;

  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles!posts_profile_id_fkey (
        id,
        user_id,
        first_name,
        last_name,
        avatar_url,
        job_title
      )
    `)
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }

  console.log("Fetched posts with profiles:", posts);
  return posts as Post[];
}

// Like/unlike a post
export async function togglePostLike(postId: string, isLiked: boolean) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Update the post likes count
  const { data: post, error: postError } = await supabase
    .from("posts")
    .select("likes")
    .eq("id", postId)
    .single();

  if (postError) {
    throw postError;
  }

  const newLikeCount = isLiked ? post.likes + 1 : Math.max(0, post.likes - 1);

  const { error } = await supabase
    .from("posts")
    .update({
      likes: newLikeCount,
      is_liked: isLiked,
    })
    .eq("id", postId);

  if (error) {
    console.error("Error updating post like:", error);
    throw error;
  }

  // Here you could also insert/delete from a post_likes table for more detailed tracking
  // For now, we're just updating the post directly

  return { likes: newLikeCount, is_liked: isLiked };
}

// Delete a post (only by the author)
export async function deletePost(postId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // First, get the user's profile to get the correct profile ID
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (profileError || !profile) {
    throw new Error("User profile not found");
  }

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("profile_id", profile.id); // Use profile.id instead of user.id

  if (error) {
    console.error("Error deleting post:", error);
    throw error;
  }

  return true;
}

// Get a single post
export async function getPost(postId: string) {
  const { data: post, error } = await supabase
    .from("posts")
    .select(`
      *,
      profiles!posts_profile_id_fkey (
        id,
        user_id,
        first_name,
        last_name,
        avatar_url,
        job_title
      )
    `)
    .eq("id", postId)
    .single();

  if (error) {
    console.error("Error fetching post:", error);
    throw error;
  }

  return post as Post;
}
