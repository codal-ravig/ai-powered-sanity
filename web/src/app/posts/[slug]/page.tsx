import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Calendar, User, Tag, MapPin, ChefHat } from "lucide-react";
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30 font-sans">
      <div className="container mx-auto max-w-4xl px-4 py-24 sm:px-6 md:py-40">
        <Link
          href="/"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-slate-400 transition-all hover:bg-white/10 hover:text-white sm:mb-12 sm:px-6 sm:text-sm"
        >
          <ArrowLeft className="h-4 w-4" /> Back to stories
        </Link>

        <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl">
          {post.mainImage || post.imageUrl ? (
            <div className="h-64 w-full overflow-hidden bg-white/5 relative sm:h-80 md:h-96">
              <Image
                src={(post.mainImage || post.imageUrl) as string}
                alt={post.title || "Post Image"}
                fill
                className="object-cover opacity-80"
                priority
              />
            </div>
          ) : null}

          <div className="p-6 sm:p-10 md:p-16">
            <header className="mb-10 sm:mb-12">
              <h1 className="mb-6 bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-3xl font-extrabold tracking-tight text-transparent leading-tight sm:text-4xl md:text-5xl md:pb-2">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-4 text-xs text-slate-400 sm:gap-x-8 sm:text-sm">
                {post.author && (
                  <Link href={`/authors/${post.author.slug?.current}`} className="group/link flex items-center gap-2.5 hover:text-white transition-colors sm:gap-3">
                    <div className="relative h-8 w-8 overflow-hidden rounded-full bg-indigo-500/20 border border-indigo-500/30 group-hover/link:border-indigo-500/50 sm:h-10 sm:w-10">
                      {post.author.image || post.author.imageUrl ? (
                        <Image 
                            src={(post.author.image || post.author.imageUrl) as string} 
                            alt={post.author.name || "Author"} 
                            fill 
                            className="object-cover" 
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-indigo-400">
                          <User className="h-4 w-4 sm:h-5 sm:w-5" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium">{post.author.name}</span>
                  </Link>
                )}
                {post.location && (
                   <Link href={`/locations/${post.location.slug?.current}`} className="group/link flex items-center gap-2 hover:text-white transition-colors">
                    <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-400" />
                    <span className="font-medium">{post.location.name}</span>
                  </Link>
                )}
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-slate-500" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {post.categories && post.categories.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-2 sm:gap-3">
                  <Tag className="h-4 w-4 text-emerald-400" />
                  {post.categories.map((cat) => (
                    <Link
                      key={cat.slug || cat._id}
                      href={`/categories/${cat.slug}`}
                      className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all sm:px-4 sm:text-xs"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            <div className="prose prose-invert prose-indigo max-w-none mb-12 sm:mb-16 text-sm sm:text-base leading-relaxed">
              <PortableText value={post.body || []} />
            </div>

            {similarPosts.length > 0 && (
              <div className="border-t border-white/10 pt-12 sm:pt-16">
                <h2 className="text-xl font-bold mb-6 sm:text-2xl sm:mb-8">Similar Stories</h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {similarPosts.map((sp) => {
                    const spImg = sp.mainImage || sp.imageUrl;
                    return (
                        <Link key={sp._id} href={`/posts/${sp.slug?.current}`} className="group block">
                        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 mb-3 bg-white/5 flex items-center justify-center">
                            {spImg ? (
                            <Image 
                                src={spImg as string} 
                                alt={sp.title || "Similar Post"} 
                                fill 
                                className="object-cover transition-transform group-hover:scale-110" 
                            />
                            ) : (
                                <ChefHat className="h-8 w-8 text-slate-700 sm:h-12 sm:w-12" />
                            )}
                        </div>
                        <h3 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-2 sm:text-base">{sp.title}</h3>
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
