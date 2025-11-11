'use client';

import React, { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export function GameStartBg({ children }: { children?: React.ReactNode }) {
  const [polylinePoints, setPolylinePoints] = useState<string>("");

  // 只在客户端计算 polyline points，避免 SSR 和客户端不匹配
  useEffect(() => {
    const points = Array.from({ length: 1920 }, (_, x) =>
      `${x},${540 + Math.sin(x / 120) * 200 * 0.4}`
    ).join(" ");
    setPolylinePoints(points);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />

      {/* Grid pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-10"
        width="100%" 
        height="100%" 
        viewBox="0 0 1920 1080"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        {[...Array(20)].map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * 96}
            y1={0}
            x2={i * 96}
            y2={1080}
            stroke="currentColor"
            strokeWidth="1"
            className="text-white"
          />
        ))}
        {[...Array(12)].map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={i * 90}
            x2={1920}
            y2={i * 90}
            stroke="currentColor"
            strokeWidth="1"
            className="text-white"
          />
        ))}
        {polylinePoints && (
          <polyline
            points={polylinePoints}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white opacity-20"
          />
        )}
      </svg>

      {/* Mathematical symbols decoration */}
      <div className="absolute left-12 top-16 text-6xl text-white/10 select-none pointer-events-none font-serif">∑</div>
      <div className="absolute right-24 top-32 text-5xl text-white/10 select-none pointer-events-none font-serif">π</div>
      <div className="absolute left-1/3 bottom-24 text-7xl text-white/5 select-none pointer-events-none font-serif">∫</div>
      <div className="absolute right-1/4 bottom-1/4 text-5xl text-white/8 select-none pointer-events-none font-serif">∞</div>
      <div className="absolute left-1/2 top-1/2 text-4xl text-white/5 select-none pointer-events-none font-serif">√</div>
      
      {/* Content */}
      <div className="relative z-10 flex items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
} 