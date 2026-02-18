import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Tag, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/live";
import { Metadata } from "next";

const CATEGORY_QUERY = defineQuery(/* groq */ `
  *[_type == "category" && slug.current == $slug][0] {
    title,
    description,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "mainImage": mainImage.asset->url,
      imageUrl
    }
  }
`);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: category } = await sanityFetch({ 
    query: CATEGORY_QUERY, 
    params: { slug } 
  });

  if (!category) return { title: "Category Not Found" };

  return {
    title: `${category.title} | Bakery Categories`,
    description: category.description || `Explore our best ${category.title} stories and recipes.`,
    openGraph: {
      title: category.title || "",
      description: category.description || "",
    },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: category } = await sanityFetch({ 
    query: CATEGORY_QUERY, 
    params: { slug } 
  });

  if (!category) return notFound();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-6 py-20 font-sans">
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
          {category.posts?.map((post: any) => {
            const postImg = post.mainImage || post.imageUrl;
            return (
            <Link key={post._id} href={`/posts/${post.slug?.current}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
              {postImg && (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
                  <Image src={postImg} alt={post.title || "Post"} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                </div>
              )}
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-100 group-hover:text-white leading-tight mb-4">{post.title}</h2>
                <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold">
                    <Calendar size={12} className="text-emerald-400" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </Link>
          )})}
        </div>
      </div>
    </div>
  );
}
