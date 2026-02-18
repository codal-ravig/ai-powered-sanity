"use client";

import { useState, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { client } from "@/sanity/client";
import { Post } from "@/sanity/types";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";

const POSTS_PER_PAGE = 6;

export function InfinitePosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [lastPublishedAt, setLastPublishedAt] = useState<string | null>(
    initialPosts.length > 0 ? initialPosts[initialPosts.length - 1].publishedAt || null : null
  );
  const [hasMore, setHasMore] = useState(initialPosts.length === 12); // Initial fetch was 12
  const [isLoading, setIsLoading] = useState(false);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: "200px",
  });

  const fetchMorePosts = async () => {
    if (isLoading || !hasMore || !lastPublishedAt) return;

    setIsLoading(true);
    
    const NEXT_POSTS_QUERY = `
      *[_type == "post" && defined(slug.current) && publishedAt < $lastPublishedAt] | order(publishedAt desc)[0...${POSTS_PER_PAGE}] {
        _id,
        title,
        slug,
        publishedAt,
        "author": author->{name, slug, "image": image.asset->url, imageUrl},
        "location": location->{name, slug, "image": image.asset->url, imageUrl},
        "mainImage": mainImage.asset->url,
        imageUrl,
        "categories": categories[]->{title, slug}
      }
    `;

    try {
      const nextPosts = await client.fetch<Post[]>(NEXT_POSTS_QUERY, {
        lastPublishedAt,
      });

      if (nextPosts.length > 0) {
        setPosts((prev) => [...prev, ...nextPosts]);
        setLastPublishedAt(nextPosts[nextPosts.length - 1].publishedAt || null);
        setHasMore(nextPosts.length === POSTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (inView && hasMore) {
      fetchMorePosts();
    }
  }, [inView, hasMore]);

  return (
    <>
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={post._id} post={post} index={index} />
        ))}
      </div>

      {hasMore && (
        <div ref={ref} className="mt-16 flex justify-center py-8">
          {isLoading && (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-indigo-400 backdrop-blur-xl animate-pulse">
              <Loader2 className="animate-spin" size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Baking more stories...</span>
            </div>
          )}
        </div>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="mt-16 text-center text-slate-500 italic text-sm">
          You've reached the bottom of our bakery oven.
        </p>
      )}
    </>
  );
}
