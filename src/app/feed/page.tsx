// app/feed/page.tsx
"use client";
import { useState, useCallback, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "@/components/common/PostCard";
import CreatePost from "@/components/feed/CreatePost";
import PostFilters from "@/components/feed/PostFilters";
import { getPosts, PostFilterType } from "@/lib/superbase/postActions";
import type { Post } from "@/lib/superbase/postActions";

export default function FeedPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]); // Store all loaded posts
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]); // Display filtered posts
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<PostFilterType>("latest");

  // Load initial posts
  useEffect(() => {
    loadInitialPosts();
  }, []); // Only load once on mount

  // Apply client-side filtering when filter changes
  useEffect(() => {
    applyClientSideFilter();
  }, [activeFilter, allPosts]);

  const loadInitialPosts = async () => {
    try {
      setInitialLoading(true);
      // Load with 'latest' filter to get all posts in chronological order
      const initialPosts = await getPosts(0, 10, { filter: "latest" });
      setAllPosts(initialPosts);
      setPage(0);
      setHasMore(initialPosts.length === 10);
    } catch (error) {
      console.error("Error loading initial posts:", error);
    } finally {
      setInitialLoading(false);
    }
  };

  // Client-side filtering function
  const applyClientSideFilter = () => {
    let sorted = [...allPosts];

    switch (activeFilter) {
      case "latest":
        sorted.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        break;
      case "oldest":
        sorted.sort(
          (a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
        break;
      case "popular":
        sorted.sort((a, b) => {
          if (b.likes !== a.likes) return b.likes - a.likes;
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        break;
      case "trending":
        // For trending: posts from last 7 days with high engagement
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        sorted = sorted.filter(
          (post) => new Date(post.created_at) >= sevenDaysAgo
        );
        sorted.sort((a, b) => {
          const engagementA = a.likes + a.comments + a.shares;
          const engagementB = b.likes + b.comments + b.shares;
          if (engagementB !== engagementA) return engagementB - engagementA;
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
        });
        break;
    }

    setFilteredPosts(sorted);
  };

  const loadMore = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);
      const nextPage = page + 1;
      // Always load with 'latest' to maintain chronological order in allPosts
      const newPosts = await getPosts(nextPage, 10, { filter: "latest" });

      if (newPosts.length === 0) {
        setHasMore(false);
        return;
      }

      setAllPosts((prev) => [...prev, ...newPosts]);
      setPage(nextPage);
      setHasMore(newPosts.length === 10);
    } catch (error) {
      console.error("Error loading more posts:", error);
    } finally {
      setLoading(false);
    }
  }, [page, loading]); // Removed activeFilter dependency

  const handleNewPost = (newPost: Post) => {
    setAllPosts((prev) => [newPost, ...prev]);
  };

  const handlePostDeleted = (deletedPostId: string) => {
    setAllPosts((prev) => prev.filter((post) => post.id !== deletedPostId));
  };

  const handlePostUpdated = (updatedPost: Post) => {
    setAllPosts((prev) =>
      prev.map((post) =>
        post.id === updatedPost.id ? { ...post, ...updatedPost } : post
      )
    );
  };

  const handleFilterChange = (filter: PostFilterType) => {
    setActiveFilter(filter);
    // No need to clear posts or reload - client-side filtering will handle it
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
    <div className="max-w-3xl mx-auto lg:p-4">
      {/* Create Post Section */}
      <div className="mb-6">
        <CreatePost onPostCreated={handleNewPost} />
      </div>

      {/* Post Filters */}
      <PostFilters
        activeFilter={activeFilter}
        onFilterChange={handleFilterChange}
      />

      {/* Posts Feed */}
      <InfiniteScroll
        dataLength={filteredPosts.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        }
        endMessage={
          <p className="text-center py-4 text-gray-500">
            {filteredPosts.length === 0
              ? "No posts yet. Create the first one!"
              : "You've seen all posts!"}
          </p>
        }
      >
        <section className="space-y-4">
          {filteredPosts.map((post, index) => (
            <div
              key={post.id}
              className="transform transition-all duration-300 ease-in-out"
              style={{
                animationDelay: `${index * 50}ms`,
                animation: "fadeInUp 0.3s ease-out forwards",
              }}
            >
              <PostCard post={post} onPostDeleted={handlePostDeleted} />
            </div>
          ))}
        </section>
      </InfiniteScroll>
    </div>
  );
}
