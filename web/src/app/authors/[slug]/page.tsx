import { defineQuery } from "next-sanity";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, Calendar } from "lucide-react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/live";
import { Metadata } from "next";

const AUTHOR_QUERY = defineQuery(/* groq */ `
  *[_type == "person" && slug.current == $slug][0] {
    name,
    bio,
    "image": image.asset->url,
    imageUrl,
    "posts": *[_type == "post" && author._ref == ^._id] | order(publishedAt desc) {
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
  const { data: author } = await sanityFetch({ 
    query: AUTHOR_QUERY, 
    params: { slug } 
  });

  if (!author) return { title: "Author Not Found" };

  return {
    title: `${author.name} | Bakery Authors`,
    description: `Read all bakery stories and recipes published by ${author.name}.`,
    openGraph: {
      title: author.name || "",
      description: `Bakery stories and recipes from ${author.name}`,
      images: (author.image || author.imageUrl) ? [{ url: (author.image || author.imageUrl) as string }] : [],
    },
  };
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: author } = await sanityFetch({ 
    query: AUTHOR_QUERY, 
    params: { slug } 
  });

  if (!author) return notFound();

  const authorImage = author.image || author.imageUrl;

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-6 py-20 font-sans">
      <div className="container mx-auto max-w-5xl">
        <Link href="/" className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} /> All stories
        </Link>

        <header className="mb-16 flex flex-col items-center gap-8 text-center md:flex-row md:text-left">
          <div className="relative h-40 w-40 shrink-0 rounded-[3rem] bg-indigo-500/10 p-2 border border-white/10 overflow-hidden shadow-[0_0_50px_-5px_rgba(99,102,241,0.5)]">
            {authorImage ? (
                <Image 
                    src={authorImage as string} 
                    fill 
                    className="object-cover rounded-[2.5rem]" 
                    alt={author.name || "Author"} 
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-indigo-400">
                    <User size={64} />
                </div>
            )}
          </div>
          <div>
            <h1 className="text-6xl font-extrabold mb-4 bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-transparent pb-2">Stories by {author.name}</h1>
            <div className="prose prose-invert prose-indigo max-w-2xl text-slate-400">
                {author.bio ? <PortableText value={author.bio} /> : <p>Head baker with a passion for traditional techniques and modern flavors.</p>}
            </div>
          </div>
        </header>

        <h2 className="text-2xl font-bold mb-8 border-b border-white/10 pb-4 uppercase tracking-widest text-slate-500">Published Works</h2>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {author.posts?.map((post: any) => {
            const storyImage = post.mainImage || post.imageUrl;
            return (
              <Link key={post._id} href={`/posts/${post.slug?.current}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)]">
                {storyImage && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-white/5">
                    <Image 
                        src={storyImage as string} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={post.title || "Story"} 
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-slate-100 group-hover:text-white leading-tight mb-4">{post.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold">
                      <Calendar size={12} className="text-indigo-400" />
                      <span>{post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Draft'}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
