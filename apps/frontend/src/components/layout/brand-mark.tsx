"use client";

import { Orbit, Sparkles } from "lucide-react";

interface BrandMarkProps {
  inverted?: boolean;
}

export function BrandMark({ inverted = false }: BrandMarkProps) {
  return (
    <span
      className={`relative inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${
        inverted
          ? "border-white/18 bg-white/10 text-white"
          : "border-brand/20 bg-brand/12 text-brand"
      }`}
    >
      <Orbit className="h-4.5 w-4.5" strokeWidth={2} />
      <Sparkles
        className={`absolute -right-1 -top-1 h-3.5 w-3.5 ${
          inverted ? "text-white/80" : "text-sky-500"
        }`}
        strokeWidth={2}
      />
    </span>
  );
}
