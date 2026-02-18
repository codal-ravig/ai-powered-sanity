"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

type NavItem = {
  title: string | null;
  linkType: "internal" | "external" | null;
  externalLink?: string | null;
  internalLink?: {
    _type: string;
    slug: string | null;
  } | null;
};

type HeaderProps = {
  config: {
    title: string | null;
    headerNav: NavItem[] | null;
  } | null;
};

export function Header({ config }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getHref = (item: NavItem) => {
    // Handle Internal Links (Sanity Documents)
    if (item.linkType === "internal" && item.internalLink) {
        const { _type, slug } = item.internalLink;
        if (!slug) return "#";
        
        switch (_type) {
          case "category": return `/categories/${slug}`;
          case "location": return `/locations/${slug}`;
          case "page": return `/${slug}`;
          default: return "/";
        }
    }
    
    // Handle External Links (URLs or Relative Paths)
    if (item.linkType === "external" && item.externalLink) {
        return item.externalLink;
    }
    
    return "#";
  };

  const navItems = config?.headerNav && config.headerNav.length > 0 
    ? config.headerNav 
    : [
        { title: "Categories", linkType: "external", externalLink: "/categories" },
        { title: "Locations", linkType: "external", externalLink: "/locations" },
      ] as NavItem[];

  const titleParts = (config?.title || "Bakery Chronicles").split(" ");
  const firstPart = titleParts[0];
  const restParts = titleParts.slice(1).join(" ");

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md transition-all duration-500 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tighter text-indigo-400 uppercase md:text-xl">
          {firstPart}
          {restParts && <span className="text-white ml-1">{restParts}</span>}
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {navItems.map((item, idx) => (
            <Link
              key={idx}
              href={getHref(item)}
              className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <button 
          className="p-2 text-slate-400 hover:text-white md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="absolute left-0 top-full w-full border-b border-white/10 bg-slate-950/95 p-6 backdrop-blur-xl animate-in fade-in slide-in-from-top-5 duration-300 md:hidden">
          <nav className="flex flex-col gap-6">
            {navItems.map((item, idx) => (
              <Link
                key={idx}
                href={getHref(item)}
                onClick={() => setIsOpen(false)}
                className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-indigo-400"
              >
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
