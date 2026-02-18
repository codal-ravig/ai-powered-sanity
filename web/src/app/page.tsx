import { defineQuery } from "next-sanity";
import Link from "next/link";
import { InfinitePosts } from "@/components/InfinitePosts";
import { sanityFetch } from "@/sanity/live";

const INITIAL_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc, _id desc)[0...12] {
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
`);

export async function generateMetadata() {
  return {
    title: "Bakery Chronicles | Artisanal Stories & Recipes",
    description: "Explore the latest stories, recipes, and news from our artisanal bakery. From sourdough secrets to French pastry masterclasses.",
    openGraph: {
      title: "Bakery Chronicles | Artisanal Stories & Recipes",
      description: "Explore the latest stories, recipes, and news from our artisanal bakery.",
      type: "website",
    }
  };
}

export default async function Home() {
  const { data: initialPosts } = await sanityFetch({ query: INITIAL_POSTS_QUERY });

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      <main className="container mx-auto max-w-6xl px-6 pt-40 pb-20">
        <header className="mb-20 text-center animate-in fade-in slide-in-from-top-4 duration-1000">
          <Link href="/">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-7xl font-extrabold tracking-tight text-transparent leading-tight pb-2">
              Baked with Passion.
            </h1>
          </Link>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Artisanal stories, recipes, and news from our ovens to your screen.
          </p>
        </header>

        <InfinitePosts initialPosts={initialPosts} />

        {initialPosts.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center backdrop-blur-xl shadow-xl">
            <p className="text-xl text-slate-400 italic">The bakery is currently pre-heating. Check back soon for fresh stories!</p>
          </div>
        )}
      </main>
    </div>
  );
}
