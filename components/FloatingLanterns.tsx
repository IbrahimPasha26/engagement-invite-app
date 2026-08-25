"use client";

import { useEffect, useState } from "react";

type DriftingElement = {
  id: number;
  type: "lantern" | "heart";
  top: string;
  direction: "left-to-right" | "right-to-left";
  animationDuration: string;
  animationDelay: string;
  scale: number;
};

type TwinklingStar = {
  id: number;
  top: string;
  left: string;
  size: string;
  animationDuration: string;
  animationDelay: string;
};

export default function FloatingLanterns() {
  const [driftingItems, setDriftingItems] = useState<DriftingElement[]>([]);
  const [stars, setStars] = useState<TwinklingStar[]>([]);

  useEffect(() => {
    const generatedStars: TwinklingStar[] = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 4 + 2}px`,
      animationDuration: `${Math.random() * 3 + 2}s`,
      animationDelay: `${Math.random() * 4}s`,
    }));

    // Slower, graceful drift durations (22s to 38s)
    const generatedDrifters: DriftingElement[] = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      type: Math.random() > 0.5 ? "lantern" : "heart",
      top: `${Math.random() * 100}%`,
      direction: i % 2 === 0 ? "left-to-right" : "right-to-left",
      animationDuration: `${Math.random() * 16 + 22}s`,
      animationDelay: `${Math.random() * 10}s`,
      scale: Math.random() * 0.4 + 0.6,
    }));

    setStars(generatedStars);
    setDriftingItems(generatedDrifters);
  }, []);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      {/* LAYER A: Real Glowing Four-Pointed Star Shapes */}
      {stars.map((star) => (
        <svg
          key={`star-${star.id}`}
          className="absolute text-gold-light animate-pulse opacity-80"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            filter: "drop-shadow(0 0 6px rgba(249, 229, 150, 0.9))",
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      ))}

      {/* LAYER B: Horizontally Drifting Lanterns & Hearts */}
      {driftingItems.map((el) => (
        <div
          key={`drifter-${el.id}`}
          className={`absolute ${el.direction === "left-to-right" ? "drift-ltr" : "drift-rtl"}`}
          style={{
            top: el.top,
            animationDuration: el.animationDuration,
            animationDelay: el.animationDelay,
            transform: `scale(${el.scale})`,
          }}
        >
          {el.type === "lantern" ? (
            <div className="relative w-8 h-12 bg-gradient-to-b from-[#ffed4a] to-[#f6993f] rounded-sm shadow-[0_0_20px_rgba(249,229,150,0.8)] opacity-85 flex justify-center">
              <div className="absolute -top-2.5 w-5 h-3 border-t-2 border-x-2 border-gold-muted rounded-t-full"></div>
              <div className="absolute top-1.5 w-4 h-8 bg-white/25 blur-[2px] rounded-full"></div>
            </div>
          ) : (
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6 text-gold-light drop-shadow-[0_0_12px_rgba(249,229,150,0.8)] opacity-85"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-3.83-2.94c-2.2-2.214-4.04-4.577-4.04-7.447C3.746 7.64 6.25 5.5 9.15 5.5c1.71 0 3.32.88 4.35 2.27 1.03-1.39 2.64-2.27 4.35-2.27 2.9 0 5.404 2.14 5.404 5.008 0 2.87-1.84 5.233-4.04 7.447a15.246 15.246 0 01-3.83 2.94l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
          )}
        </div>
      ))}
    </div>
  );
}