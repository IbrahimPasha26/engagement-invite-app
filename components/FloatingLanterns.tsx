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
    // 70 Twinkling ambient 4-point stars
    const generatedStars: TwinklingStar[] = Array.from({ length: 70 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3.5 + 2}px`,
      animationDuration: `${Math.random() * 3.5 + 2.5}s`,
      animationDelay: `-${Math.random() * 5}s`,
    }));

    // 55 Drifters moving at a calm, serene pace (30s to 55s)
    const generatedDrifters: DriftingElement[] = Array.from({ length: 55 }).map((_, i) => {
      const isHeart = Math.random() < 0.65;
      const duration = Math.random() * 25 + 30; // Calm 30s – 55s cycle

      return {
        id: i,
        type: isHeart ? "heart" : "lantern",
        top: `${Math.random() * 95}%`,
        direction: i % 2 === 0 ? "left-to-right" : "right-to-left",
        animationDuration: `${duration.toFixed(2)}s`,
        animationDelay: `-${(Math.random() * duration).toFixed(2)}s`,
        scale: isHeart ? Math.random() * 0.4 + 0.55 : Math.random() * 0.3 + 0.55,
        opacity: Math.random() * 0.3 + 0.6,
      };
    });

    setStars(generatedStars);
    setDriftingItems(generatedDrifters);
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none w-full h-full">
      {/* LAYER A: Sparkling 4-Pointed Stars */}
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
            filter: "drop-shadow(0 0 6px rgba(249, 229, 150, 0.8))",
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
            opacity: el.opacity,
          }}
        >
          {el.type === "lantern" ? (
            <div className="relative w-7 h-11 bg-gradient-to-b from-[#ffe066] via-[#f59e0b] to-[#b45309] rounded-sm shadow-[0_0_24px_rgba(245,158,11,0.75)] flex justify-center">
              <div className="absolute -top-2 w-4 h-2.5 border-t-2 border-x-2 border-[#b89851] rounded-t-full"></div>
              <div className="absolute top-1.5 w-3.5 h-7 bg-white/30 blur-[2px] rounded-full"></div>
              <div className="absolute -bottom-1.5 w-2 h-1 bg-[#854d0e] rounded-b-sm"></div>
            </div>
          ) : (
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