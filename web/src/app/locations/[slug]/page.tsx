import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react";
import { notFound } from "next/navigation";

const LOCATION_QUERY = defineQuery(/* groq */ `
  *[_type == "location" && slug.current == $slug][0] {
    name,
    address,
    "image": image.asset->url,
    "posts": *[_type == "post" && references(^._id)] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "mainImage": mainImage.asset->url
    }
  }
`);

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const location = await client.fetch(LOCATION_QUERY, { slug });

  if (!location) return notFound();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-6 py-20">
      <div className="container mx-auto max-w-5xl">
        <Link href="/locations" className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} /> All locations
        </Link>

        <header className="mb-16">
          <div className="relative h-[400px] w-full overflow-hidden rounded-[3rem] border border-white/10 shadow-2xl">
            {location.image ? (
                <img src={location.image} className="h-full w-full object-cover opacity-60" alt={location.name} />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-cyan-900/20 text-cyan-400">
                    <MapPin size={80} />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12">
                <h1 className="text-7xl font-extrabold mb-4 bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent">{location.name}</h1>
                <div className="flex items-center gap-3 text-cyan-400 text-xl font-medium">
                    <MapPin size={24} />
                    <span>{location.address?.street}, {location.address?.city}, {location.address?.state} {location.address?.zip}</span>
                </div>
            </div>
          </div>
        </header>

        <div className="grid gap-12 lg:grid-cols-3">
            <div className="lg:col-span-1 space-y-8">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Clock className="text-cyan-400" size={20} />
                        Bakery Hours
                    </h2>
                    <ul className="space-y-3 text-slate-400 text-sm">
                        <li className="flex justify-between"><span>Mon - Fri</span> <span className="text-white font-medium">7:00 AM - 6:00 PM</span></li>
                        <li className="flex justify-between"><span>Saturday</span> <span className="text-white font-medium">8:00 AM - 5:00 PM</span></li>
                        <li className="flex justify-between"><span>Sunday</span> <span className="text-white font-medium">8:00 AM - 2:00 PM</span></li>
                    </ul>
                </div>
                <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl">
                    <h2 className="text-xl font-bold mb-4">Location Services</h2>
                    <ul className="space-y-2 text-slate-400 text-sm list-disc list-inside">
                        <li>Dine-in seating</li>
                        <li>Fresh daily batches</li>
                        <li>Custom order pickup</li>
                        <li>Artisanal coffee bar</li>
                    </ul>
                </div>
            </div>

            <div className="lg:col-span-2">
                <h2 className="text-3xl font-bold mb-8 border-b border-white/10 pb-4">Stories from this bakery</h2>
                <div className="grid gap-8 md:grid-cols-2">
                    {location.posts.map((post: any) => (
                        <Link key={post._id} href={`/posts/${post.slug?.current}`} className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10">
                            {post.mainImage && (
                                <div className="aspect-video w-full overflow-hidden rounded-2xl">
                                    <img src={post.mainImage} alt={post.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                            )}
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-100 group-hover:text-cyan-400 leading-tight mb-3">{post.title}</h3>
                                <div className="flex items-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                    <Calendar size={12} className="text-cyan-400" />
                                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
                {location.posts.length === 0 && <p className="text-slate-500 italic">No stories published from this location yet.</p>}
            </div>
        </div>
      </div>
    </div>
  );
}
