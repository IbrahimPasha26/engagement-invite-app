'use client';

import React, { useState } from 'react';
import { Heart, Send, CheckCircle2, Sparkles, User, Mail, Users } from 'lucide-react';

export default function RSVPSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [attending, setAttending] = useState(null);
  const [guests, setGuests] = useState('1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!attending || !name.trim()) return;

    setIsSubmitting(true);
    try {
      // Map frontend state to exact Mongoose schema enum values
      const attendanceStatus = attending === 'yes'
        ? 'Joyfully Accepts'
        : 'Regretfully Declines';

      const response = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          attendance: attendanceStatus, // Matches backend expected key
          guestsCount: parseInt(guests) // Matches backend expected key
        })
      });

      // Removed '|| true' so it only confirms on actual success
      if (response.ok) {
        setSubmitted(true);
      } else {
        console.error("Failed to submit RSVP");
      }
    } catch (err) {
      console.error("RSVP submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-slate-900/90 via-slate-900/70 to-rose-950/20 border border-rose-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-2xl shadow-2xl overflow-hidden transition-all duration-500">
      {/* Luxurious Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 text-center space-y-2 mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-[11px] uppercase tracking-[0.2em] font-medium shadow-inner">
          <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" style={{ animationDuration: '6s' }} />
          Be Our Guest
        </div>
        <h2 className="text-2xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-rose-100 via-white to-amber-100 tracking-wide">
          Response Card (RSVP)
        </h2>
        <p className="text-xs text-slate-300 font-light max-w-xs mx-auto">
          Your presence will make our celebration truly complete. Please let us know if you can join.
        </p>
      </div>

      {submitted ? (
        <div className="py-8 text-center space-y-3 animate-fade-in relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500/30 to-emerald-600/10 border border-emerald-500/50 rounded-full flex items-center justify-center mx-auto text-emerald-300 shadow-xl shadow-emerald-950/60 animate-bounce">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="font-serif text-xl text-emerald-200">Response Recorded!</h3>
          <p className="text-xs text-slate-200 max-w-xs mx-auto font-light leading-relaxed">
            Thank you, <span className="text-rose-300 font-medium">{name}</span>. Your RSVP has been saved securely to our database. We are so excited to celebrate with you!
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="relative z-10 space-y-4">
          {/* Name Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-rose-300/90 font-medium flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-rose-400" /> Your Full Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ibrahim Pasha"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-rose-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 transition-all shadow-inner"
              required
            />
          </div>

          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-rose-300/90 font-medium flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-rose-400" /> Email Address (Optional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. ibrahim@example.com"
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-rose-500/30 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 transition-all shadow-inner"
            />
          </div>

          {/* Attendance Choice Buttons with High-End Active States */}
          <div className="space-y-1.5">
            <label className="text-[11px] uppercase tracking-wider text-rose-300/90 font-medium flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-400" /> Will you attend? *
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAttending('yes')}
                className={`py-3.5 px-4 rounded-2xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 border relative overflow-hidden group ${
                  attending === 'yes'
                    ? 'bg-gradient-to-r from-rose-600/40 to-rose-500/30 border-rose-400 text-rose-100 shadow-xl shadow-rose-950/80 scale-[1.02] ring-2 ring-rose-500/40'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-rose-500/40 hover:text-slate-200'
                }`}
              >
                <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                <CheckCircle2 className={`w-4 h-4 transition-transform ${attending === 'yes' ? 'text-rose-300 scale-110' : 'text-slate-500'}`} />
                <span>Joyfully Accepts</span>
              </button>

              <button
                type="button"
                onClick={() => setAttending('no')}
                className={`py-3.5 px-4 rounded-2xl text-xs font-medium transition-all duration-300 flex items-center justify-center gap-2 border relative overflow-hidden group ${
                  attending === 'no'
                    ? 'bg-gradient-to-r from-rose-950/60 to-slate-900 border-rose-700 text-rose-200 shadow-xl scale-[1.02] ring-2 ring-rose-800/40'
                    : 'bg-slate-950/70 border-slate-800 text-slate-400 hover:border-rose-900/40 hover:text-slate-200'
                }`}
              >
                <span>Regretfully Declines</span>
              </button>
            </div>
          </div>

          {/* Guest Count Selector */}
          {attending === 'yes' && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="text-[11px] uppercase tracking-wider text-rose-300/90 font-medium flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-rose-400" /> Total Number of Attendees
              </label>
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl bg-slate-950/90 border border-rose-500/30 text-xs text-white focus:outline-none focus:border-rose-400 focus:ring-2 focus:ring-rose-500/30 transition-all shadow-inner"
              >
                <option value="1">1 Guest (Just Me)</option>
                <option value="2">2 Guests (Plus One / Family)</option>
                <option value="3">3 Guests</option>
                <option value="4">4 Guests</option>
              </select>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting || !attending}
            className="w-full mt-3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white text-xs font-semibold tracking-widest uppercase transition-all shadow-xl shadow-rose-950/60 flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed transform active:scale-95 duration-200 border border-rose-400/30"
          >
            <Send className="w-4 h-4 text-amber-200" />
            {isSubmitting ? 'Submitting to Database...' : 'Confirm & Send RSVP'}
          </button>
        </form>
      )}
    </div>
  );
}