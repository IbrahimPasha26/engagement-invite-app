"use client";

import React, { useState, useEffect, useRef } from "react";
import FloatingLanterns from "@/components/FloatingLanterns";

// --- INLINE STYLES & FONTS INJECTOR ---
const FontAndStyleInjector = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@400;700;900&family=Cinzel:wght@400;600;700&family=Alex+Brush&family=Amiri:ital,wght@0,400;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap');

    .font-script { font-family: 'Alex Brush', cursive; }
    .font-serif-header { font-family: 'Cinzel Decorative', 'Cinzel', serif; }
    .font-serif-sub { font-family: 'Cinzel', serif; }
    .font-arabic { font-family: 'Amiri', serif; }
    .font-sans-body { font-family: 'Montserrat', sans-serif; }

    @keyframes float-slow {
      0%, 100% { transform: translateY(0px) rotate(0deg); }
      50% { transform: translateY(-8px) rotate(1deg); }
    }
    .animate-float {
      animation: float-slow 6s ease-in-out infinite;
    }

    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .gold-shimmer {
      background: linear-gradient(90deg, #b89851 0%, #f1d37e 25%, #ffffff 50%, #f1d37e 75%, #b89851 100%);
      background-size: 200% auto;
      color: transparent;
      -webkit-background-clip: text;
      background-clip: text;
      animation: shimmer 5s linear infinite;
    }

    /* Scroll-reveal & Hover Glass Interaction */
    .scroll-glass-card {
      opacity: 0.88;
      transform: translateY(0) scale(0.99);
      transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .scroll-glass-card.in-view,
    .scroll-glass-card:hover {
      opacity: 1;
      transform: translateY(-4px) scale(1);
      box-shadow: 0 12px 32px -8px rgba(212, 175, 55, 0.18);
      border-color: rgba(241, 211, 126, 0.35);
      background-color: rgba(8, 32, 24, 0.6);
    }

    ::-webkit-scrollbar {
      width: 5px;
    }
    ::-webkit-scrollbar-track {
      background: #05130e;
    }
    ::-webkit-scrollbar-thumb {
      background: #b89851;
      border-radius: 3px;
    }
  `}</style>
);

const CornerOrnament = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 100 100" className={`w-10 h-10 sm:w-12 sm:h-12 text-[#b89851]/60 ${className}`} fill="currentColor">
    <path d="M 0 0 L 100 0 L 100 8 L 8 8 L 8 100 L 0 100 Z" />
    <path d="M 12 12 L 60 12 L 60 16 L 16 16 L 16 60 L 12 60 Z" />
    <circle cx="24" cy="24" r="3" />
    <path d="M 24 24 Q 45 24 45 45" fill="none" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const RingIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className={className}>
    <circle cx="9" cy="12" r="5" stroke="currentColor" />
    <circle cx="15" cy="12" r="5" stroke="currentColor" />
    <path d="M12 7.5L12 6.5M12 6.5L10.5 5M12 6.5L13.5 5" stroke="currentColor" strokeLinecap="round" />
  </svg>
);

// --- CUSTOM MP3 AUDIO CONTROLLER ---
const CustomAudioPlayer = ({
  isPlaying,
  setIsPlaying,
  audioRef,
}: {
  isPlaying: boolean;
  setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) => {
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        const promise = audioRef.current.play();
        if (promise !== undefined) {
          promise.catch(() => {
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, setIsPlaying, audioRef]);

  const toggleMusic = () => {
    if (!isPlaying && audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/bg-music.mp3" loop preload="auto" playsInline />
      <button
        onClick={toggleMusic}
        className="fixed top-4 right-4 z-50 flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#081e17]/85 backdrop-blur-md border border-[#b89851]/40 text-[#f1d37e] text-[11px] font-serif-sub tracking-wider shadow-lg active:scale-95 transition-all duration-300"
        title="Toggle Background Music"
      >
        <span className="relative flex h-2 w-2">
          {isPlaying && (
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#f1d37e] opacity-75"></span>
          )}
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isPlaying ? "bg-[#f1d37e]" : "bg-gray-500"
            }`}
          ></span>
        </span>
        <span>{isPlaying ? "Music On" : "Play Music"}</span>
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`w-3.5 h-3.5 ${isPlaying ? "animate-pulse" : ""}`}
        >
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
      </button>
    </>
  );
};

// --- STARDUST ENTRY INTRO SCREEN ---
const StardustEntry = ({ onOpen }: { onOpen: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isOpening, setIsOpening] = useState(false);

  const handleOpenClick = () => {
    if (isOpening) return;
    setIsOpening(true);
    onOpen();
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId: number;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const particles = Array.from({ length: 90 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      alpha: Math.random() * 0.8 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const bgGrd = ctx.createRadialGradient(
        width / 2,
        height / 2,
        50,
        width / 2,
        height / 2,
        Math.max(width, height) / 1.2
      );
      bgGrd.addColorStop(0, "#0e2b22");
      bgGrd.addColorStop(0.6, "#061812");
      bgGrd.addColorStop(1, "#020a07");
      ctx.fillStyle = bgGrd;
      ctx.fillRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        p.alpha += Math.sin(Date.now() * 0.002 + p.radius) * 0.008;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(241, 211, 126, ${Math.max(0.1, Math.min(1, p.alpha))})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = "#f1d37e";
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-1000 ${
        isOpening ? "opacity-0 scale-105 pointer-events-none" : "opacity-100 scale-100"
      }`}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div
        onClick={handleOpenClick}
        className="relative z-10 flex flex-col items-center text-center px-6 sm:px-10 py-10 max-w-md mx-4 rounded-3xl bg-[#061912]/85 border border-[#b89851]/40 backdrop-blur-xl shadow-[0_0_50px_rgba(0,0,0,0.85)] animate-float overflow-visible cursor-pointer"
      >
        <CornerOrnament className="absolute top-2 left-2" />
        <CornerOrnament className="absolute top-2 right-2 transform rotate-90" />
        <CornerOrnament className="absolute bottom-2 left-2 transform -rotate-90" />
        <CornerOrnament className="absolute bottom-2 right-2 transform rotate-180" />

        <p className="text-[#f1d37e] font-arabic text-2xl tracking-widest mb-3">
          بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
        </p>

        <span className="text-[#b89851] font-serif-sub text-[11px] sm:text-xs uppercase tracking-[0.3em] mb-4">
          The Engagement Celebration Of
        </span>

        {/* Elegant Grouped Names */}
        <div className="py-2 px-6 my-1 flex flex-col items-center space-y-1 overflow-visible w-full">
          <h1 className="text-4xl sm:text-5xl font-script gold-shimmer drop-shadow-md tracking-wide leading-tight inline-block pr-8 sm:pr-10">
            Ibrahim Pasha J
          </h1>
          <span className="text-lg sm:text-xl font-script text-[#f1d37e] opacity-80 my-0.5">&</span>
          <h1 className="text-4xl sm:text-5xl font-script gold-shimmer drop-shadow-md tracking-wide leading-tight inline-block px-4">
            Jaweriya Mohammadi
          </h1>
        </div>

        <p className="text-gray-300 font-serif-sub text-[11px] sm:text-xs tracking-[0.25em] uppercase mt-4 mb-8 opacity-80">
          Save The Date • November 15, 2026
        </p>

        <button
          onClick={(e) => {
            e.stopPropagation();
            handleOpenClick();
          }}
          className="relative group p-1 rounded-full bg-gradient-to-tr from-[#8a6822] via-[#f1d37e] to-[#b89851] shadow-[0_0_25px_rgba(241,211,126,0.5)] active:scale-95 transition-all duration-300"
        >
          <div className="px-8 py-3.5 rounded-full bg-[#051510] flex items-center gap-3 transition-colors duration-300 group-hover:bg-[#0a231b]">
            <RingIcon className="w-5 h-5 text-[#f1d37e] animate-pulse" />
            <span className="font-serif-sub text-sm tracking-[0.25em] text-[#f1d37e] uppercase font-semibold">
              Open Invitation
            </span>
          </div>
        </button>

        <p className="text-[10px] text-[#b89851]/70 font-sans-body mt-4 tracking-widest">
          TAP TO OPEN
        </p>
      </div>
    </div>
  );
};

// --- COUNTDOWN COMPONENT ---
const Countdown = () => {
  const targetDate = useRef(new Date("2026-11-15T14:00:00").getTime());

  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate.current - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <div className="w-full my-8">
      <div className="grid grid-cols-4 gap-2.5 sm:gap-4 max-w-md mx-auto">
        {timeUnits.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 rounded-2xl bg-[#082018]/45 border border-[#b89851]/30 shadow-md backdrop-blur-md transition-all duration-300 hover:border-[#f1d37e]/60 hover:bg-[#082018]/70 active:scale-95"
          >
            <span className="font-serif-header text-xl sm:text-3xl text-[#f1d37e] font-bold tracking-wider">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="font-serif-sub text-[9px] sm:text-[10px] text-[#b89851] tracking-widest uppercase mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- EVENT DETAILS COMPONENT ---
const EventDetails = () => {
  const eventInfo = {
    date: "Sunday, November 15th 2026",
    time: "2:00 PM Onwards",
    venue: "S.S.N Function Hall",
    address: "Kolar, Karnataka",
    googleMapsUrl: "https://maps.app.goo.gl/BynRj2A2QtQmZyYe6",
  };

  return (
    <div className="w-full space-y-6 my-6">
      {/* Date & Time Section */}
      <div className="scroll-glass-card relative p-6 sm:p-8 rounded-3xl bg-[#082018]/45 border border-[#b89851]/25 backdrop-blur-md text-center">
        <CornerOrnament className="absolute top-2 left-2" />
        <CornerOrnament className="absolute top-2 right-2 transform rotate-90" />

        <div className="flex justify-center items-center gap-2 text-[#f1d37e] mb-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
          </svg>
          <span className="font-serif-sub text-xs uppercase tracking-[0.2em] text-[#b89851]">When</span>
        </div>

        <h3 className="font-serif-header text-lg sm:text-xl text-[#f1d37e] font-semibold">
          {eventInfo.date}
        </h3>
        <p className="font-sans-body text-xs text-gray-300 mt-1 tracking-wider">
          {eventInfo.time}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
          <a
            href={`https://calendar.google.com/calendar/render?action=TEMPLATE&text=Engagement+Ceremony:+Ibrahim+Pasha+J+%26+Jaweriya+Mohammadi&dates=20261115T083000Z/20261115T123000Z&details=Engagement+Ceremony&location=${encodeURIComponent(
              eventInfo.venue + ", " + eventInfo.address
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-full bg-[#b89851]/15 border border-[#b89851]/40 text-[#f1d37e] text-xs font-serif-sub tracking-wider hover:bg-[#b89851]/30 hover:border-[#f1d37e] active:scale-95 transition-all flex items-center gap-1.5"
          >
            + Add to Google Calendar
          </a>
        </div>
      </div>

      {/* Venue Section with Direct Navigate Action */}
      <div className="scroll-glass-card relative p-6 sm:p-8 rounded-3xl bg-[#082018]/45 border border-[#b89851]/25 backdrop-blur-md text-center">
        <div className="flex justify-center items-center gap-2 text-[#f1d37e] mb-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          <span className="font-serif-sub text-xs uppercase tracking-[0.2em] text-[#b89851]">Where</span>
        </div>

        <h3 className="font-serif-header text-lg sm:text-xl text-[#f1d37e] font-semibold">
          {eventInfo.venue}
        </h3>
        <p className="font-sans-body text-xs text-gray-300 mt-2 leading-relaxed max-w-xs mx-auto">
          {eventInfo.address}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <a
            href={eventInfo.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-3 rounded-full bg-gradient-to-r from-[#8a6822] via-[#f1d37e] to-[#b89851] text-[#051510] text-xs font-serif-sub font-bold tracking-[0.2em] uppercase hover:brightness-110 active:scale-95 transition-all shadow-md flex items-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-[#051510]">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            Navigate
          </a>
        </div>
      </div>
    </div>
  );
};

// --- PRIVATE RSVP & DUAS FORM COMPONENT ---
const RSVPSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    attending: "Joyfully Accepts",
    guestCount: 1,
    dua: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsSubmitting(true);
    setStatusMsg("");

    try {
      const rsvpRes = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name.trim(),
          attendance: formData.attending,
          guestsCount: Number(formData.guestCount),
          message: formData.dua.trim() || undefined,
        }),
      });

      if (formData.dua.trim()) {
        await fetch("/api/wishes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: formData.name.trim(),
            message: formData.dua.trim(),
          }),
        });
      }

      if (rsvpRes.ok) {
        setSubmitted(true);
      } else {
        const errData = await rsvpRes.json().catch(() => ({}));
        setStatusMsg(errData.error || "RSVP recorded. JazakAllah Khair!");
        setSubmitted(true);
      }
    } catch {
      setStatusMsg("Response received. JazakAllah Khair!");
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full my-8">
      <div className="scroll-glass-card relative p-6 sm:p-8 rounded-3xl bg-[#082018]/45 border border-[#b89851]/25 backdrop-blur-md text-center">
        <CornerOrnament className="absolute top-2 left-2" />
        <CornerOrnament className="absolute top-2 right-2 transform rotate-90" />

        <div className="text-center mb-6">
          <span className="text-[#b89851] font-serif-sub text-xs tracking-[0.25em] uppercase">
            Kindly Respond
          </span>
          <h3 className="text-2xl sm:text-3xl font-script text-[#f1d37e] mt-1 tracking-wider">
            RSVP & Send Your Duas
          </h3>
          <p className="text-xs font-sans-body text-gray-300 mt-1">
            Please let us know if you will be joining us for the celebration
          </p>
        </div>

        {submitted ? (
          <div className="p-6 rounded-2xl bg-[#0e2c22]/80 border border-[#f1d37e]/30 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#f1d37e]/20 text-[#f1d37e] flex items-center justify-center mx-auto text-xl">
              ✓
            </div>
            <h4 className="font-serif-header text-lg text-[#f1d37e]">
              JazakAllah Khair!
            </h4>
            <p className="font-sans-body text-xs text-gray-300 leading-relaxed">
              Your response and warm prayers have been received with love. We look forward to celebrating with you!
            </p>
            {statusMsg && <p className="text-[11px] text-gold-muted italic">{statusMsg}</p>}
            <button
              onClick={() => {
                setSubmitted(false);
                setFormData({ name: "", attending: "Joyfully Accepts", guestCount: 1, dua: "" });
              }}
              className="text-xs font-serif-sub text-[#b89851] underline mt-2 hover:text-[#f1d37e]"
            >
              Submit another response
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-serif-sub text-[#f1d37e] tracking-wider uppercase mb-1">
                Your Full Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-xl bg-[#051510]/80 border border-[#b89851]/30 text-gray-200 text-xs font-sans-body focus:outline-none focus:border-[#f1d37e] transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif-sub text-[#f1d37e] tracking-wider uppercase mb-1">
                  Will You Attend?
                </label>
                <select
                  value={formData.attending}
                  onChange={(e) => setFormData({ ...formData, attending: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#051510]/80 border border-[#b89851]/30 text-gray-200 text-xs font-sans-body focus:outline-none focus:border-[#f1d37e]"
                >
                  <option value="Joyfully Accepts">Joyfully Accept</option>
                  <option value="Regretfully Declines">Regretfully Decline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-serif-sub text-[#f1d37e] tracking-wider uppercase mb-1">
                  Number of Guests
                </label>
                <select
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: Number(e.target.value) })}
                  className="w-full px-4 py-3 rounded-xl bg-[#051510]/80 border border-[#b89851]/30 text-gray-200 text-xs font-sans-body focus:outline-none focus:border-[#f1d37e]"
                >
                  <option value="1">1 Guest</option>
                  <option value="2">2 Guests</option>
                  <option value="3">3 Guests</option>
                  <option value="4">4+ Guests / Family</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif-sub text-[#f1d37e] tracking-wider uppercase mb-1">
                Dua / Message for Ibrahim & Jaweriya
              </label>
              <textarea
                rows={3}
                value={formData.dua}
                onChange={(e) => setFormData({ ...formData, dua: e.target.value })}
                placeholder="Write your prayers, blessings, or message for the couple..."
                className="w-full px-4 py-3 rounded-xl bg-[#051510]/80 border border-[#b89851]/30 text-gray-200 text-xs font-sans-body focus:outline-none focus:border-[#f1d37e] transition-colors resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#8a6822] via-[#f1d37e] to-[#b89851] text-[#051510] font-serif-sub font-bold text-xs uppercase tracking-[0.2em] shadow-lg active:scale-95 transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Confirm RSVP & Send Blessings"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const [isEntryComplete, setIsEntryComplete] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleOpenInvitation = () => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlayingMusic(true);
      }).catch((err) => {
        console.warn("Audio play blocked:", err);
      });
    }
    setTimeout(() => {
      setIsEntryComplete(true);
    }, 850);
  };

  // Mobile scroll-in-view observer
  useEffect(() => {
    if (!isEntryComplete) return;

    const cards = document.querySelectorAll(".scroll-glass-card");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
          }
        });
      },
      { threshold: 0.25 }
    );

    cards.forEach((card) => observer.observe(card));
    return () => observer.disconnect();
  }, [isEntryComplete]);

  return (
    <main className="relative min-h-screen w-full bg-[#030e0a] text-gray-100 overflow-x-hidden font-sans-body select-none">
      <FontAndStyleInjector />

      {/* Floating Audio Controller */}
      <CustomAudioPlayer
        isPlaying={isPlayingMusic}
        setIsPlaying={setIsPlayingMusic}
        audioRef={audioRef}
      />

      {/* LAYER 1: Interactive Stardust Entry Intro */}
      {!isEntryComplete && (
        <StardustEntry onOpen={handleOpenInvitation} />
      )}

      {/* LAYER 2: Floating Lanterns & Drifting Hearts Background */}
      {isEntryComplete && (
        <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
          <FloatingLanterns />
        </div>
      )}

      {/* LAYER 3: Main Invitation Document Content */}
      <section
        className={`relative z-10 w-full min-h-screen flex flex-col items-center justify-start px-4 sm:px-6 py-10 sm:py-16 md:py-20 transition-opacity duration-1000 ${
          isEntryComplete ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="relative z-20 flex flex-col items-center w-full max-w-lg mx-auto text-center">

          {/* Top Crescent & Star SVG Header */}
          <div className="w-9 h-9 mb-3 text-[#f1d37e] flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-7 h-7 sm:w-8 sm:h-8 drop-shadow-[0_0_10px_rgba(241,211,126,0.6)]"
            >
              <path d="M12 2a10 10 0 1 0 10 10 1 1 0 0 1-10-10zm2 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm4 3a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
            </svg>
          </div>

          {/* Traditional Bismillah Calligraphy */}
          <p className="text-[#f1d37e] font-arabic text-lg sm:text-xl md:text-2xl tracking-widest mb-2.5 drop-shadow-md">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>

          <span className="text-[#b89851] font-serif-sub text-[9px] sm:text-xs tracking-[0.3em] uppercase mb-5">
            With the blessings of Allah SWT & Our Families
          </span>

          {/* Ceremony Badge Title Header */}
          <div className="flex items-center justify-center space-x-3 mb-5 w-full">
            <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#b89851]/60"></div>
            <h2 className="text-[#f1d37e] font-serif-header text-[11px] sm:text-sm tracking-[0.3em] uppercase px-1 font-bold">
              Engagement Ceremony
            </h2>
            <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#b89851]/60"></div>
          </div>

          {/* Bride & Groom Couple Names */}
          <div className="my-2 space-y-1.5 w-full overflow-visible">
            <div className="py-1 px-4 overflow-visible">
              <h1 className="text-[#f1d37e] font-script text-4xl sm:text-6xl md:text-7xl tracking-wide gold-shimmer drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] leading-relaxed inline-block pr-8 sm:pr-10">
                Ibrahim Pasha J
              </h1>
            </div>

            {/* Intertwined Heart Divider */}
            <div className="flex items-center justify-center space-x-4 my-1.5 w-full">
              <div className="h-[1px] w-14 bg-gradient-to-r from-transparent to-[#b89851]"></div>
              <div className="p-2 rounded-full bg-[#082018] border border-[#b89851]/40 shadow-lg">
                <svg
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  className="w-4 h-4 sm:w-5 sm:h-5 text-[#f1d37e] animate-pulse drop-shadow-[0_0_10px_rgba(241,211,126,0.8)]"
                >
                  <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-3.83-2.94c-2.2-2.214-4.04-4.577-4.04-7.447C3.746 7.64 6.25 5.5 9.15 5.5c1.71 0 3.32.88 4.35 2.27 1.03-1.39 2.64-2.27 4.35-2.27 2.9 0 5.404 2.14 5.404 5.008 0 2.87-1.84 5.233-4.04 7.447a15.246 15.246 0 01-3.83 2.94l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
              </div>
              <div className="h-[1px] w-14 bg-gradient-to-l from-transparent to-[#b89851]"></div>
            </div>

            <div className="py-1 px-4 overflow-visible">
              <h1 className="text-[#f1d37e] font-script text-4xl sm:text-6xl md:text-7xl tracking-wide gold-shimmer drop-shadow-[0_0_20px_rgba(212,175,55,0.4)] leading-relaxed inline-block px-4">
                Jaweriya Mohammadi
              </h1>
            </div>
          </div>

          {/* Quranic Verse Framing (Surah Ar-Rum: 30:21) */}
          <div className="scroll-glass-card relative w-full bg-[#082018]/45 border border-[#b89851]/25 rounded-3xl p-5 sm:p-7 my-6 backdrop-blur-md text-center">
            <CornerOrnament className="absolute top-2 left-2" />
            <CornerOrnament className="absolute bottom-2 right-2 transform rotate-180" />

            <p className="text-gray-200 font-serif-sub text-xs sm:text-sm italic leading-relaxed">
              &ldquo;And among His signs is that He created for you mates from
              among yourselves, that you may find tranquility in them; and He
              placed between you affection and mercy.&rdquo;
            </p>
            <span className="block mt-3 text-[#b89851] font-serif-sub text-[9px] sm:text-[10px] tracking-[0.25em] uppercase font-bold">
              — Surah Ar-Rum [30:21]
            </span>
          </div>

          {/* Save the Date Countdown Header */}
          <div className="w-full flex items-center justify-center gap-3">
            <div className="w-10 h-[1px] bg-[#b89851]/60"></div>
            <p className="text-[#f1d37e] font-serif-sub text-xs tracking-[0.3em] uppercase font-semibold">
              Save The Date
            </p>
            <div className="w-10 h-[1px] bg-[#b89851]/60"></div>
          </div>

          {/* Dynamic Real-Time Countdown */}
          <Countdown />

          {/* Venue & Event Schedule Details Component */}
          <EventDetails />

          {/* Private RSVP & Duas Form Component */}
          <RSVPSection />

          {/* Footer */}
          <footer className="text-center text-[10px] text-[#b89851]/70 pt-6 pb-6 tracking-[0.25em] font-serif-sub uppercase space-y-1">
            <p>May Allah SWT Bless This Union</p>
            <p className="text-[#f1d37e]">Ibrahim Pasha J & Jaweriya Mohammadi • 2026</p>
          </footer>
        </div>
      </section>
    </main>
  );
}