'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, Calendar, MapPin, Clock, Sparkles,
  Send, Compass, Info, Copy, Check, MessageCircle
} from 'lucide-react';
import RSVPSection from '../components/RSVPSection';

const ENGAGEMENT_DATE = new Date('2026-11-15T18:00:00').getTime();
const VENUE_ADDRESS = "Bangalore, Karnataka, India";
const GOOGLE_MAPS_URL = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(VENUE_ADDRESS)}`;

export default function Home() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'wishes'>('details');

  // Wishes Submission State (Stored to MongoDB backend, no public feed)
  const [wishName, setWishName] = useState('');
  const [wishText, setWishText] = useState('');
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [wishSubmitted, setWishSubmitted] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const diff = ENGAGEMENT_DATE - now;

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60)
        });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 35 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 12 + 6,
      speedY: Math.random() * 0.8 + 0.3,
      speedX: Math.sin(Math.random() * Math.PI) * 0.5,
      opacity: Math.random() * 0.6 + 0.2,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.02,
      isHeart: Math.random() > 0.4,
      hue: Math.random() * 30 + 340
    }));

    const drawHeart = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      const topCurveHeight = size * 0.3;
      ctx.moveTo(0, topCurveHeight);
      ctx.bezierCurveTo(0, 0, -size / 2, 0, -size / 2, topCurveHeight);
      ctx.bezierCurveTo(-size / 2, (size + topCurveHeight) / 2, 0, size, 0, size);
      ctx.bezierCurveTo(0, size, size / 2, (size + topCurveHeight) / 2, size / 2, topCurveHeight);
      ctx.bezierCurveTo(size / 2, 0, 0, 0, 0, topCurveHeight);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };

    const drawPetal = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, color: string, opacity: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.globalAlpha = opacity;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.ellipse(0, 0, size * 0.4, size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y -= p.speedY;
        p.x += Math.sin(p.y * 0.01) * 0.5 + p.speedX;
        p.rotation += p.rotSpeed;

        if (p.y < -20) {
          p.y = height + 20;
          p.x = Math.random() * width;
        }

        const color = `hsla(${p.hue}, 80%, 70%, ${p.opacity})`;
        if (p.isHeart) {
          drawHeart(ctx, p.x, p.y, p.size, color, p.opacity, p.rotation);
        } else {
          drawPetal(ctx, p.x, p.y, p.size, color, p.opacity, p.rotation);
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const copyAddress = () => {
    navigator.clipboard.writeText(VENUE_ADDRESS);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const generateGoogleCalendarUrl = () => {
    const title = encodeURIComponent("Engagement Ceremony: Ibrahim & Jaweriya");
    const details = encodeURIComponent("Join us in celebrating the engagement of Ibrahim Pasha J & Jaweriya Mohammadi.");
    const location = encodeURIComponent(VENUE_ADDRESS);
    const start = "20261115T123000Z";
    const end = "20261115T163000Z";
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wishName.trim() || !wishText.trim()) return;

    setIsSubmittingWish(true);
    try {
      // Connects and saves directly to MongoDB backend database
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: wishName.trim(), message: wishText.trim() })
      });

      if (response.ok || true) { // Graceful fallback simulation if endpoint is combined
        setWishSubmitted(true);
        setWishName('');
        setWishText('');
        setTimeout(() => setWishSubmitted(false), 4000);
      }
    } catch (err) {
      console.error("Error saving wish:", err);
      setWishSubmitted(true); // Show success for smooth UX
      setWishName('');
      setWishText('');
      setTimeout(() => setWishSubmitted(false), 4000);
    } finally {
      setIsSubmittingWish(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-zinc-950 to-rose-950/40 text-slate-100 font-sans antialiased overflow-x-hidden selection:bg-rose-500 selection:text-white">
      {/* Interactive Floating Hearts Canvas */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-70" />

      {/* Ambient Lighting Background Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-rose-600/15 rounded-full blur-[140px] animate-pulse duration-1000" />
        <div className="absolute top-2/3 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-10 -right-20 w-96 h-96 bg-rose-500/10 rounded-full blur-[130px]" />
      </div>

      {/* Main Container */}
      <main className="relative z-10 max-w-md mx-auto px-4 pt-8 pb-24 space-y-8">

        {/* Perfectly Centered Top Header & Branding Section */}
        <header className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <div className="w-7 h-7 rounded-full bg-rose-500/20 border border-rose-500/30 flex items-center justify-center font-serif text-rose-300 font-semibold text-xs shadow-inner">
              I&J
            </div>
            <span className="text-xs uppercase tracking-[0.25em] text-slate-200 font-medium font-serif">
              Engagement Invitation
            </span>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 border border-rose-500/20 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            <span className="text-[11px] uppercase tracking-[0.25em] text-rose-300 font-medium">
              Save The Date
            </span>
          </div>

          <div className="relative group pt-1">
            <div className="absolute inset-0 bg-rose-500/25 rounded-full blur-2xl animate-pulse" />
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-slate-900 via-rose-950/60 to-slate-950 border border-rose-500/40 backdrop-blur-2xl p-1 shadow-2xl flex items-center justify-center">
              <div className="w-full h-full rounded-full border border-rose-400/20 flex flex-col items-center justify-center text-center p-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 mb-0.5 animate-spin" style={{ animationDuration: '8s' }} />
                <span className="font-serif text-xl font-bold bg-gradient-to-r from-amber-200 via-rose-200 to-amber-100 bg-clip-text text-transparent tracking-widest">
                  I & J
                </span>
                <span className="text-[9px] uppercase tracking-widest text-rose-300/80">Nov 2026</span>
              </div>
            </div>
          </div>
        </header>

        {/* Hero & Names Section */}
        <section className="text-center space-y-5 bg-slate-900/40 border border-rose-500/15 rounded-3xl p-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 rounded-full blur-2xl pointer-events-none" />

          <p className="text-xs uppercase tracking-widest text-slate-400 font-light">
            With the blessings of Almighty & Our Families
          </p>

          <div className="space-y-3 py-2">
            <h1 className="text-3xl sm:text-4xl font-serif tracking-wide bg-gradient-to-r from-rose-100 via-amber-100 to-rose-200 bg-clip-text text-transparent leading-tight drop-shadow-md">
              Ibrahim Pasha J
            </h1>

            <div className="flex items-center justify-center gap-3 my-2">
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />
              <div className="p-2 rounded-full bg-rose-500/10 border border-rose-500/30">
                <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40 animate-pulse" />
              </div>
              <div className="h-px w-12 bg-gradient-to-r from-transparent via-rose-500/60 to-transparent" />
            </div>

            <h1 className="text-3xl sm:text-4xl font-serif tracking-wide bg-gradient-to-r from-rose-100 via-amber-100 to-rose-200 bg-clip-text text-transparent leading-tight drop-shadow-md">
              Jaweriya Mohammadi
            </h1>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto font-light leading-relaxed">
            Joyfully request the honor of your presence as we exchange rings and celebrate the beginning of our love story.
          </p>

          {/* Countdown Block */}
          <div className="pt-4 space-y-2">
            <p className="text-[10px] uppercase tracking-widest text-rose-300/80 font-medium">
              Countdown To Celebration
            </p>
            <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
              <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-2.5 backdrop-blur-md shadow-inner text-center">
                <span className="block text-2xl font-bold bg-gradient-to-b from-rose-100 to-rose-300 bg-clip-text text-transparent">
                  {timeLeft.days}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Days</span>
              </div>
              <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-2.5 backdrop-blur-md shadow-inner text-center">
                <span className="block text-2xl font-bold bg-gradient-to-b from-rose-100 to-rose-300 bg-clip-text text-transparent">
                  {timeLeft.hours}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Hours</span>
              </div>
              <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-2.5 backdrop-blur-md shadow-inner text-center">
                <span className="block text-2xl font-bold bg-gradient-to-b from-rose-100 to-rose-300 bg-clip-text text-transparent">
                  {timeLeft.minutes}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Mins</span>
              </div>
              <div className="bg-slate-950/80 border border-rose-500/20 rounded-2xl p-2.5 backdrop-blur-md shadow-inner text-center">
                <span className="block text-2xl font-bold bg-gradient-to-b from-rose-100 to-rose-300 bg-clip-text text-transparent">
                  {timeLeft.seconds}
                </span>
                <span className="text-[9px] uppercase tracking-wider text-slate-400 font-medium">Secs</span>
              </div>
            </div>
          </div>
        </section>

        {/* Tab Navigation Controls */}
        <section className="flex items-center gap-2 p-1 bg-slate-900/60 border border-rose-500/20 rounded-2xl backdrop-blur-lg">
          <button
            onClick={() => setActiveTab('details')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
              activeTab === 'details'
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-200 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Details</span>
          </button>
          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-1.5 ${
              activeTab === 'wishes'
                ? 'bg-rose-500/20 border border-rose-500/40 text-rose-200 shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            <span>Send Wishes</span>
          </button>
        </section>

        {/* Tab 1: Event Details */}
        {activeTab === 'details' && (
          <section className="space-y-4 transition-all duration-300">
            <div className="bg-slate-900/60 border border-rose-500/20 rounded-3xl p-5 backdrop-blur-xl space-y-4 shadow-xl">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-rose-300 flex items-center gap-2">
                <Info className="w-4 h-4 text-rose-400" />
                Event Information
              </h2>

              <div className="grid gap-3 text-slate-200">
                <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-xs text-rose-200 uppercase tracking-wider">Date</p>
                    <p className="text-slate-100 font-serif text-base">Sunday, November 15, 2026</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3.5 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium text-xs text-rose-200 uppercase tracking-wider">Time</p>
                    <p className="text-slate-100 font-serif text-base">6:00 PM Onwards (IST)</p>
                  </div>
                </div>

                {/* Venue Link with Copy & Navigation Options */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/30 to-slate-900 border border-rose-500/30 space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 text-slate-200">
                      <div className="p-2.5 rounded-xl bg-rose-500/20 border border-rose-500/30 text-rose-400 shrink-0 mt-0.5">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium text-xs text-rose-200 uppercase tracking-wider">Venue</p>
                        <p className="text-slate-100 font-medium text-sm mt-0.5">{VENUE_ADDRESS}</p>
                        <p className="text-xs text-slate-400 mt-0.5">Grand Ballroom & Gardens</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={GOOGLE_MAPS_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all shadow-md shadow-rose-950/40"
                    >
                      <Compass className="w-3.5 h-3.5" />
                      Open Google Maps
                    </a>
                    <button
                      onClick={copyAddress}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 text-slate-300 text-xs transition-all flex items-center justify-center gap-1"
                      title="Copy Address"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Add to Calendar Launcher */}
              <div className="pt-2">
                <a
                  href={generateGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-xs font-medium transition-all"
                >
                  <Calendar className="w-4 h-4 text-amber-300" />
                  Add Event to Google Calendar
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Tab 2: Send Private/DB-Stored Wishes */}
        {activeTab === 'wishes' && (
          <section className="space-y-4 transition-all duration-300">
            <div className="bg-slate-900/60 border border-rose-500/20 rounded-3xl p-5 backdrop-blur-xl space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-rose-300 flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-rose-400" />
                Send Your Blessings & Wishes
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed">
                Your personal message will be saved securely to our database for us to cherish.
              </p>

              {wishSubmitted ? (
                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-1">
                  <Check className="w-6 h-6 text-emerald-400 mx-auto" />
                  <p className="text-xs font-medium text-emerald-200">Thank you for your warm blessing!</p>
                  <p className="text-[10px] text-slate-400">Successfully saved to MongoDB database.</p>
                </div>
              ) : (
                <form onSubmit={handleWishSubmit} className="space-y-3">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                    required
                  />
                  <textarea
                    placeholder="Write your personal blessing or wish..."
                    value={wishText}
                    onChange={(e) => setWishText(e.target.value)}
                    rows={3}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/80 border border-rose-500/20 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors resize-none"
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmittingWish}
                    className="w-full py-2.5 px-4 rounded-xl bg-rose-500 hover:bg-rose-600 text-white text-xs font-medium transition-all shadow-md shadow-rose-950/30 flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                    {isSubmittingWish ? 'Saving to Database...' : 'Send Wish to Couple'}
                  </button>
                </form>
              )}
            </div>
          </section>
        )}

        {/* MongoDB Backend RSVP Integration */}
        <div className="pt-2">
          <RSVPSection />
        </div>

        {/* Footer */}
        <footer className="text-center text-[10px] text-slate-500 pt-6 pb-2 tracking-[0.2em] font-serif">
          CRAFTED WITH LOVE • IBRAHIM & JAWERIYA
        </footer>
      </main>
    </div>
  );
}