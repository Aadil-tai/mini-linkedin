import { supabase } from "@/lib/supabase/client";

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

export type PostFilterType = 'latest' | 'popular' | 'trending' | 'oldest';

export interface PostFilters {
  filter?: PostFilterType;
  dateRange?: {
    from?: string;
    to?: string;
  };
  authorId?: string;
}

// Create a new post
export async function createPost(data: CreatePostData) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

 

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

 
  return post;
}

// Get posts for feed (with pagination and filtering)
export async function getPosts(page = 0, limit = 10, filters?: PostFilters) {
  const from = page * limit;
  const to = from + limit - 1;

  let query = supabase
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
    `);

  // Apply filters
  if (filters) {
    // Author filter
    if (filters.authorId) {
      query = query.eq("profile_id", filters.authorId);
    }

    // Date range filter
    if (filters.dateRange) {
      if (filters.dateRange.from) {
        query = query.gte("created_at", filters.dateRange.from);
      }
      if (filters.dateRange.to) {
        query = query.lte("created_at", filters.dateRange.to);
      }
    }

    // Sorting based on filter type
    switch (filters.filter) {
      case 'latest':
        query = query.order("created_at", { ascending: false });
        break;
      case 'oldest':
        query = query.order("created_at", { ascending: true });
        break;
      case 'popular':
        // Sort by likes count, then by creation date
        query = query.order("likes", { ascending: false })
                    .order("created_at", { ascending: false });
        break;
      case 'trending':
        // Sort by engagement (likes + comments + shares), then by recent activity
        // For trending, we prioritize posts with high engagement from the last 7 days
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        query = query.gte("created_at", sevenDaysAgo.toISOString())
                    .order("likes", { ascending: false })
                    .order("comments", { ascending: false })
                    .order("shares", { ascending: false })
                    .order("created_at", { ascending: false });
        break;
      default:
        // Default to latest
        query = query.order("created_at", { ascending: false });
    }
  } else {
    // Default sorting - latest posts first
    query = query.order("created_at", { ascending: false });
  }

  // Apply pagination
  query = query.range(from, to);

  const { data: posts, error } = await query;

  if (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }

 
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

// Get latest posts (server action)
export async function getLatestPosts(page = 0, limit = 10) {
  return getPosts(page, limit, { filter: 'latest' });
}

// Get popular posts (server action)
export async function getPopularPosts(page = 0, limit = 10) {
  return getPosts(page, limit, { filter: 'popular' });
}

// Get trending posts (server action)
export async function getTrendingPosts(page = 0, limit = 10) {
  return getPosts(page, limit, { filter: 'trending' });
}

// Get oldest posts (server action)
export async function getOldestPosts(page = 0, limit = 10) {
  return getPosts(page, limit, { filter: 'oldest' });
}

// Get posts by date range (server action)
export async function getPostsByDateRange(
  from: string,
  to: string,
  page = 0,
  limit = 10
) {
  return getPosts(page, limit, {
    filter: 'latest',
    dateRange: { from, to }
  });
}

// Get posts by author (server action)
export async function getPostsByAuthor(
  authorId: string,
  page = 0,
  limit = 10,
  filter: PostFilterType = 'latest'
) {
  return getPosts(page, limit, {
    filter,
    authorId
  });
}

// Get recent posts for sidebar (server action)
export async function getRecentPostsForSidebar(limit = 5) {
  const { data: posts, error } = await supabase
    .from("posts")
    .select(`
      id,
      content,
      created_at,
      profiles!posts_profile_id_fkey (
        first_name,
        last_name,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent posts for sidebar:", error);
    throw error;
  }

  return posts;
}

// Advanced filtering function for complex queries (server action)
export async function getFilteredPosts(options: {
  page?: number;
  limit?: number;
  filter?: PostFilterType;
  search?: string;
  minLikes?: number;
  maxLikes?: number;
  authorIds?: string[];
  excludeAuthorIds?: string[];
  dateRange?: {
    from?: string;
    to?: string;
  };
  tags?: string[];
}) {
  const {
    page = 0,
    limit = 10,
    filter = 'latest',
    search,
    minLikes,
    maxLikes,
    authorIds,
    excludeAuthorIds,
    dateRange,
  } = options;

  const from = page * limit;
  const to = from + limit - 1;

  let query = supabase
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
    `);

  // Text search in content
  if (search) {
    query = query.ilike("content", `%${search}%`);
  }

  // Likes range filter
  if (minLikes !== undefined) {
    query = query.gte("likes", minLikes);
  }
  if (maxLikes !== undefined) {
    query = query.lte("likes", maxLikes);
  }

  // Author filters
  if (authorIds && authorIds.length > 0) {
    query = query.in("profile_id", authorIds);
  }
  if (excludeAuthorIds && excludeAuthorIds.length > 0) {
    query = query.not("profile_id", "in", `(${excludeAuthorIds.join(",")})`);
  }

  // Date range filter
  if (dateRange) {
    if (dateRange.from) {
      query = query.gte("created_at", dateRange.from);
    }
    if (dateRange.to) {
      query = query.lte("created_at", dateRange.to);
    }
  }

  // Apply sorting based on filter type
  switch (filter) {
    case 'latest':
      query = query.order("created_at", { ascending: false });
      break;
    case 'oldest':
      query = query.order("created_at", { ascending: true });
      break;
    case 'popular':
      query = query.order("likes", { ascending: false })
                  .order("created_at", { ascending: false });
      break;
    case 'trending':
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      query = query.gte("created_at", sevenDaysAgo.toISOString())
                  .order("likes", { ascending: false })
                  .order("comments", { ascending: false })
                  .order("shares", { ascending: false })
                  .order("created_at", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  // Apply pagination
  query = query.range(from, to);

  const { data: posts, error } = await query;

  if (error) {
    console.error("Error fetching filtered posts:", error);
    throw error;
  }

  return posts as Post[];
}
