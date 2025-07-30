import {
  getLatestPosts,
  getPopularPosts,
  getTrendingPosts,
} from "@/lib/superbase/postActions";
import PostCard from "@/components/common/PostCard";
import { Suspense } from "react";

// Server component that fetches latest posts
export async function LatestPostsServer({ limit = 10 }: { limit?: number }) {
  try {
    const posts = await getLatestPosts(0, limit);

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Latest Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No posts found
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in LatestPostsServer:", error);
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-8">
        Failed to load latest posts
      </div>
    );
  }
}

// Server component that fetches popular posts
export async function PopularPostsServer({ limit = 10 }: { limit?: number }) {
  try {
    const posts = await getPopularPosts(0, limit);

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Popular Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No popular posts found
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in PopularPostsServer:", error);
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-8">
        Failed to load popular posts
      </div>
    );
  }
}

// Server component that fetches trending posts
export async function TrendingPostsServer({ limit = 10 }: { limit?: number }) {
  try {
    const posts = await getTrendingPosts(0, limit);

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Trending Posts
        </h2>
        {posts.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No trending posts found
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </div>
    );
  } catch (error) {
    console.error("Error in TrendingPostsServer:", error);
    return (
      <div className="text-red-500 dark:text-red-400 text-center py-8">
        Failed to load trending posts
      </div>
    );
  }
}

// Wrapper component with loading states
export function PostsServerWrapper({
  type = "latest",
  limit = 10,
}: {
  type?: "latest" | "popular" | "trending";
  limit?: number;
}) {
  const LoadingSpinner = () => (
    <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <Suspense fallback={<LoadingSpinner />}>
      {type === "latest" && <LatestPostsServer limit={limit} />}
      {type === "popular" && <PopularPostsServer limit={limit} />}
      {type === "trending" && <TrendingPostsServer limit={limit} />}
    </Suspense>
  );
}
