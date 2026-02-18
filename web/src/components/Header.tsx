"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/10 bg-slate-950/80 px-4 py-4 backdrop-blur-md transition-all duration-500 md:px-6">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-lg font-black tracking-tighter text-indigo-400 uppercase md:text-xl">
          Bakery<span className="text-white">Chronicles</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/categories"
            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            Categories
          </Link>
          <Link
            href="/locations"
            className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors"
          >
            Locations
          </Link>
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
            <Link
              href="/categories"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-indigo-400"
            >
              Categories
            </Link>
            <Link
              href="/locations"
              onClick={() => setIsOpen(false)}
              className="text-sm font-bold uppercase tracking-widest text-slate-300 hover:text-indigo-400"
            >
              Locations
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
