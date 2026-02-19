import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SanityLive } from "@/sanity/live";
import { Header } from "@/components/Header";
import { sanityFetch } from "@/sanity/live";
import { SITE_CONFIG_QUERY } from "@/sanity/queries/site";
import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { DisableDraftMode } from "@/components/DisableDraftMode";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const { data: config } = await sanityFetch({ 
    query: SITE_CONFIG_QUERY,
    stega: false // Critical: no stega for metadata
  });
  return {
    title: {
        template: `%s | ${config?.title || "Bakery Chronicles"}`,
        default: config?.title || "Bakery Chronicles",
    },
    description: "Artisanal stories from our oven",
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: config } = await sanityFetch({ query: SITE_CONFIG_QUERY });

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#020617] text-slate-100 flex flex-col min-h-screen`}
      >
        <Header config={config} />
        <main className="grow">
            {children}
        </main>
        <footer className="w-full border-t border-white/10 bg-slate-950/50 py-12 px-4 backdrop-blur-md">
            <div className="container mx-auto text-center">
                <p className="text-sm text-slate-500">
                    {config?.footerText || `© ${new Date().getFullYear()} ${config?.title || "Bakery Chronicles"}. Built with Sanity.`}
                </p>
            </div>
        </footer>
        <SanityLive />
        {(await draftMode()).isEnabled && (
          <>
            <DisableDraftMode />
            <VisualEditing />
          </>
        )}
      </body>
    </html>
  );
}
