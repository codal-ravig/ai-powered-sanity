import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { ArrowLeft, Tag } from "lucide-react";
import { notFound } from "next/navigation";

const CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    title,
    description,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "mainImage": mainImage.asset->url
    }
  }
`);

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = await client.fetch(CATEGORY_QUERY, { slug });

  if (!category) return notFound();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-6 py-20">
      <div className="container mx-auto max-w-5xl">
        <Link href="/" className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} /> All stories
        </Link>

        <header className="mb-16 flex flex-col items-center gap-6 text-center">
          <div className="h-20 w-20 rounded-full bg-emerald-500/20 p-5 text-emerald-400 border border-emerald-500/30 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)]">
            <Tag size={40} />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-2">Category: {category.title}</h1>
            <p className="text-slate-400 max-w-xl">{category.description || `Exploring all topics related to ${category.title}.`}</p>
          </div>
        </header>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {category.posts.map((post: any) => (
            <Link key={post._id} href={`/posts/${post.slug?.current}`} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1 transition-all hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
              {post.mainImage && (
                <div className="aspect-video w-full overflow-hidden rounded-xl">
                  <img src={post.mainImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-100 group-hover:text-white">{post.title}</h2>
                <p className="mt-2 text-sm text-slate-400">{new Date(post.publishedAt).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
