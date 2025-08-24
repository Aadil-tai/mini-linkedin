import { useState, useCallback } from "react";
import { getPosts, createPost, togglePostLike, deletePost } from "@/lib/supabase/postActions";
import type { Post, CreatePostData } from "@/lib/supabase/postActions";

export const usePosts = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPosts = useCallback(async (page = 0, limit = 10) => {
    try {
      setLoading(true);
      setError(null);
      const fetchedPosts = await getPosts(page, limit);
      
      if (page === 0) {
        setPosts(fetchedPosts);
      } else {
        setPosts(prev => [...prev, ...fetchedPosts]);
      }
      
      return fetchedPosts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load posts";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const addPost = useCallback(async (postData: CreatePostData) => {
    try {
      setError(null);
      const newPost = await createPost(postData);
      setPosts(prev => [newPost, ...prev]);
      return newPost;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create post";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const likePost = useCallback(async (postId: string, isLiked: boolean) => {
    try {
      setError(null);
      const result = await togglePostLike(postId, isLiked);
      
      setPosts(prev => 
        prev.map(post => 
          post.id === postId 
            ? { ...post, likes: result.likes, is_liked: result.is_liked }
            : post
        )
      );
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update like";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const removePost = useCallback(async (postId: string) => {
    try {
      setError(null);
      await deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete post";
      setError(errorMessage);
      throw err;
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    posts,
    loading,
    error,
    loadPosts,
    addPost,
    likePost,
    removePost,
    clearError,
  };
};
