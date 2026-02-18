import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
      }, {
        protocol: 'https',
        hostname: 'maps.googleapis.com',
      },
    ],
  },
};

export default nextConfig;
