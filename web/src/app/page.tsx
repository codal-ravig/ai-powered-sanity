import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { Post } from "@/sanity/types";
import { InfinitePosts } from "@/components/InfinitePosts";

const INITIAL_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc)[0...12] {
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
`);

export default async function Home() {
  const initialPosts = await client.fetch<Post[]>(INITIAL_POSTS_QUERY);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30 overflow-x-hidden">
      <main className="container mx-auto max-w-6xl px-6 py-20">
        <header className="mb-20 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <Link href="/">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent leading-normal pb-2">
              Bakery Chronicles
            </h1>
          </Link>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            Artisanal stories, recipes, and news from our ovens to your screen.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
             <Link href="/categories" className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all hover:scale-105 active:scale-95">Explore Categories</Link>
             <Link href="/locations" className="rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-bold uppercase tracking-widest hover:bg-white/10 transition-all hover:scale-105 active:scale-95">Our Locations</Link>
          </div>
        </header>

        <InfinitePosts initialPosts={initialPosts} />

        {initialPosts.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl">
            <p className="text-xl text-slate-400 italic">The bakery is currently pre-heating. Check back soon for fresh stories!</p>
          </div>
        )}
      </main>
    </div>
  );
}
