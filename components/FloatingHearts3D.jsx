'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Sparkles } from 'lucide-react';

export default function FloatingHearts3D() {
  const [particles, setParticles] = useState([]);

  // Generate particles on the client side to prevent Next.js hydration mismatches
  useEffect(() => {
    const particleCount = 25; // Richer density without hurting performance
    const newParticles = Array.from({ length: particleCount }).map((_, i) => {
      // Randomize properties for organic movement
      const size = Math.random() * 16 + 10; // 10px to 26px
      const isHeart = Math.random() > 0.3; // 70% hearts, 30% sparkles

      return {
        id: i,
        left: `${Math.random() * 100}%`,
        // Start from below screen and float up
        bottom: `-${Math.random() * 20 + 10}%`,
        duration: `${Math.random() * 15 + 15}s`, // Slower, elegant floating (15s - 30s)
        delay: `${Math.random() * 10}s`,
        size: size,
        opacity: Math.random() * 0.4 + 0.1, // Subtle transparencies (0.1 - 0.5)
        type: isHeart ? 'heart' : 'sparkle',
        // Alternate between rose and amber for theme matching
        color: Math.random() > 0.5 ? '#f43f5e' : '#fbbf24',
        // X-axis drift distance (-50px to 50px)
        sway: `${(Math.random() - 0.5) * 100}px`,
        // Rotation amount
        rotation: `${(Math.random() - 0.5) * 360}deg`,
      };
    });
    setParticles(newParticles);
  }, []);

  // If client hasn't mounted yet, render nothing to avoid hydration errors
  if (particles.length === 0) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <style jsx>{`
        /* Upward floating animation */
        @keyframes floatUp {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: var(--max-opacity);
          }
          90% {
            opacity: var(--max-opacity);
          }
          100% {
            transform: translateY(-120vh) rotate(var(--rot));
            opacity: 0;
          }
        }

        /* Organic left/right swaying animation */
        @keyframes sway {
          0%, 100% {
            transform: translateX(0px);
          }
          50% {
            transform: translateX(var(--sway-x));
          }
        }

        .particle-container {
          position: absolute;
          animation: floatUp linear infinite;
          /* Use hardware acceleration for perfectly smooth framerates */
          will-change: transform, opacity;
        }

        .particle-sway {
          animation: sway 6s ease-in-out infinite alternate;
          will-change: transform;
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className="particle-container"
          style={{
            left: p.left,
            bottom: p.bottom,
            animationDuration: p.duration,
            animationDelay: p.delay,
            '--max-opacity': p.opacity,
            '--rot': p.rotation,
          }}
        >
          <div
            className="particle-sway"
            style={{
              '--sway-x': p.sway,
              // Randomize sway speed slightly so they don't move in sync
              animationDuration: `${Math.random() * 4 + 4}s`
            }}
          >
            {p.type === 'heart' ? (
              <Heart
                size={p.size}
                fill={p.color}
                color={p.color}
                style={{ filter: `drop-shadow(0 0 8px ${p.color})` }} // Glowing 3D effect
              />
            ) : (
              <Sparkles
                size={p.size}
                color={p.color}
                style={{ filter: `drop-shadow(0 0 6px ${p.color})` }}
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
}