'use client';

import React from 'react';

export default function FloatingHearts3D() {
  // Generate a set of glowing floating dots/hearts
  const particles = [
    { id: 1, left: '10%', top: '20%', duration: '6s', delay: '0s', size: 'w-3 h-3' },
    { id: 2, left: '85%', top: '15%', duration: '8s', delay: '1s', size: 'w-4 h-4' },
    { id: 3, left: '20%', top: '75%', duration: '7s', delay: '2s', size: 'w-2 h-2' },
    { id: 4, left: '80%', top: '70%', duration: '9s', delay: '1.5s', size: 'w-3 h-3' },
    { id: 5, left: '50%', top: '40%', duration: '10s', delay: '0.5s', size: 'w-5 h-5' },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
      <style jsx>{`
        @keyframes floatSlow {
          0% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-30px) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translateY(0px) scale(1);
            opacity: 0.3;
          }
        }
        .animate-float {
          animation: floatSlow ease-in-out infinite;
        }
      `}</style>

      {particles.map((p) => (
        <div
          key={p.id}
          className={`absolute rounded-full bg-rose-400 shadow-[0_0_15px_#f43f5e] animate-float ${p.size}`}
          style={{
            left: p.left,
            top: p.top,
            animationDuration: p.duration,
            animationDelay: p.delay,
          }}
        />
      ))}
    </div>
  );
}