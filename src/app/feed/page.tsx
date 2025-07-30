// app/feed/page.tsx
"use client";
import { useState, useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "@/components/common/PostCard";
import CreatePost from "@/components/feed/CreatePost";
import { getPosts } from "@/lib/superbase/postActions";
import { useProfile } from "@/hooks/userProfile";
import type { Post } from "@/lib/superbase/postActions";

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // Get current user's profile
  const {
    profile: userProfile,
    loading: profileLoading,
    error: profileError,
  } = useProfile();

  // Debug: Log profile data
  console.log("Feed page - userProfile:", userProfile);
  console.log("Feed page - profileLoading:", profileLoading);
  console.log("Feed page - profileError:", profileError);

  // Load initial posts
  useEffect(() => {
    loadInitialPosts();
  }, []);

  const loadInitialPosts = async () => {
    try {
      setInitialLoading(true);
      const initialPosts = await getPosts(0, 10);
      setPosts(initialPosts);
      setPage(0);
      setHasMore(initialPosts.length === 10);
    } catch (error) {
      console.error("Error loading initial posts:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  const loadMore = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      const newPosts = await getPosts(nextPage, 10);

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === 10);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]);

  const handleNewPost = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (deletedPostId: string) => {
    setPosts((prev) => prev.filter((post) => post.id !== deletedPostId));
  };

  if (initialLoading) {
    return (
      <div className="max-w-3xl mx-auto p-4">
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      {/* Create Post Section */}
      <div className="mb-6">
        <CreatePost
          onPostCreated={handleNewPost}
          userProfile={
            userProfile
              ? {
                  avatar_url: userProfile.avatar_url,
                  first_name: userProfile.first_name,
                  last_name: userProfile.last_name,
                  job_title: userProfile.job_title,
                }
              : undefined
          }
        />
      </div>

      {/* Posts Feed */}
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        }
        endMessage={
          <p className="text-center py-4 text-gray-500">
            {posts.length === 0
              ? "No posts yet. Create the first one!"
              : "You've seen all posts!"}
          </p>
        }
      >
        <section className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onPostDeleted={handlePostDeleted}
            />
          ))}
        </section>
      </InfiniteScroll>
    </div>
  );
}
