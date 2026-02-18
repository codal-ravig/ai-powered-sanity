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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-4 py-32 font-sans transition-colors duration-500 sm:px-6 md:py-48">
      <div className="container mx-auto max-w-5xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-all sm:mb-12 sm:px-6 sm:text-sm">
          <ArrowLeft size={16} /> All stories
        </Link>

        <header className="mb-12 flex flex-col items-center gap-6 text-center md:mb-20 md:flex-row md:items-start md:gap-10 md:text-left">
          <div className="relative h-32 w-32 shrink-0 rounded-[2.5rem] bg-indigo-500/10 p-1.5 border border-white/10 overflow-hidden shadow-[0_0_50px_-5px_rgba(99,102,241,0.5)] sm:h-40 sm:w-40 sm:rounded-[3rem] sm:p-2">
            {authorImage ? (
                <Image 
                    src={authorImage as string} 
                    fill 
                    className="object-cover rounded-[2rem] sm:rounded-[2.5rem]" 
                    alt={author.name || "Author"} 
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center text-indigo-400">
                    <User size={48} className="sm:size-64" />
                </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="mb-4 bg-gradient-to-r from-indigo-300 to-indigo-500 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent leading-tight pb-1 sm:text-5xl md:text-6xl">Stories by {author.name}</h1>
            <div className="prose prose-invert prose-indigo max-w-2xl text-sm text-slate-400 leading-relaxed sm:text-base">
                {author.bio ? <PortableText value={author.bio} /> : <p>Head baker with a passion for traditional techniques and modern flavors.</p>}
            </div>
          </div>
        </header>

        <h2 className="mb-8 border-b border-white/10 pb-4 text-lg font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xl md:mb-12">Published Works</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {author.posts?.map((post: any) => {
            const storyImage = post.mainImage || post.imageUrl;
            return (
              <Link key={post._id} href={`/posts/${post.slug?.current}`} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1.5 transition-all hover:bg-white/10 hover:shadow-[0_0_40px_-10px_rgba(99,102,241,0.3)] sm:rounded-3xl sm:p-2">
                {storyImage && (
                  <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[1.5rem] bg-white/5 sm:rounded-2xl">
                    <Image 
                        src={storyImage as string} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-110" 
                        alt={post.title || "Story"} 
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5 sm:p-6">
                  <h3 className="mb-4 text-lg font-bold text-slate-100 leading-tight group-hover:text-white sm:text-xl">{post.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 sm:text-xs">
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
