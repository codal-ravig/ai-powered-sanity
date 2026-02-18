import { defineQuery } from "next-sanity";
import Link from "next/link";
import { InfinitePosts } from "@/components/InfinitePosts";
import { MoodPicker } from "@/components/MoodPicker";
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
    "categories": categories[]->{_id, title, "slug": slug.current},
    "mood": mood->{_id, title, slug, colorStart, colorEnd}
  }
`);

const MOODS_QUERY = defineQuery(/* groq */ `
  *[_type == "mood"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    colorStart,
    colorEnd
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
  const [{ data: initialPosts }, { data: moods }] = await Promise.all([
    sanityFetch({ query: INITIAL_POSTS_QUERY }),
    sanityFetch({ query: MOODS_QUERY })
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      <main className="container mx-auto max-w-6xl px-4 pt-32 pb-20 md:px-6 md:pt-48">
        <header className="mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-1000 md:mb-24">
          <Link href="/">
            <h1 className="mx-auto mb-6 max-w-4xl bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent leading-tight pb-2 sm:text-5xl md:text-7xl md:leading-normal">
              Baked with Passion.
            </h1>
          </Link>
          <p className="mx-auto max-w-2xl text-base text-slate-400 leading-relaxed sm:text-lg md:text-xl">
            Artisanal stories, recipes, and news from our ovens to your screen.
          </p>
        </header>

        <MoodPicker moods={moods} />

        <div className="mt-16 md:mt-24">
          <h2 className="mb-10 text-xl font-bold uppercase tracking-[0.2em] text-slate-500 md:text-2xl">Fresh from the oven</h2>
          <InfinitePosts initialPosts={initialPosts} />
        </div>

        {initialPosts.length === 0 && (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl shadow-xl md:p-12">
            <p className="text-lg text-slate-400 italic md:text-xl">The bakery is currently pre-heating. Check back soon for fresh stories!</p>
          </div>
        )}
      </main>
    </div>
  );
}
