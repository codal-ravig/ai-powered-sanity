import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { ArrowLeft, Tag, ArrowRight } from "lucide-react";

const CATEGORIES_QUERY = defineQuery(/* groq */ `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);

export default async function CategoriesPage() {
  const categories = await client.fetch(CATEGORIES_QUERY);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-6 py-20">
      <div className="container mx-auto max-w-4xl">
        <Link href="/" className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} /> All stories
        </Link>

        <header className="mb-16">
          <h1 className="text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">Bakery Categories</h1>
          <p className="text-xl text-slate-400">Explore our baked goods by type.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category.slug?.current}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-8 transition-all hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)] backdrop-blur-3xl">
              <div className="flex justify-between items-start mb-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 p-3 text-emerald-400 border border-emerald-500/20">
                  <Tag size={24} />
                </div>
                <span className="text-emerald-400 font-bold text-sm bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">{category.postCount} stories</span>
              </div>
              <h2 className="text-2xl font-bold mb-3 group-hover:text-emerald-300 transition-colors">{category.title}</h2>
              <p className="text-slate-400 mb-6 line-clamp-2">{category.description}</p>
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-400 group-hover:gap-4 transition-all uppercase tracking-widest">
                Browse Category <ArrowRight size={16} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
