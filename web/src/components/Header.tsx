"use client";

import Link from "next/link";

export function Header() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/50 px-6 py-4 backdrop-blur-md transition-all duration-500">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-xl font-black tracking-tighter text-indigo-400 uppercase">
          Bakery<span className="text-white">Chronicles</span>
        </Link>
        <nav className="flex items-center gap-8">
          <Link
            href="/categories"
            className="hidden sm:block text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/locations"
            className="hidden sm:block text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            Locations
          </Link>
        </nav>
      </div>
    </header>
  );
}
