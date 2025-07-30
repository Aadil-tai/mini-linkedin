import { supabase } from "./client";

export interface SearchResult {
  type: 'user' | 'post';
  id: string;
  title: string;
  subtitle?: string;
  avatar_url?: string;
  content?: string;
  created_at?: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    job_title?: string;
    avatar_url?: string;
    skills?: string[];
  };
}

export async function searchUsers(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        full_name,
        job_title,
        avatar_url,
        skills,
        company,
        bio
      `)
      .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,full_name.ilike.%${query}%,job_title.ilike.%${query}%,company.ilike.%${query}%`)
      .limit(10);

    if (error) throw error;

    return profiles?.map(profile => ({
      type: 'user' as const,
      id: profile.id,
      title: profile.first_name && profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`
        : profile.full_name || 'User',
      subtitle: profile.job_title || profile.company || 'Professional',
      avatar_url: profile.avatar_url,
      profile: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        job_title: profile.job_title,
        avatar_url: profile.avatar_url,
        skills: profile.skills
      }
    })) || [];
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

export async function searchBySkills(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select(`
        id,
        user_id,
        first_name,
        last_name,
        full_name,
        job_title,
        avatar_url,
        skills,
        company
      `)
      .contains('skills', [query])
      .limit(10);

    if (error) throw error;

    return profiles?.map(profile => ({
      type: 'user' as const,
      id: profile.id,
      title: profile.first_name && profile.last_name 
        ? `${profile.first_name} ${profile.last_name}`
        : profile.full_name || 'User',
      subtitle: `Has skill: ${query} • ${profile.job_title || profile.company || 'Professional'}`,
      avatar_url: profile.avatar_url,
      profile: {
        first_name: profile.first_name,
        last_name: profile.last_name,
        job_title: profile.job_title,
        avatar_url: profile.avatar_url,
        skills: profile.skills
      }
    })) || [];
  } catch (error) {
    console.error('Error searching by skills:', error);
    return [];
  }
}

export async function searchPosts(query: string): Promise<SearchResult[]> {
  if (!query.trim()) return [];

  try {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        id,
        content,
        image_url,
        created_at,
        profile_id,
        profiles:profile_id (
          id,
          first_name,
          last_name,
          full_name,
          job_title,
          avatar_url,
          company
        )
      `)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) throw error;

    return posts?.map(post => {
      // Handle both single profile object and array of profiles
      const profile = Array.isArray(post.profiles) ? post.profiles[0] : post.profiles;
      
      return {
        type: 'post' as const,
        id: post.id,
        title: post.content?.slice(0, 100) + (post.content && post.content.length > 100 ? '...' : '') || 'Post',
        subtitle: `By ${
          profile?.first_name && profile?.last_name 
            ? `${profile.first_name} ${profile.last_name}`
            : profile?.full_name || 'User'
        } • ${new Date(post.created_at!).toLocaleDateString()}`,
        avatar_url: profile?.avatar_url,
        content: post.content,
        created_at: post.created_at,
        profile: {
          first_name: profile?.first_name,
          last_name: profile?.last_name,
          job_title: profile?.job_title,
          avatar_url: profile?.avatar_url
        }
      };
    }) || [];
  } catch (error) {
    console.error('Error searching posts:', error);
    return [];
  }
}

export async function performSearch(query: string): Promise<{
  users: SearchResult[];
  skills: SearchResult[];
  posts: SearchResult[];
}> {
  if (!query.trim()) {
    return { users: [], skills: [], posts: [] };
  }

  try {
    const [users, posts] = await Promise.all([
      searchUsers(query),
      searchPosts(query)
    ]);

    // Also search for users with matching skills
    const skillMatches = await searchBySkills(query);

    return {
      users,
      skills: skillMatches,
      posts
    };
  } catch (error) {
    console.error('Error performing search:', error);
    return { users: [], skills: [], posts: [] };
  }
}
