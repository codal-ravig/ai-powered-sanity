import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import { PortableText } from "@portabletext/react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Calendar, Clock, Globe } from "lucide-react";
import { notFound } from "next/navigation";
import { sanityFetch } from "@/sanity/live";
import { Metadata } from "next";
import { LocationMap } from "@/components/LocationMap";

const LOCATION_QUERY = defineQuery(/* groq */ `
  *[_type == "location" && slug.current == $slug][0] {
    name,
    address,
    geolocation,
    description,
    "image": image.asset->url,
    imageUrl,
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
  const { data: location } = await sanityFetch({ 
    query: LOCATION_QUERY, 
    params: { slug } 
  });

  if (!location) return { title: "Location Not Found" };

  return {
    title: `${location.name} | Bakery Locations`,
    description: `Visit our ${location.name} bakery at ${location.address?.street}, ${location.address?.city}.`,
    openGraph: {
      title: location.name || "",
      description: `Artisanal bakery in ${location.address?.city}`,
      images: (location.image || location.imageUrl) ? [{ url: (location.image || location.imageUrl) as string }] : [],
    },
  };
}

export default async function LocationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { data: location } = await sanityFetch({ 
    query: LOCATION_QUERY, 
    params: { slug } 
  });

  if (!location) return notFound();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-4 py-32 font-sans transition-colors duration-500 sm:px-6 md:py-48">
      <div className="container mx-auto max-w-5xl">
        <Link href="/locations" className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-all sm:mb-12 sm:px-6 sm:text-sm">
          <ArrowLeft size={16} /> All locations
        </Link>

        <header className="mb-12 sm:mb-16">
          <div className="relative h-64 w-full overflow-hidden rounded-[2rem] border border-white/10 shadow-2xl bg-white/5 sm:h-80 md:h-[400px] md:rounded-[3rem]">
            {location.image || location.imageUrl ? (
                <Image 
                    src={(location.image || location.imageUrl) as string} 
                    fill 
                    className="object-cover opacity-60" 
                    alt={location.name || "Location"} 
                    priority
                />
            ) : (
                <div className="flex h-full w-full items-center justify-center bg-cyan-900/20 text-cyan-400">
                    <MapPin size={64} className="sm:size-72" />
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10 md:bottom-12 md:left-12">
                <h1 className="mb-3 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text text-transparent sm:text-5xl md:text-7xl md:pb-2 leading-tight">
                  {location.name}
                </h1>
                <div className="flex items-center gap-2 text-sm font-medium text-cyan-400 sm:gap-3 sm:text-base md:text-xl">
                    <MapPin size={18} className="sm:size-6" />
                    <span className="line-clamp-1">{location.address?.street}, {location.address?.city}</span>
                </div>
            </div>
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-3 lg:gap-12">
            <div className="order-2 lg:order-1 lg:col-span-1 space-y-6 sm:space-y-8">
                <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                    <h2 className="text-lg font-bold mb-6 flex items-center gap-2 sm:text-xl">
                        <Clock className="text-cyan-400" size={20} />
                        Bakery Hours
                    </h2>
                    <ul className="space-y-3 text-slate-400 text-sm">
                        <li className="flex justify-between"><span>Mon - Fri</span> <span className="text-white font-medium">7:00 AM - 6:00 PM</span></li>
                        <li className="flex justify-between"><span>Saturday</span> <span className="text-white font-medium">8:00 AM - 5:00 PM</span></li>
                        <li className="flex justify-between"><span>Sunday</span> <span className="text-white font-medium">8:00 AM - 2:00 PM</span></li>
                    </ul>
                </div>
                
                {location.geolocation && typeof location.geolocation.lat === 'number' && typeof location.geolocation.lng === 'number' && (
                    <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
                        <h2 className="text-lg font-bold mb-6 flex items-center gap-2 sm:text-xl">
                            <Globe className="text-cyan-400" size={20} />
                            Bakery Map
                        </h2>
                        <div className="h-48 w-full mb-6 sm:h-64">
                            <LocationMap 
                              lat={location.geolocation.lat} 
                              lng={location.geolocation.lng} 
                              name={location.name || "Bakery Location"} 
                            />
                        </div>
                        <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${location.geolocation.lat},${location.geolocation.lng}`}
                            target="_blank"
                            className="block text-center rounded-2xl bg-cyan-500/10 py-3.5 text-xs font-bold uppercase tracking-widest text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500/20 transition-all"
                        >
                            Open in Google Maps
                        </a>
                    </div>
                )}
            </div>

            <div className="order-1 lg:order-2 lg:col-span-2">
                <div className="mb-8 rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-10 md:mb-12">
                   <h2 className="text-2xl font-bold mb-4 sm:text-3xl sm:mb-6">About this spot</h2>
                   <div className="prose prose-invert prose-cyan max-w-none text-sm text-slate-400 leading-relaxed sm:text-base">
                        {location.description ? <PortableText value={location.description} /> : <p>Visit our location for freshly baked goods and artisanal coffee served with a smile.</p>}
                   </div>
                </div>

                <h2 className="mb-6 border-b border-white/10 pb-4 text-xl font-bold sm:text-3xl sm:mb-8">Stories from this bakery</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                    {location.posts?.map((post: any) => {
                        const postImg = post.mainImage || post.imageUrl;
                        return (
                        <Link key={post._id} href={`/posts/${post.slug?.current}`} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1.5 transition-all hover:bg-white/10">
                            {postImg && (
                                <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem]">
                                    <Image src={postImg as string} alt={post.title || "Post"} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                                </div>
                            )}
                            <div className="p-5 sm:p-6">
                                <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 leading-tight mb-3 transition-colors sm:text-lg">{post.title}</h3>
                                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                    <Calendar size={12} className="text-cyan-400" />
                                    <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                                </div>
                            </div>
                        </Link>
                    )})}
                </div>
                {location.posts?.length === 0 && <p className="text-slate-500 italic">No stories published from this location yet.</p>}
            </div>
        </div>
      </div>
    </div>
  );
}
