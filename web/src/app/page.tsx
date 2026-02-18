import Link from "next/link";
import Image from "next/image";
import { InfinitePosts } from "@/components/InfinitePosts";
import { MoodPicker } from "@/components/MoodPicker";
import { sanityFetch } from "@/sanity/live";
import { PortableText } from "@portabletext/react";
import { HOME_PAGE_QUERY } from "@/sanity/queries/pages";
import { INITIAL_POSTS_QUERY } from "@/sanity/queries/posts";
import { MOODS_QUERY } from "@/sanity/queries/site";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const { data: home } = await sanityFetch({ query: HOME_PAGE_QUERY });
  
  return {
    title: home?.seo?.metaTitle || "Bakery Chronicles | Artisanal Stories & Recipes",
    description: home?.seo?.metaDescription || "Explore the latest stories, recipes, and news from our artisanal bakery.",
    openGraph: {
      title: home?.seo?.metaTitle || "Bakery Chronicles",
      description: home?.seo?.metaDescription || "Artisanal stories from our oven",
      type: "website",
    }
  };
}

export default async function Home() {
  const [{ data: home }, { data: initialPosts }, { data: moods }] = await Promise.all([
    sanityFetch({ query: HOME_PAGE_QUERY }),
    sanityFetch({ query: INITIAL_POSTS_QUERY }),
    sanityFetch({ query: MOODS_QUERY })
  ]);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30 overflow-x-hidden font-sans">
      <main className="container mx-auto max-w-6xl px-4 pt-32 pb-20 md:px-6 md:pt-48">
        
        {home?.sections?.map((section: any) => {
          switch (section._type) {
            case 'hero':
              return (
                <header key={section._key} className="relative mb-16 text-center animate-in fade-in slide-in-from-top-4 duration-1000 md:mb-24">
                  {section.imageUrl && (
                    <div className="absolute -top-24 left-1/2 -z-10 h-64 w-full -translate-x-1/2 overflow-hidden blur-3xl opacity-20 md:h-96">
                        <Image src={section.imageUrl} fill className="object-cover" alt="" />
                    </div>
                  )}
                  <Link href="/">
                    <h1 className="mx-auto mb-6 max-w-4xl bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent leading-tight pb-2 sm:text-5xl md:text-7xl md:leading-normal">
                      {section.title}
                    </h1>
                  </Link>
                  <p className="mx-auto max-w-2xl text-base text-slate-400 leading-relaxed sm:text-lg md:text-xl">
                    {section.subtitle}
                  </p>
                </header>
              );
            
            case 'moodPicker':
              return (
                <div key={section._key} className="mb-16 md:mb-24">
                   <div className="mb-10 flex flex-col items-center gap-2 text-center md:items-start md:text-left">
                        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-slate-500 md:text-2xl">{section.title}</h2>
                        <p className="text-sm text-slate-400">{section.subtitle}</p>
                    </div>
                   <MoodPicker moods={moods} />
                </div>
              );

            case 'featuredPosts':
              const postsToShow = initialPosts.slice(0, section.count || 12);
              return (
                <div key={section._key} className="mt-16 md:mt-24">
                  {section.title && (
                    <h2 className="mb-10 text-xl font-bold uppercase tracking-[0.2em] text-slate-500 md:text-2xl">
                        {section.title}
                    </h2>
                  )}
                  <InfinitePosts initialPosts={postsToShow} />
                </div>
              );

            case 'textContent':
              return (
                <div 
                    key={section._key} 
                    className={`mb-16 md:mb-24 max-w-3xl mx-auto ${section.align === 'center' ? 'text-center' : section.align === 'right' ? 'text-right' : 'text-left'}`}
                >
                    {section.heading && <h2 className="text-3xl font-bold mb-6 text-indigo-300">{section.heading}</h2>}
                    <div className="prose prose-invert prose-indigo max-w-none text-slate-400">
                        <PortableText value={section.content} />
                    </div>
                </div>
              );

            default:
              return null;
          }
        })}

        {(!home?.sections || home.sections.length === 0) && (
            <div className="text-center py-20 flex flex-col items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center border border-white/10 animate-pulse">
                    <div className="h-10 w-10 rounded-full bg-indigo-500/20" />
                </div>
                <h1 className="text-2xl font-bold text-slate-300">Awaiting content...</h1>
                <p className="text-slate-500 text-sm max-w-xs">Start adding sections to your home page in the Sanity Studio to see them appear here.</p>
            </div>
        )}
      </main>
    </div>
  );
}
