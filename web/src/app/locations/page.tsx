import { defineQuery } from "next-sanity";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, ArrowRight, Building2 } from "lucide-react";
import { Metadata } from "next";
import { LOCATIONS_QUERY_RESULT } from "@/sanity/types";

export const metadata: Metadata = {
  title: "Our Locations",
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
  const locations = await client.fetch<LOCATIONS_QUERY_RESULT>(LOCATIONS_QUERY);

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black text-white px-4 py-32 md:px-6 md:py-48 font-sans transition-colors duration-500">
      <div className="container mx-auto max-w-6xl">
        <Link href="/" className="mb-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-2 text-xs font-medium text-slate-400 hover:text-white transition-all sm:mb-12 sm:px-6 sm:text-sm">
          <ArrowLeft size={16} /> All stories
        </Link>

        <header className="mb-12 sm:mb-16">
          <h1 className="mb-4 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent pb-2 sm:text-5xl md:text-6xl">Our Bakery Locations</h1>
          <p className="text-base text-slate-400 sm:text-lg md:text-xl">Visit us in person at our neighborhood spots.</p>
        </header>

        <div className="grid gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => {
            const locImg = location.image || location.imageUrl;
            return (
              <Link key={location._id} href={`/locations/${location.slug?.current}`} className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-1.5 transition-all hover:bg-white/10 hover:shadow-[0_0_50px_-10px_rgba(6,182,212,0.3)] backdrop-blur-xl sm:rounded-[2.5rem] sm:p-2">
                <div className="relative aspect-video w-full overflow-hidden rounded-[1.5rem] bg-white/5 sm:rounded-[2rem]">
                  {locImg ? (
                    <Image src={locImg as string} alt={location.name || "Location"} fill className="object-cover transition-transform duration-700 group-hover:scale-110" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-cyan-500/10 text-cyan-400">
                      <Building2 size={40} className="sm:size-48" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-[9px] font-bold border border-white/10 text-cyan-400 sm:top-4 sm:right-4 sm:px-4 sm:py-1.5 sm:text-xs">
                    {location.postCount} posts
                  </div>
                </div>
                <div className="p-5 sm:p-6">
                  <h2 className="text-xl font-bold mb-2 group-hover:text-cyan-300 transition-colors sm:text-2xl">{location.name}</h2>
                  <div className="flex items-start gap-2 text-slate-400 text-xs mb-6 sm:text-sm sm:mb-8">
                    <MapPin size={14} className="text-cyan-400 shrink-0 mt-0.5 sm:size-5" />
                    <span className="line-clamp-1">{location.address?.street}, {location.address?.city}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold text-[10px] text-cyan-400 group-hover:gap-4 transition-all uppercase tracking-widest sm:text-xs">
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
