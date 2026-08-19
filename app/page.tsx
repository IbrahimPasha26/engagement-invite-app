'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Heart, Calendar, MapPin, Clock } from 'lucide-react';
import gsap from 'gsap';
import RSVPSection from '@/components/RSVPSection';

export default function Home() {
  // Engagement Date: November 15, 2026, 6:00 PM
  const engagementDate = new Date('2026-11-15T18:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const countdownRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = engagementDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    }, 1000);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      if (headerRef.current) tl.from(headerRef.current, { y: -30, opacity: 0, duration: 1 });
      if (heroRef.current) tl.from(heroRef.current, { y: 30, opacity: 0, duration: 1 }, '-=0.6');
      if (countdownRef.current) tl.from(countdownRef.current, { scale: 0.9, opacity: 0, duration: 0.8 }, '-=0.5');
      if (cardRef.current) tl.from(cardRef.current, { y: 40, opacity: 0, duration: 1 }, '-=0.4');
    }, containerRef);

    return () => {
      clearInterval(timer);
      ctx.revert();
    };
  }, [engagementDate]);

  return (
    <main
      ref={containerRef}
      className="relative min-h-screen bg-slate-950 text-white flex flex-col items-center justify-between p-6 overflow-hidden selection:bg-rose-500 selection:text-white"
    >
      {/* Ambient Background Glow (Badge Removed) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-600/30 rounded-full blur-3xl animate-pulse duration-1000" />
      </div>

      {/* Top Header / Branding */}
      <div ref={headerRef} className="w-full max-w-md text-center pt-8 z-10">
        <span className="text-xs uppercase tracking-[0.3em] text-rose-400 font-medium">
          You're Invited To The Engagement Of
        </span>
      </div>

      {/* Hero Couple Section */}
      <div ref={heroRef} className="w-full max-w-md text-center my-auto py-10 space-y-6 z-10">
        <div className="inline-block p-4 rounded-full bg-rose-500/10 border border-rose-500/20 animate-pulse">
          <Heart className="w-8 h-8 text-rose-400 mx-auto" />
        </div>

        <h1 className="text-3xl md:text-4xl font-serif tracking-wide text-rose-100 leading-tight">
          Ibrahim Pasha J <span className="block text-rose-400 font-light text-2xl my-1">&</span> Jaweriya Mohammadi
        </h1>

        <p className="text-sm text-slate-300 max-w-xs mx-auto font-light leading-relaxed">
          Together with our families, we joyfully invite you to celebrate our engagement as we begin our forever.
        </p>

        {/* Live Countdown Grid */}
        <div ref={countdownRef} className="grid grid-cols-4 gap-2 pt-6 max-w-xs mx-auto">
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-2xl font-bold text-rose-300">{timeLeft.days}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Days</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-2xl font-bold text-rose-300">{timeLeft.hours}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Hours</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-2xl font-bold text-rose-300">{timeLeft.minutes}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Mins</span>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-xl p-3 backdrop-blur-sm">
            <span className="block text-2xl font-bold text-rose-300">{timeLeft.seconds}</span>
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Secs</span>
          </div>
        </div>
      </div>

      {/* Event Details & RSVP Card Container */}
      <div ref={cardRef} className="w-full max-w-md space-y-4 mb-6 z-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4 shadow-2xl">
          <div className="flex items-center space-x-3 text-slate-200">
            <Calendar className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Date</p>
              <p className="text-slate-400 text-xs">November 15, 2026</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-slate-200">
            <Clock className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Time</p>
              <p className="text-slate-400 text-xs">6:00 PM Onwards</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 text-slate-200">
            <MapPin className="w-5 h-5 text-rose-400 shrink-0" />
            <div className="text-sm">
              <p className="font-medium">Location</p>
              <p className="text-slate-400 text-xs">Bangalore, Karnataka</p>
            </div>
          </div>
        </div>

        {/* RSVP Form Component */}
        <RSVPSection />
      </div>

      <div className="text-center text-[10px] text-slate-500 pb-2 z-10">
        Crafted with love • Live on Vercel
      </div>
    </main>
  );
}