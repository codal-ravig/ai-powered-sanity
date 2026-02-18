"use client";

import Link from "next/link";
import Image from "next/image";
import { User, ArrowRight, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { Post } from "@/sanity/types";

export function PostCard({ post, index }: { post: Post; index: number }) {
  const displayImage = post.mainImage || post.imageUrl;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: (index % 12) * 0.1 }}
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)]"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
      
      {displayImage && (
        <Link href={`/posts/${post.slug?.current}`} className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white/5">
          <Image
            src={displayImage as string}
            alt={post.title || "Post Image"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      )}

      <div className="flex flex-1 flex-col p-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {post.categories?.map((cat) => (
            <span key={cat._id || cat.slug?.current || cat.title} className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
              {cat.title}
            </span>
          ))}
        </div>

        <Link href={`/posts/${post.slug?.current}`}>
          <h2 className="mb-4 text-2xl font-bold text-slate-100 group-hover:text-white leading-tight">
            {post.title}
          </h2>
        </Link>
        
        <div className="mt-auto space-y-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-400">
            {post.author && (
              <Link href={`/authors/${post.author.slug?.current}`} className="flex items-center gap-2 hover:text-indigo-400 transition-colors">
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
              </Link>
            )}
            {post.location && (
              <Link href={`/locations/${post.location.slug?.current}`} className="flex items-center gap-1.5 hover:text-cyan-400 transition-colors">
                <MapPin size={14} className="text-cyan-400" />
                <span>{post.location.name}</span>
              </Link>
            )}
          </div>
          
          <Link href={`/posts/${post.slug?.current}`} className="inline-flex items-center gap-2 text-sm font-bold text-indigo-400 hover:text-indigo-300">
            Full Story <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
