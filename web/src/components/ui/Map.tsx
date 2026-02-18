"use client";

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/lib/utils';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  lat: number;
  lng: number;
  zoom?: number;
  className?: string;
  name?: string;
}

export function Map({ lat, lng, zoom = 14, className, name }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className={cn("bg-black/20 animate-pulse rounded-2xl", className)} />;

  return (
    <div className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-black shadow-2xl transition-all z-0", className)}>
      <MapContainer 
        center={[lat, lng]} 
        zoom={zoom} 
        scrollWheelZoom={false}
        className="h-full w-full"
        zoomControl={false}
      >
        {/* Using CartoDB Dark Matter tiles - Beautiful dark theme, no token needed */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[lat, lng]}>
          {name && (
            <Popup>
              <div className="text-sm font-bold">{name}</div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
      
      {/* Decorative glass overlay to soften the edges */}
      <div className="absolute inset-0 pointer-events-none border border-white/5 rounded-2xl shadow-[inset_0_0_40px_rgba(0,0,0,0.4)]" />
    </div>
  );
}
