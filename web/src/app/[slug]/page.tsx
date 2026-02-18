import { defineQuery } from "next-sanity";
import { PortableText } from "@portabletext/react";
import { notFound } from "next/navigation";
import Image from "next/image";
import { sanityFetch } from "@/sanity/live";
import { Metadata } from "next";

const PAGE_QUERY = defineQuery(/* groq */ `
  *[_type == "page" && slug.current == $slug][0] {
    title,
    body,
    "imageUrl": mainImage.asset->url
  }
`);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { data: page } = await sanityFetch({ 
    query: PAGE_QUERY, 
    params: { slug } 
  });

  if (!page) return { title: "Page Not Found" };

  return {
    title: page.title,
  };
}

export default async function GenericPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: page } = await sanityFetch({ 
    query: PAGE_QUERY, 
    params: { slug } 
  });

  if (!page) return notFound();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white selection:bg-indigo-500/30 font-sans">
      <main className="container mx-auto max-w-4xl px-4 py-32 md:py-48">
        <article className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl backdrop-blur-3xl">
          {page.imageUrl && (
            <div className="h-64 w-full overflow-hidden bg-white/5 relative sm:h-80 md:h-96">
              <Image
                src={page.imageUrl}
                alt={page.title || "Page Image"}
                fill
                className="object-cover opacity-80"
                priority
              />
            </div>
          )}

          <div className="p-6 sm:p-10 md:p-16">
            <h1 className="mb-10 text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-300 to-cyan-300 bg-clip-text text-transparent sm:text-5xl md:text-6xl leading-tight">
              {page.title}
            </h1>

            <div className="prose prose-invert prose-indigo max-w-none text-slate-300 leading-relaxed">
              <PortableText value={page.body || []} />
            </div>
          </div>
        </article>
      </main>
    </div>
  );
}
