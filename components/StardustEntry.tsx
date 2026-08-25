"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function StardustEntry({ onComplete }: { onComplete: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full window dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let animationFrameId: number;
    const particles: any[] = [];
    const particleCount = 150;

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        opacity: Math.random(),
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    // Animation Loop
    const render = () => {
      ctx.fillStyle = "rgba(8, 28, 21, 0.3)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        p.opacity += p.pulseSpeed;
        if (p.opacity >= 1 || p.opacity <= 0.1) {
          p.pulseSpeed *= -1;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249, 229, 150, ${Math.abs(p.opacity)})`;
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // GSAP Timeline to fade out the container smoothly
    const tl = gsap.timeline();

    tl.to(containerRef.current, {
      opacity: 0,
      duration: 1.5,
      delay: 3.5, // Duration before fading into main invite
      ease: "power2.inOut",
      onComplete: () => {
        cancelAnimationFrame(animationFrameId);
        onComplete();
      }
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      tl.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-forest-deep w-screen h-screen overflow-hidden"
    >
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Perfectly Centered Monogram Initials */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center">
        <h2 className="text-gold-light font-script text-6xl md:text-8xl tracking-wider drop-shadow-[0_0_25px_rgba(249,229,150,0.7)] animate-pulse">
          I & J
        </h2>
        <span className="text-gold-muted font-serif text-[10px] md:text-xs tracking-[0.3em] uppercase mt-4 opacity-80">
          Loading Invitation...
        </span>
      </div>
    </div>
  );
}