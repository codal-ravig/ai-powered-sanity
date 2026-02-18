import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag, MapPin, ArrowRight, ChefHat } from "lucide-react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/live";
import { Metadata } from "next";
import { SIMILAR_POSTS_QUERY_RESULT } from "@/sanity/types";

const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->{_id, name, slug, "image": image.asset->url, imageUrl},
    "location": location->{_id, name, slug, "image": image.asset->url, imageUrl},
    "mainImage": mainImage.asset->url,
    imageUrl,
    "categories": categories[]->{_id, title, "slug": slug.current},
    body
  }
`);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({ 
    query: POST_QUERY, 
    params: { slug } 
  });

  if (!post) return { title: "Post Not Found" };

  const displayImage = post.mainImage || post.imageUrl;

  return {
    title: `${post.title} | Bakery Chronicles`,
    description: post.title ?? undefined,
    openGraph: {
      title: post.title || "",
      description: `Written by ${post.author?.name || "our bakery staff"}`,
      images: displayImage ? [{ url: displayImage as string }] : [],
      type: "article",
      publishedTime: post.publishedAt || undefined,
    },
  };
}

const SIMILAR_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current != $slug && (
    author._ref == $authorId || 
    location._ref == $locationId || 
    count(categories[@._ref in $categoryIds]) > 0
  )] | order(publishedAt desc)[0...3] {
    _id,
    title,
    slug,
    publishedAt,
    "mainImage": mainImage.asset->url,
    imageUrl
  }
`);

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  
  const { data: post } = await sanityFetch({ 
    query: POST_QUERY, 
    params: { slug } 
  });

  if (!post) return notFound();

  const similarPosts = await client.fetch<SIMILAR_POSTS_QUERY_RESULT>(SIMILAR_POSTS_QUERY, {
    slug,
    authorId: post.author?._id || "",
    locationId: post.location?._id || "",
    categoryIds: post.categories?.map((c) => c._id) || [],
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 selection:bg-indigo-500/30 font-sans transition-colors duration-500">
      <div className="container mx-auto max-w-4xl px-6 py-32 md:py-40">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 rounded-full border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 px-6 py-2 text-sm font-medium text-slate-500 dark:text-slate-400 transition-all hover:bg-slate-100 dark:hover:bg-white/10 hover:text-indigo-600 dark:hover:text-white"
        >
          <ArrowLeft size={16} /> Back to stories
        </Link>

        <article className="overflow-hidden rounded-3xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 shadow-2xl backdrop-blur-3xl">
          {post.mainImage || post.imageUrl ? (
            <div className="h-96 w-full overflow-hidden bg-slate-100 dark:bg-white/5 relative">
              <Image
                src={(post.mainImage || post.imageUrl) as string}
                alt={post.title || "Post Image"}
                fill
                className="object-cover opacity-90 dark:opacity-80"
                priority
              />
            </div>
          ) : null}

          <div className="p-8 md:p-16">
            <header className="mb-12">
              <h1 className="mb-6 bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-300 dark:to-cyan-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent leading-tight pb-2">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-500 dark:text-slate-400">
                {post.author && (
                  <Link href={`/authors/${post.author.slug?.current}`} className="group/link flex items-center gap-3 hover:text-indigo-600 dark:hover:text-white transition-colors">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-indigo-50 dark:bg-indigo-500/20 border border-indigo-100 dark:border-indigo-500/30 group-hover/link:border-indigo-500/50">
                      {post.author.image || post.author.imageUrl ? (
                        <Image 
                            src={(post.author.image || post.author.imageUrl) as string} 
                            alt={post.author.name || "Author"} 
                            fill 
                            className="object-cover" 
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-indigo-500 dark:text-indigo-400">
                          <User size={20} />
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{post.author.name}</span>
                  </Link>
                )}
                {post.location && (
                   <Link href={`/locations/${post.location.slug?.current}`} className="group/link flex items-center gap-2 hover:text-cyan-600 dark:hover:text-white transition-colors">
                    <MapPin size={20} className="text-cyan-500 dark:text-cyan-400" />
                    <span className="font-medium">{post.location.name}</span>
                  </Link>
                )}
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={20} className="text-slate-400 dark:text-slate-500" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {post.categories && post.categories.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Tag size={18} className="text-emerald-500 dark:text-emerald-400" />
                  {post.categories.map((cat) => (
                    <Link
                      key={cat.slug || cat._id}
                      href={`/categories/${cat.slug}`}
                      className="rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-4 py-1 text-sm text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            <div className="prose prose-slate dark:prose-invert prose-indigo max-w-none mb-16">
              <PortableText value={post.body || []} />
            </div>

            {similarPosts.length > 0 && (
              <div className="border-t border-slate-200 dark:border-white/10 pt-16">
                <h2 className="text-2xl font-bold mb-8">Similar Stories</h2>
                <div className="grid gap-6 sm:grid-cols-3">
                  {similarPosts.map((sp) => {
                    const spImg = sp.mainImage || sp.imageUrl;
                    return (
                        <Link key={sp._id} href={`/posts/${sp.slug?.current}`} className="group block">
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-slate-200 dark:border-white/10 mb-3 bg-slate-100 dark:bg-white/5 flex items-center justify-center">
                            {spImg ? (
                            <Image 
                                src={spImg as string} 
                                alt={sp.title || "Similar Post"} 
                                fill 
                                className="object-cover transition-transform group-hover:scale-110" 
                            />
                            ) : (
                                <ChefHat size={32} className="text-slate-300 dark:text-slate-700" />
                            )}
                        </div>
                        <h3 className="font-bold text-slate-700 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">{sp.title}</h3>
                        </Link>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
