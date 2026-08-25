"use client";

import { useEffect, useState } from "react";

type HeartPalette = {
  fill: string;
  glow: string;
};

const LUXURY_PALETTES: HeartPalette[] = [
  { fill: "#f1d37e", glow: "rgba(241, 211, 126, 0.85)" }, // Champagne Gold
  { fill: "#f4a896", glow: "rgba(244, 168, 150, 0.8)" },  // Soft Rose Gold
  { fill: "#fdfbf7", glow: "rgba(253, 251, 247, 0.9)" },  // Celestial Pearl
  { fill: "#5eead4", glow: "rgba(94, 234, 212, 0.75)" },  // Luminous Emerald Mint
  { fill: "#ffd700", glow: "rgba(255, 215, 0, 0.85)" },   // Warm 24K Gold
];

type HeartShape = "classic" | "slender" | "petite" | "outline" | "crystal";

type DriftingElement = {
  id: number;
  shape: HeartShape;
  top: string;
  direction: "left-to-right" | "right-to-left";
  animationDuration: string;
  animationDelay: string;
  scale: number;
  opacity: number;
  palette: HeartPalette;
  rotation: number;
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
    // 50 Subtle Twinkling background stars
    const generatedStars: TwinklingStar[] = Array.from({ length: 50 }).map((_, i) => ({
      id: i,
      top: `${Math.random() * 100}%`,
      left: `${Math.random() * 100}%`,
      size: `${Math.random() * 3 + 1.5}px`,
      animationDuration: `${Math.random() * 4 + 3}s`,
      animationDelay: `-${Math.random() * 6}s`,
    }));

    const shapes: HeartShape[] = ["classic", "slender", "petite", "outline", "crystal"];

    // Reduced density: 30 perfectly balanced, varied elements
    const generatedDrifters: DriftingElement[] = Array.from({ length: 30 }).map((_, i) => {
      const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
      const duration = Math.random() * 26 + 32; // Calm 32s – 58s drift cycle
      const selectedPalette = LUXURY_PALETTES[Math.floor(Math.random() * LUXURY_PALETTES.length)];

      return {
        id: i,
        shape: shapeType,
        top: `${Math.random() * 92 + 3}%`,
        direction: i % 2 === 0 ? "left-to-right" : "right-to-left",
        animationDuration: `${duration.toFixed(2)}s`,
        animationDelay: `-${(Math.random() * duration).toFixed(2)}s`,
        scale: Math.random() * 0.45 + 0.55,
        opacity: Math.random() * 0.35 + 0.55,
        palette: selectedPalette,
        rotation: (Math.random() - 0.5) * 24,
      };
    });

    setStars(generatedStars);
    setDriftingItems(generatedDrifters);
  }, []);

  const renderShape = (el: DriftingElement) => {
    const style = {
      color: el.palette.fill,
      filter: `drop-shadow(0 0 10px ${el.palette.glow})`,
      transform: `rotate(${el.rotation}deg)`,
    };

    switch (el.shape) {
      case "slender":
        // Elongated Elegant Heart
        return (
          <svg viewBox="0 0 24 28" fill="currentColor" style={style} className="w-4 h-6 animate-heartbeat">
            <path d="M12 26C11 23 2 15 2 8a6 6 0 0 1 10-4.5A6 6 0 0 1 22 8c0 7-9 15-10 18z" />
          </svg>
        );
      case "petite":
        // Soft Petite Curved Heart
        return (
          <svg viewBox="0 0 24 22" fill="currentColor" style={style} className="w-4 h-4 animate-heartbeat">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        );
      case "outline":
        // Delicate Outlined Filigree Heart
        return (
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            style={style}
            className="w-5 h-5 animate-pulse"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
        );
      case "crystal":
        // Radiant 8-Point Diamond Crystal
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={style} className="w-5 h-5 animate-pulse">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
            <circle cx="12" cy="12" r="1.5" fill="#ffffff" />
          </svg>
        );
      case "classic":
      default:
        // Classical Royal Curved Heart
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" style={style} className="w-5 h-5 animate-heartbeat">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-3.83-2.94c-2.2-2.214-4.04-4.577-4.04-7.447C3.746 7.64 6.25 5.5 9.15 5.5c1.71 0 3.32.88 4.35 2.27 1.03-1.39 2.64-2.27 4.35-2.27 2.9 0 5.404 2.14 5.404 5.008 0 2.87-1.84 5.233-4.04 7.447a15.246 15.246 0 01-3.83 2.94l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
          </svg>
        );
    }
  };

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

      {/* LAYER B: Asymmetric Multi-Silhouette Hearts & Crystals */}
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
          <div className="p-1">{renderShape(el)}</div>
        </div>
      ))}
    </div>
  );
}