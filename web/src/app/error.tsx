"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center p-6 text-center">
      <div className="mb-6 rounded-full bg-red-500/10 p-4 text-red-500">
        <AlertTriangle size={48} />
      </div>
      <h2 className="mb-2 text-2xl font-bold text-white">Something went wrong</h2>
      <p className="mb-8 max-w-md text-slate-400">
        We encountered an error while loading this page. This might be a temporary connection issue.
      </p>
      
      <div className="flex flex-wrap items-center justify-center gap-4">
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 rounded-full bg-indigo-500 px-6 py-3 font-bold text-white transition-all hover:bg-indigo-400 active:scale-95"
        >
          <RefreshCcw size={18} />
          Try again
        </button>
        
        <Link
          href="/"
          className="rounded-full bg-white/5 px-6 py-3 font-bold text-slate-300 transition-all hover:bg-white/10"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
