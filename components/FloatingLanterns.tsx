"use client";

import { useEffect, useState } from "react";

type DriftingElement = {
  id: number;
  type: "crystal" | "heart";
  top: string;
  direction: "left-to-right" | "right-to-left";
  animationDuration: string;
  animationDelay: string;
  scale: number;
  opacity: number;
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
    // 75 Sparkling background stars
    const generatedStars: TwinklingStar[] = Array.from({ length: 75 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3.5 + 2}px`,
      animationDuration: `${Math.random() * 3.5 + 2.5}s`,
      animationDelay: `-${Math.random() * 5}s`,
    }));

    // 50 Drifting golden hearts and celestial sparkle gems (30s – 55s cycle)
    const generatedDrifters: DriftingElement[] = Array.from({ length: 50 }).map((_, i) => {
      const isHeart = Math.random() < 0.7; // 70% hearts, 30% starburst crystals
      const duration = Math.random() * 25 + 30;

      return {
        id: i,
        type: isHeart ? "heart" : "crystal",
        top: `${Math.random() * 95}%`,
        direction: i % 2 === 0 ? "left-to-right" : "right-to-left",
        animationDuration: `${duration.toFixed(2)}s`,
        animationDelay: `-${(Math.random() * duration).toFixed(2)}s`,
        scale: isHeart ? Math.random() * 0.45 + 0.55 : Math.random() * 0.35 + 0.6,
        opacity: Math.random() * 0.3 + 0.6,
      };
    });

    setStars(generatedStars);
    setDriftingItems(generatedDrifters);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      {/* LAYER A: Ambient 4-Point Stars */}
      {stars.map((star) => (
        <svg
          key={`star-${star.id}`}
          className="absolute text-[#f9e596] animate-pulse"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            animationDuration: star.animationDuration,
            animationDelay: star.animationDelay,
            filter: "drop-shadow(0 0 6px rgba(249, 229, 150, 0.85))",
          }}
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
        </svg>
      ))}

      {/* LAYER B: Floating Golden Hearts & Radiant Diamond Crystals */}
      {driftingItems.map((el) => (
        <div
          key={`drifter-${el.id}`}
          className={`absolute ${el.direction === "left-to-right" ? "drift-ltr" : "drift-rtl"}`}
          style={{
            top: el.top,
            animationDuration: el.animationDuration,
            animationDelay: el.animationDelay,
            transform: `scale(${el.scale})`,
            opacity: el.opacity,
          }}
        >
          {el.type === "crystal" ? (
            /* Celestial Diamond Crystal Starburst */
            <div className="relative p-1">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-6 h-6 text-[#f5d061] drop-shadow-[0_0_15px_rgba(245,208,97,0.9)] animate-pulse"
              >
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
                <circle cx="12" cy="12" r="2" fill="#ffffff" />
              </svg>
            </div>
          ) : (
            /* Glowing Floating Heart */
            <div className="relative p-1">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="w-5 h-5 text-[#f1d37e] drop-shadow-[0_0_12px_rgba(241,211,126,0.9)] animate-heartbeat"
              >
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-3.83-2.94c-2.2-2.214-4.04-4.577-4.04-7.447C3.746 7.64 6.25 5.5 9.15 5.5c1.71 0 3.32.88 4.35 2.27 1.03-1.39 2.64-2.27 4.35-2.27 2.9 0 5.404 2.14 5.404 5.008 0 2.87-1.84 5.233-4.04 7.447a15.246 15.246 0 01-3.83 2.94l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}