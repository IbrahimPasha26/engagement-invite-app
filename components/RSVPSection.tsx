"use client";

import { useState } from "react";

export default function RSVPSection() {
  const [activeTab, setActiveTab] = useState<"rsvp" | "wishes">("rsvp");

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpStatus, setRsvpStatus] = useState("Joyfully Accepts");
  const [rsvpGuests, setRsvpGuests] = useState("1");
  const [isSubmittingRsvp, setIsSubmittingRsvp] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");

  // Wishes Form State
  const [wishName, setWishName] = useState("");
  const [wishText, setWishText] = useState("");
  const [isSubmittingWish, setIsSubmittingWish] = useState(false);
  const [wishMessage, setWishMessage] = useState("");

  const handleRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingRsvp(true);
    setRsvpMessage("");

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: rsvpName,
          attendance: rsvpStatus,
          guestsCount: Number(rsvpGuests)
        }),
      });

      if (res.ok) {
        setRsvpMessage("Thank you! Your RSVP has been recorded.");
        setRsvpName("");
      } else {
        const data = await res.json();
        setRsvpMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setRsvpMessage("Server error. Please try again later.");
    } finally {
      setIsSubmittingRsvp(false);
    }
  };

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingWish(true);
    setWishMessage("");

    try {
      const res = await fetch("/api/wishes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: wishName, message: wishText }),
      });

      if (res.ok) {
        setWishMessage("Jazakallah Khair! Your duas have been sent.");
        setWishName("");
        setWishText("");
      } else {
        const data = await res.json();
        setWishMessage(data.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setWishMessage("Server error. Please try again later.");
    } finally {
      setIsSubmittingWish(false);
    }
  };

  return (
    <div className="w-full mt-16 mb-12 relative z-20 flex flex-col items-center">

      {/* Tab Switcher Pills */}
      <div className="flex space-x-4 mb-8 bg-forest-base/60 p-1.5 rounded-full border border-gold-muted/30 backdrop-blur-md">
        <button
          onClick={() => setActiveTab("rsvp")}
          className={`px-6 py-2 rounded-full font-serif text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
            activeTab === "rsvp"
              ? "bg-gold-primary text-forest-deep shadow-lg font-medium"
              : "text-gold-light hover:text-gold-primary"
          }`}
        >
          RSVP
        </button>
        <button
          onClick={() => setActiveTab("wishes")}
          className={`px-6 py-2 rounded-full font-serif text-xs uppercase tracking-[0.2em] transition-all duration-300 ${
            activeTab === "wishes"
              ? "bg-gold-primary text-forest-deep shadow-lg font-medium"
              : "text-gold-light hover:text-gold-primary"
          }`}
        >
          Send Duas
        </button>
      </div>

      {/* Container Card */}
      <div className="w-full max-w-md bg-forest-base/40 border border-gold-muted/30 rounded-2xl p-6 md:p-8 backdrop-blur-md shadow-2xl">

        {/* RSVP FORM */}
        {activeTab === "rsvp" && (
          <form onSubmit={handleRsvpSubmit} className="flex flex-col space-y-4">
            <h3 className="text-gold-primary font-serif text-xl text-center mb-2 tracking-wide">
              Confirm Your Attendance
            </h3>

            <div className="flex flex-col space-y-1">
              <label className="text-gold-muted font-serif text-xs uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                required
                value={rsvpName}
                onChange={(e) => setRsvpName(e.target.value)}
                placeholder="Enter your full name"
                className="bg-forest-deep/60 border border-gold-muted/30 rounded-xl px-4 py-3 text-gold-light placeholder-gold-muted/40 text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gold-muted font-serif text-xs uppercase tracking-wider">Will you attend?</label>
              <select
                value={rsvpStatus}
                onChange={(e) => setRsvpStatus(e.target.value)}
                className="bg-forest-deep/60 border border-gold-muted/30 rounded-xl px-4 py-3 text-gold-light text-sm focus:outline-none focus:border-gold-primary transition-colors"
              >
                <option value="Joyfully Accepts" className="bg-forest-deep text-gold-light">Joyfully Accepts</option>
                <option value="Regretfully Declines" className="bg-forest-deep text-gold-light">Regretfully Declines</option>
              </select>
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gold-muted font-serif text-xs uppercase tracking-wider">Number of Guests</label>
              <input
                type="number"
                min="1"
                max="5"
                value={rsvpGuests}
                onChange={(e) => setRsvpGuests(e.target.value)}
                className="bg-forest-deep/60 border border-gold-muted/30 rounded-xl px-4 py-3 text-gold-light text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingRsvp}
              className="mt-4 w-full py-3.5 bg-gold-primary text-forest-deep font-serif font-semibold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-gold-light transition-colors shadow-lg disabled:opacity-50"
            >
              {isSubmittingRsvp ? "Submitting..." : "Submit RSVP"}
            </button>

            {rsvpMessage && (
              <p className="text-center font-serif text-xs text-gold-light mt-2 italic">{rsvpMessage}</p>
            )}
          </form>
        )}

        {/* WISHES FORM */}
        {activeTab === "wishes" && (
          <form onSubmit={handleWishSubmit} className="flex flex-col space-y-4">
            <h3 className="text-gold-primary font-serif text-xl text-center mb-2 tracking-wide">
              Include Us in Your Prayers
            </h3>

            <div className="flex flex-col space-y-1">
              <label className="text-gold-muted font-serif text-xs uppercase tracking-wider">Your Name</label>
              <input
                type="text"
                required
                value={wishName}
                onChange={(e) => setWishName(e.target.value)}
                placeholder="Enter your name"
                className="bg-forest-deep/60 border border-gold-muted/30 rounded-xl px-4 py-3 text-gold-light placeholder-gold-muted/40 text-sm focus:outline-none focus:border-gold-primary transition-colors"
              />
            </div>

            <div className="flex flex-col space-y-1">
              <label className="text-gold-muted font-serif text-xs uppercase tracking-wider">Your Duas & Wishes</label>
              <textarea
                required
                rows={4}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder="Write your heartfelt wishes here..."
                className="bg-forest-deep/60 border border-gold-muted/30 rounded-xl px-4 py-3 text-gold-light placeholder-gold-muted/40 text-sm focus:outline-none focus:border-gold-primary transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmittingWish}
              className="mt-4 w-full py-3.5 bg-gold-primary text-forest-deep font-serif font-semibold text-xs uppercase tracking-[0.2em] rounded-xl hover:bg-gold-light transition-colors shadow-lg disabled:opacity-50"
            >
              {isSubmittingWish ? "Sending Duas..." : "Send Duas to Couple"}
            </button>

            {wishMessage && (
              <p className="text-center font-serif text-xs text-gold-light mt-2 italic">{wishMessage}</p>
            )}
          </form>
        )}

      </div>
    </div>
  );
}