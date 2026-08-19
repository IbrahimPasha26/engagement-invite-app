'use client';

import React, { useEffect, useState } from 'react';
import { Heart, Calendar, MapPin, Clock } from 'lucide-react';
import FloatingHearts3D from '@/components/FloatingHearts3D';

export default function Home() {
  // Target engagement date (adjust this to your exact date, 4 months out)
  const engagementDate = new Date('2026-12-25T18:00:00').getTime();
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

    return () => clearInterval(timer);
  }, [engagementDate]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-950 via-slate-900 to-black text-white flex flex-col items-center justify-between p-6 selection:bg-rose-500 selection:text-white">
      {/* Top Header / Branding */}
      <div className="w-full max-w-md text-center pt-8">
        <span className="text-xs uppercase tracking-[0.3em] text-rose-400 font-medium">
          You're Invited To The Engagement Of
        </span>
      </div>

      {/* Hero Couple Section */}
      <div className="w-full max-w-md text-center my-auto py-10 space-y-6">
        <div className="inline-block p-4 rounded-full bg-rose-500/10 border border-rose-500/20 animate-pulse">
          <Heart className="w-8 h-8 text-rose-400 mx-auto" />
        </div>
        
        <h1 className="text-4xl md:text-5xl font-serif tracking-wide text-rose-100">
          Ibrahim <span className="text-rose-400 font-light">&</span> Partner
        </h1>

        <p className="text-sm text-slate-300 max-w-xs mx-auto font-light leading-relaxed">
          Together with our families, we joyfully invite you to celebrate our engagement as we begin our forever.
        </p>

        {/* Live Countdown Grid */}
        <div className="grid grid-cols-4 gap-2 pt-6 max-w-xs mx-auto">
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

      {/* Event Details Card */}
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-5 backdrop-blur-md space-y-4 mb-6 shadow-2xl">
        <div className="flex items-center space-x-3 text-slate-200">
          <Calendar className="w-5 h-5 text-rose-400 shrink-0" />
          <div className="text-sm">
            <p className="font-medium">Date</p>
            <p className="text-slate-400 text-xs">December 25, 2026</p>
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

      {/* Footer copyright / Live status */}
      <div className="text-center text-[10px] text-slate-500 pb-2">
        Crafted with love • Live on Vercel
      </div>
    </main>
  );
}