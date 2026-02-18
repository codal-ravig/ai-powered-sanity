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
      className="group relative flex"
    >
      <Link 
        href={`/posts/${post.slug?.current}`}
        className="relative flex w-full flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)]"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
        
        {displayImage ? (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-white/5">
            <Image
              src={displayImage as string}
              alt={post.title || "Post Image"}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[2rem] bg-white/5 flex items-center justify-center text-slate-700">
            <ChefHat size={64} />
          </div>
        )}

        <div className="flex flex-1 flex-col p-6 text-white">
          <div className="mb-4 flex flex-wrap gap-2">
            {post.categories?.map((cat) => (
              <span key={cat._id || cat.slug || cat.title} className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
                {cat.title}
              </span>
            ))}
          </div>

          <h2 className="mb-4 text-2xl font-bold text-slate-100 group-hover:text-white leading-tight transition-colors">
            {post.title}
          </h2>
          
          <div className="mt-auto space-y-4">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400 font-medium">
              {post.author && (
                <div className="flex items-center gap-2">
                  {(post.author.image || post.author.imageUrl) ? (
                    <div className="relative h-6 w-6 overflow-hidden rounded-full border border-white/20">
                      <Image 
                          src={(post.author.image || post.author.imageUrl) as string} 
                          fill 
                          className="object-cover" 
                          alt={post.author.name || "Author"} 
                      />
                    </div>
                  ) : (
                    <User size={14} className="text-indigo-400" />
                  )}
                  <span>{post.author.name}</span>
                </div>
              )}
              {post.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-cyan-400" />
                  <span>{post.location.name}</span>
                </div>
              )}
            </div>
            
            <div className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 group-hover:text-indigo-300">
              Full Story <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
