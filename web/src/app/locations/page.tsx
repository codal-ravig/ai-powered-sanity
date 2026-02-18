import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, ArrowRight, Building2 } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Locations | Bakery Chronicles",
  description: "Find your nearest bakery location. Visit us for freshly baked goods and artisanal coffee.",
};

const LOCATIONS_QUERY = defineQuery(/* groq */ `
  *[_type == "location"] | order(name asc) {
    _id,
    name,
    slug,
    address,
    "image": image.asset->url,
    imageUrl,
    "postCount": count(*[_type == "post" && references(^._id)])
  }
`);

export default async function LocationsPage() {
  const locations = await client.fetch(LOCATIONS_QUERY);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-6 py-20 font-sans">
      <div className="container mx-auto max-w-5xl">
        <Link href="/" className="mb-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} /> All stories
        </Link>

        <header className="mb-16">
          <h1 className="text-6xl font-extrabold tracking-tight mb-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent pb-2">Our Bakery Locations</h1>
          <p className="text-xl text-slate-400">Visit us in person at our neighborhood spots.</p>
        </header>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => {
            const locImg = location.image || location.imageUrl;
            return (
              <Link key={location._id} href={`/locations/${location.slug?.current}`} className="group relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-2 transition-all hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)] backdrop-blur-xl">
                <div className="relative aspect-video w-full overflow-hidden rounded-[2rem] bg-white/5">
                  {locImg ? (
                    <Image src={locImg} alt={location.name || "Location"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-cyan-500/10 text-cyan-400">
                      <Building2 size={48} />
                    </div>
                  )}
                  <div className="absolute top-4 right-4 rounded-full bg-black/60 backdrop-blur-md px-4 py-1.5 text-xs font-bold border border-white/10 text-cyan-400">
                    {location.postCount} posts
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 group-hover:text-cyan-300 transition-colors">{location.name}</h2>
                  <div className="flex items-start gap-2 text-slate-400 text-sm mb-6">
                    <MapPin size={16} className="text-cyan-400 shrink-0 mt-0.5" />
                    <span>{location.address?.street}, {location.address?.city}, {location.address?.state} {location.address?.zip}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-xs text-cyan-400 group-hover:gap-4 transition-all uppercase tracking-widest">
                    View Location Stories <ArrowRight size={14} />
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
