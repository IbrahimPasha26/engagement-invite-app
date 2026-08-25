"use client";

import React, { useState, useEffect, useRef } from "react";

export default function Countdown() {
  // Set target date for the engagement ceremony
  const targetDate = useRef(new Date("2026-09-05T13:00:00").getTime());

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
      <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-md mx-auto">
        {timeUnits.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-gradient-to-b from-[#0e2c22]/90 to-[#051812]/90 border border-[#b89851]/40 shadow-lg backdrop-blur-md transform hover:-translate-y-1 transition-transform duration-300"
          >
            <span className="font-serif-header text-xl sm:text-3xl text-[#f1d37e] font-bold tracking-wider">
              {String(item.value).padStart(2, "0")}
            </span>
            <span className="font-serif-sub text-[9px] sm:text-[11px] text-[#b89851] tracking-widest uppercase mt-1">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}