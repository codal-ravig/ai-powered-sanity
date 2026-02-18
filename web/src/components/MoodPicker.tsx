"use client";

import { motion } from "framer-motion";
import { Coffee, Sparkles, CloudRain, Moon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Mood = {
  _id: string;
  title: string | null;
  slug: { current: string | null } | null;
  description: string | null;
  colorStart: string | null;
  colorEnd: string | null;
};

const MOOD_ICONS: Record<string, any> = {
  "Morning Ritual": Coffee,
  "Celebration": Sparkles,
  "Comfort": CloudRain,
  "Midnight Snack": Moon,
};

export function MoodPicker({ moods }: { moods: Mood[] }) {
  const searchParams = useSearchParams();
  const activeMood = searchParams.get("mood");

  if (!moods || moods.length === 0) return null;

  return (
    <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
      <div className="mb-10 flex flex-col items-center gap-2 text-center md:items-start md:text-left">
        <h2 className="text-xl font-bold uppercase tracking-[0.2em] text-slate-500 md:text-2xl">How are you feeling?</h2>
        <p className="text-sm text-slate-400">Choose a mood to explore our stories.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:gap-6">
        {moods.map((mood, index) => {
          const Icon = MOOD_ICONS[mood.title || ""] || Sparkles;
          const isSelected = activeMood === mood.slug?.current;
          
          const gradientStyle = mood.colorStart && mood.colorEnd 
            ? { background: `linear-gradient(135deg, ${mood.colorStart}22, ${mood.colorEnd}22)` } 
            : {};
          
          const borderStyle = mood.colorStart 
            ? { borderColor: isSelected ? mood.colorStart : `${mood.colorStart}44` } 
            : {};

          return (
            <Link 
              key={mood._id} 
              href={isSelected ? "/" : `/?mood=${mood.slug?.current}`}
              scroll={false}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`group relative flex flex-col items-center gap-4 overflow-hidden rounded-[2rem] border p-6 text-center transition-all md:p-8 ${isSelected ? 'bg-white/15 ring-2 ring-white/20 shadow-2xl' : 'bg-white/5 hover:bg-white/10'}`}
                style={borderStyle}
              >
                <div 
                  className={`absolute inset-0 transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
                  style={{ background: `linear-gradient(135deg, ${mood.colorStart}${isSelected ? '66' : '44'}, ${mood.colorEnd}${isSelected ? '66' : '44'})` }}
                />
                
                <div 
                  className={`relative flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 text-slate-300 transition-colors group-hover:text-white md:h-16 md:w-16 ${isSelected ? 'text-white' : ''}`}
                  style={gradientStyle}
                >
                  <Icon size={24} className="md:size-32" />
                </div>
                
                <div className="relative">
                  <h3 className={`text-sm font-bold uppercase tracking-widest transition-colors md:text-base ${isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'}`}>
                    {mood.title}
                  </h3>
                  <p className={`mt-2 hidden text-[10px] leading-relaxed transition-colors sm:block ${isSelected ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {mood.description}
                  </p>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
