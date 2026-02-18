"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { client } from "@/sanity/client";
import { Post } from "@/sanity/types";
import { PostCard } from "./PostCard";
import { Loader2 } from "lucide-react";

const POSTS_PER_PAGE = 6;

export function InfinitePosts({ initialPosts }: { initialPosts: Post[] }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);
  
  // Use the last post's data for pagination
  const lastPost = posts.length > 0 ? posts[posts.length - 1] : null;
  const lastPublishedAt = lastPost?.publishedAt;
  const lastId = lastPost?._id;

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "400px", // Trigger earlier
  });

  const fetchMorePosts = useCallback(async () => {
    if (isLoading || !hasMore || !lastPublishedAt || !lastId) return;

    setIsLoading(true);
    console.log("Fetching more posts starting from:", lastPublishedAt);
    
    // Improved query using publishedAt and _id as a tie-breaker for absolute uniqueness
    const NEXT_POSTS_QUERY = `
      *[
        _type == "post" && 
        defined(slug.current) && 
        (publishedAt < $lastPublishedAt || (publishedAt == $lastPublishedAt && _id < $lastId))
      ] | order(publishedAt desc, _id desc)[0...${POSTS_PER_PAGE}] {
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
        lastId
      });

      console.log(`Fetched ${nextPosts.length} more posts.`);

      if (nextPosts.length > 0) {
        setPosts((prev) => [...prev, ...nextPosts]);
        setHasMore(nextPosts.length === POSTS_PER_PAGE);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching more posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, lastPublishedAt, lastId]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      fetchMorePosts();
    }
  }, [inView, hasMore, isLoading, fetchMorePosts]);

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={`${post._id}-${index}`} post={post} index={index} />
        ))}
      </div>

      {/* Sentinel element for infinite scroll */}
      <div ref={ref} className="mt-12 flex min-h-[100px] flex-col items-center justify-center py-12">
        {isLoading ? (
          <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-indigo-400 backdrop-blur-2xl shadow-2xl">
            <Loader2 className="animate-spin" size={24} />
            <span className="text-sm font-bold uppercase tracking-[0.2em]">Baking fresh stories...</span>
          </div>
        ) : hasMore ? (
          <div className="h-1 w-1 opacity-0" /> /* Invisible sentinel when not loading but more to fetch */
        ) : posts.length > 0 ? (
          <div className="flex flex-col items-center gap-4 text-slate-500">
            <div className="h-px w-24 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
            <p className="italic text-sm tracking-wide">You've reached the bottom of our bakery oven.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
