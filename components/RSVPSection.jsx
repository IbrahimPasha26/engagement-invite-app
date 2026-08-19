'use client';

import React, { useState } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

export default function RSVPSection() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    attendance: 'Joyfully Accepts',
    guestsCount: 1,
    message: '',
  });

  const [status, setStatus] = useState({ loading: false, success: false, error: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, success: false, error: '' });

    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus({ loading: false, success: true, error: '' });
    } catch (err) {
      setStatus({ loading: false, success: false, error: err.message });
    }
  };

  return (
    <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md shadow-2xl my-6 z-10">
      <h3 className="text-xl font-serif text-rose-100 text-center mb-4">Are You Attending?</h3>

      {status.success ? (
        <div className="text-center py-8 space-y-3">
          <CheckCircle2 className="w-12 h-12 text-rose-400 mx-auto animate-bounce" />
          <h4 className="text-lg font-medium text-rose-200">Thank You for Your RSVP!</h4>
          <p className="text-xs text-slate-300">Your response has been saved. We can't wait to celebrate with you!</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Your Full Name *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Email Address</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Response *</label>
              <select
                value={formData.attendance}
                onChange={(e) => setFormData({ ...formData, attendance: e.target.value })}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="Joyfully Accepts">Accepts</option>
                <option value="Regretfully Declines">Declines</option>
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Guests Count</label>
              <input
                type="number"
                min="1"
                max="5"
                value={formData.guestsCount}
                onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider text-slate-300 mb-1">Wishes or Message</label>
            <textarea
              rows="2"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Leave a sweet note for the couple..."
              className="w-full bg-slate-900/60 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          {status.error && <p className="text-xs text-rose-400 text-center">{status.error}</p>}

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-medium py-3 rounded-xl transition duration-200 flex items-center justify-center gap-2 shadow-lg shadow-rose-600/30 text-sm"
          >
            <Send className="w-4 h-4" />
            {status.loading ? 'Submitting...' : 'Send RSVP'}
          </button>
        </form>
      )}
    </div>
  );
}