import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import { ArrowLeft, Calendar, User, Tag, MapPin } from "lucide-react";
import { notFound } from "next/navigation";

const POST_QUERY = defineQuery(/* groq */ `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    publishedAt,
    "author": author->{name, slug},
    "location": location->{name, slug},
    "mainImage": mainImage.asset->url,
    "categories": categories[]->{title, slug},
    body
  }
`);

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await client.fetch(POST_QUERY, { slug });

  if (!post) {
    return notFound();
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30">
      <div className="container mx-auto max-w-4xl px-6 py-20">
        <Link
          href="/"
          className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-slate-400 transition-all hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={16} /> Back to stories
        </Link>

        <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl">
          {post.mainImage && (
            <div className="h-96 w-full overflow-hidden">
              <img
                src={post.mainImage}
                alt={post.title || ""}
                className="h-full w-full object-cover opacity-80"
              />
            </div>
          )}

          <div className="p-8 md:p-16">
            <header className="mb-12">
              <h1 className="mb-6 bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent leading-tight">
                {post.title}
              </h1>

              <div className="flex flex-wrap items-center gap-x-8 gap-y-4 text-slate-400">
                {post.author && (
                  <Link href={`/authors/${post.author.slug?.current}`} className="group/link flex items-center gap-2 hover:text-white transition-colors">
                    <div className="h-8 w-8 rounded-full bg-indigo-500/20 p-1.5 text-indigo-400 border border-indigo-500/30 group-hover/link:bg-indigo-500/30">
                      <User size={18} />
                    </div>
                    <span>{post.author.name}</span>
                  </Link>
                )}
                {post.location && (
                   <Link href={`/locations/${post.location.slug?.current}`} className="group/link flex items-center gap-2 hover:text-white transition-colors">
                    <MapPin size={18} className="text-cyan-400" />
                    <span>{post.location.name}</span>
                  </Link>
                )}
                {post.publishedAt && (
                  <div className="flex items-center gap-2">
                    <Calendar size={18} className="text-slate-500" />
                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                  </div>
                )}
              </div>

              {post.categories && post.categories.length > 0 && (
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Tag size={18} className="text-emerald-400" />
                  {post.categories.map((cat: any) => (
                    <Link
                      key={cat.slug?.current}
                      href={`/categories/${cat.slug?.current}`}
                      className="rounded-full bg-emerald-500/10 px-4 py-1 text-sm text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
                    >
                      {cat.title}
                    </Link>
                  ))}
                </div>
              )}
            </header>

            <div className="prose prose-invert prose-indigo max-w-none">
              <PortableText value={post.body} />
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
