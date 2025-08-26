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
    full_name?: string;
    avatar_url?: string;
    job_title?: string;
  };
}
