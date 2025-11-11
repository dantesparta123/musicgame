import React from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function GameLoading() {
  return (
    <div className="fixed inset-0 z-[2000] flex flex-col items-center justify-center bg-slate-900/95 backdrop-blur-sm select-none">
      {/* Mathematical symbols animation */}
      <div className="flex space-x-8 mb-8 animate-pulse">
        <span className="text-5xl text-white/20 font-serif">∑</span>
        <span className="text-4xl text-white/15 font-serif">π</span>
        <span className="text-6xl text-white/10 font-serif">∫</span>
        <span className="text-4xl text-white/15 font-serif">∞</span>
        <span className="text-5xl text-white/20 font-serif">√</span>
      </div>
      
      {/* Loading spinner */}
      <Loader2 className="h-12 w-12 text-white/80 animate-spin mb-6" />
      
      {/* Loading text */}
      <div className="text-xl text-white/80 tracking-widest font-mono">Loading...</div>
    </div>
  );
} 