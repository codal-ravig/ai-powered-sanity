"use client";

import { useState, useEffect, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { client } from "@/sanity/client";
import { INITIAL_POSTS_QUERY_RESULT } from "@/sanity/types";
import { PostCard } from "./PostCard";
import { Loader2, Search, X } from "lucide-react";

const POSTS_PER_PAGE = 6;

export function InfinitePosts({ initialPosts }: { initialPosts: INITIAL_POSTS_QUERY_RESULT }) {
  const [posts, setPosts] = useState<INITIAL_POSTS_QUERY_RESULT>(initialPosts);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialPosts.length >= 12);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFiltering, setIsFiltering] = useState(false);
  
  const lastPost = posts.length > 0 ? posts[posts.length - 1] : null;
  const lastPublishedAt = lastPost?.publishedAt;
  const lastId = lastPost?._id;

  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "400px",
  });

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
        setPosts(initialPosts);
        setHasMore(initialPosts.length >= 12);
        setIsFiltering(false);
        return;
    }

    setIsLoading(true);
    setIsFiltering(true);
    
    const SEARCH_QUERY = `
      *[_type == "post" && defined(slug.current) && (title match $searchQuery || author->name match $searchQuery || categories[]->title match $searchQuery)] | order(publishedAt desc, _id desc)[0...${POSTS_PER_PAGE}] {
        _id,
        title,
        slug,
        publishedAt,
        "author": author->{_id, name, slug, "image": image.asset->url, imageUrl},
        "location": location->{_id, name, slug, "image": image.asset->url, imageUrl},
        "mainImage": mainImage.asset->url,
        imageUrl,
        "categories": categories[]->{_id, title, "slug": slug.current}
      }
    `;

    try {
      const filteredPosts = await client.fetch<INITIAL_POSTS_QUERY_RESULT>(SEARCH_QUERY, {
        searchQuery: `*${searchQuery}*`,
      });
      setPosts(filteredPosts);
      setHasMore(filteredPosts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error("Error searching posts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSearchQuery("");
    setPosts(initialPosts);
    setHasMore(initialPosts.length >= 12);
    setIsFiltering(false);
  };

  const fetchMorePosts = useCallback(async () => {
    if (isLoading || !hasMore || !lastPublishedAt || !lastId || isFiltering) return;

    setIsLoading(true);
    
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
        "author": author->{_id, name, slug, "image": image.asset->url, imageUrl},
        "location": location->{_id, name, slug, "image": image.asset->url, imageUrl},
        "mainImage": mainImage.asset->url,
        imageUrl,
        "categories": categories[]->{_id, title, "slug": slug.current}
      }
    `;

    try {
      const nextPosts = await client.fetch<INITIAL_POSTS_QUERY_RESULT>(NEXT_POSTS_QUERY, {
        lastPublishedAt,
        lastId
      });

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
  }, [isLoading, hasMore, lastPublishedAt, lastId, isFiltering]);

  useEffect(() => {
    if (inView && hasMore && !isLoading && !isFiltering) {
      fetchMorePosts();
    }
  }, [inView, hasMore, isLoading, fetchMorePosts, isFiltering]);

  return (
    <div className="flex flex-col gap-10">
      <div className="flex justify-center mb-12">
        <form onSubmit={handleSearch} className="relative w-full max-w-xl group">
            <input
                type="text"
                placeholder="Search bakery stories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-6 py-5 pl-14 text-sm text-white placeholder-slate-500 outline-none transition-all focus:border-indigo-500/50 focus:ring-4 focus:ring-indigo-500/10"
            />
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors" size={20} />
            
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                {searchQuery && (
                    <button 
                        type="button"
                        onClick={handleReset}
                        className="p-1 text-slate-500 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                )}
                <button 
                    type="submit"
                    className="rounded-xl bg-indigo-500 px-5 py-2 text-xs font-bold uppercase tracking-widest text-white hover:bg-indigo-400 transition-all active:scale-95 shadow-md shadow-indigo-500/20"
                >
                    Find
                </button>
            </div>
        </form>
      </div>

      {isFiltering && (
        <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-4">
            <p className="text-slate-400 text-sm font-medium">Showing fresh results for <span className="text-indigo-400 font-bold underline underline-offset-4 decoration-indigo-500/30">"{searchQuery}"</span></p>
            <button onClick={handleReset} className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 hover:text-indigo-300 transition-colors">Clear Filter</button>
        </div>
      )}

      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <PostCard key={`${post._id}-${index}`} post={post as any} index={index} />
        ))}
      </div>

      {!isFiltering && (
        <div ref={ref} className="mt-12 flex min-h-[100px] flex-col items-center justify-center py-12">
            {isLoading ? (
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-indigo-400 backdrop-blur-2xl shadow-xl transition-all">
                <Loader2 className="animate-spin" size={24} />
                <span className="text-sm font-black uppercase tracking-[0.2em]">Baking more stories...</span>
            </div>
            ) : hasMore ? (
            <div className="h-1 w-1 opacity-0" />
            ) : posts.length > 0 ? (
            <div className="flex flex-col items-center gap-4 text-slate-500">
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-slate-800 to-transparent" />
                <p className="italic text-sm font-medium">That's the last tray from our oven!</p>
            </div>
            ) : null}
        </div>
      )}

      {isFiltering && posts.length === 0 && (
        <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-white/5 bg-white/2">
            <div className="mx-auto w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-slate-600 mb-6">
                <Search size={40} />
            </div>
            <p className="text-2xl text-slate-500 font-medium italic mb-8">No fresh stories matched your search.</p>
            <button onClick={handleReset} className="px-8 py-3 rounded-full bg-indigo-500 text-white font-bold text-sm uppercase tracking-widest hover:bg-indigo-400 transition-all shadow-lg shadow-indigo-500/20">Reset Search</button>
        </div>
      )}
    </div>
  );
}
