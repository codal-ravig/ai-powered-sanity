"use client";

import dynamic from "next/dynamic";

const Map = dynamic(() => import("@/components/ui/Map").then(mod => mod.Map), { 
  ssr: false,
  loading: () => <div className="h-64 w-full bg-black/20 animate-pulse rounded-2xl border border-white/10" />
});

interface LocationMapProps {
  lat: number;
  lng: number;
  name?: string;
}

export function LocationMap({ lat, lng, name }: LocationMapProps) {
  return (
    <div className="h-64 w-full mb-6 z-0">
      <Map 
        lat={lat} 
        lng={lng} 
        name={name}
        className="h-full w-full"
      />
    </div>
  );
}
