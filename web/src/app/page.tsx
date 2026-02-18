import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { Calendar, User, ArrowRight, MapPin } from "lucide-react";
import { Post } from "@/sanity/types";

const POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...12] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->{name, slug, "image": image.asset->url},
    "location": location->{name, slug, "image": image.asset->url},
    "mainImage": mainImage.asset->url,
    "categories": categories[]->{title, slug}
  }
`);

export default async function Home() {
  const posts = await client.fetch<Post[]>(POSTS_QUERY);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30">
      <main className="container mx-auto max-w-6xl px-6 py-20">
        <header className="mb-20 text-center">
          <Link href="/">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent">
              Bakery Chronicles
            </h1>
          </Link>
          <p className="text-xl text-slate-400">
            Artisanal stories, recipes, and news from our ovens to your screen.
          </p>
          <div className="mt-8 flex justify-center gap-4">
             <Link href="/categories" className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium hover:bg-white/10 transition-all">Explore Categories</Link>
             <Link href="/locations" className="rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium hover:bg-white/10 transition-all">Our Locations</Link>
          </div>
        </header>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <div
              key={post._id}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(99,102,241,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-emerald-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              
              {post.mainImage && (
                <Link href={`/posts/${post.slug?.current}`} className="aspect-[16/10] w-full overflow-hidden rounded-2xl">
                  <img
                    src={post.mainImage}
                    alt={post.title || ""}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </Link>
              )}

              <div className="flex flex-1 flex-col p-6">
                <div className="mb-4 flex flex-wrap gap-2">
                  {post.categories?.map((cat: any) => (
                    <span key={cat.slug?.current} className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/20">
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
                        {post.author.image ? (
                          <img src={post.author.image} className="h-6 w-6 rounded-full object-cover border border-white/20" alt="" />
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
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
