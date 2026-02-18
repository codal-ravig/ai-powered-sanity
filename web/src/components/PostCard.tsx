"use client";

import Link from "next/link";
import Image from "next/image";
import { User, ArrowRight, MapPin, ChefHat } from "lucide-react";
import { motion } from "framer-motion";
import { INITIAL_POSTS_QUERY_RESULT } from "@/sanity/types";

type PostCardProps = {
  post: INITIAL_POSTS_QUERY_RESULT[number];
  index: number;
};

export function PostCard({ post, index }: PostCardProps) {
  const displayImage = post.mainImage || post.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 12) * 0.1 }}
      className="group relative flex w-full"
    >
      <Link 
        href={`/posts/${post.slug?.current}`}
        className="relative flex w-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1.5 transition-all hover:bg-white/10 hover:shadow-2xl hover:shadow-indigo-500/10 dark:hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)] sm:rounded-[2.5rem] sm:p-2"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
        
        {displayImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-white/5 sm:rounded-[2rem]">
            <Image
              src={displayImage as string}
              alt={post.title || "Post Image"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-white/5 flex items-center justify-center text-slate-700 sm:rounded-[2rem]">
            <ChefHat className="h-10 w-10 sm:h-12 sm:w-12" />
          </div>
        )}

        <div className="flex flex-1 flex-col p-4 sm:p-6">
          <div className="mb-3 flex flex-wrap gap-2 sm:mb-4">
            {post.categories?.map((cat) => (
              <span key={cat._id || cat.slug || cat.title} className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20 sm:px-3 sm:py-1 sm:text-[10px]">
                {cat.title}
              </span>
            ))}
          </div>

          <h2 className="mb-3 text-lg font-bold text-slate-100 group-hover:text-white leading-tight transition-colors sm:mb-4 sm:text-xl md:text-2xl">
            {post.title}
          </h2>
          
          <div className="mt-auto space-y-3 sm:space-y-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-400 font-medium sm:gap-x-4 sm:text-sm">
              {post.author && (
                <div className="flex items-center gap-1.5 sm:gap-2">
                  {(post.author.image || post.author.imageUrl) ? (
                    <div className="relative h-5 w-5 overflow-hidden rounded-full border border-white/20 sm:h-6 sm:w-6">
                      <Image 
                          src={(post.author.image || post.author.imageUrl) as string} 
                          fill 
                          className="object-cover" 
                          alt={post.author.name || "Author"} 
                      />
                    </div>
                  ) : (
                    <User className="h-3 w-3 sm:h-4 sm:w-4" />
                  )}
                  <span className="truncate max-w-[80px] sm:max-w-none">{post.author.name}</span>
                </div>
              )}
              {post.location && (
                <div className="flex items-center gap-1 sm:gap-1.5">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-cyan-400" />
                  <span className="truncate max-w-[80px] sm:max-w-none">{post.location.name}</span>
                </div>
              )}
            </div>
            
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-400 group-hover:text-indigo-300 sm:gap-2 sm:text-sm">
              Full Story <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
