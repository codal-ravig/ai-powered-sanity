import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
      <h1 className="mb-4 text-9xl font-extrabold tracking-widest text-indigo-500">
        404
      </h1>
      <div className="absolute rotate-12 rounded bg-indigo-500 px-2 text-sm">
        Post Not Found
      </div>
      <p className="mt-8 text-xl text-slate-400">
        The story you&apos;re looking for has vanished from our oven.
      </p>
      <Link
        href="/"
        className="mt-12 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-3 text-sm font-medium transition-all hover:bg-white/10 hover:text-indigo-400"
      >
        <ArrowLeft size={16} /> Back to home
      </Link>
    </div>
  );
}
