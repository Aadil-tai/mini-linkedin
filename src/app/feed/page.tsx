// app/feed/page.tsx
"use client";
import { useState, useCallback } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import PostCard from "@/components/common/PostCard";
import { dummyPosts } from "@/lib/data/dummyPost";

export default function FeedPage() {
  const [posts, setPosts] = useState(dummyPosts);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const startIdx = (nextPage - 1) * 5;
    const endIdx = nextPage * 5;

    if (startIdx >= dummyPosts.length) {
      setHasMore(false);
      return;
    }

    const newPosts = dummyPosts.slice(startIdx, endIdx);
    setPosts((prev) => [...prev, ...newPosts]);
    setPage(nextPage);
    setHasMore(endIdx < dummyPosts.length);
  }, [page]);

  return (
    // <FeedLayout>
    <div className="max-w-3xl mx-auto">
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
            You've seen all posts!
          </p>
        }
      >
        <section className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </section>
      </InfiniteScroll>
    </div>
    // </FeedLayout>
  );
}
