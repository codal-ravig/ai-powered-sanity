import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { ArrowLeft, Tag, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { CATEGORIES_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all our bakery story categories, from breads to seasonal specials.",
};

const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);

export default async function CategoriesPage() {
  const categories = await client.fetch<CATEGORIES_QUERY_RESULT>(CATEGORIES_QUERY);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-4 py-32 md:px-6 md:py-48 font-sans transition-colors duration-500">
      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-all sm:mb-12 sm:px-6 sm:text-sm">
          <ArrowLeft size={16} /> All stories
        </Link>

        <header className="mb-12 sm:mb-16">
          <h1 className="mb-4 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent pb-2 sm:text-5xl md:text-6xl">Bakery Categories</h1>
          <p className="text-base text-slate-400 sm:text-lg md:text-xl">Explore our baked goods by type.</p>
        </header>

        <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug}`} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-6 transition-all hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] backdrop-blur-3xl sm:rounded-3xl sm:p-8">
              <div className="flex justify-between items-start mb-4 sm:mb-6">
                <div className="h-10 w-10 rounded-xl bg-emerald-500/10 p-2.5 text-emerald-400 border border-emerald-500/20 sm:h-12 sm:w-12 sm:rounded-2xl sm:p-3">
                  <Tag size={20} className="sm:size-6" />
                </div>
                <span className="text-emerald-400 font-bold text-[10px] bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20 sm:text-xs sm:px-3 sm:py-1">{category.postCount} stories</span>
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-emerald-300 transition-colors sm:text-2xl sm:mb-3">{category.title}</h2>
              <p className="text-sm text-slate-400 mb-6 line-clamp-2 sm:text-base sm:mb-8">{category.description}</p>
              <div className="flex items-center gap-2 font-bold text-[10px] text-emerald-400 group-hover:gap-4 transition-all uppercase tracking-widest sm:text-xs">
                Browse Category <ArrowRight size={14} className="sm:size-4" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
