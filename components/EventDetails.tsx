"use client";

export default function EventDetails() {
  return (
    <div className="w-full mt-16 flex flex-col items-center text-center relative z-20">
      {/* Decorative Top Element */}
      <div className="text-gold-muted mb-4">
        <svg className="w-6 h-6 inline-block opacity-70" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2L14.4 9.6H22L15.8 14.4L18.2 22L12 17.2L5.8 22L8.2 14.4L2 9.6H9.6L12 2Z" />
        </svg>
      </div>

      <h2 className="text-gold-primary font-serif text-3xl md:text-4xl tracking-wider mb-6">
        The Ceremony
      </h2>

      <p className="text-gold-light font-script text-2xl mb-8 opacity-90">
        Join us as we unite in the sacred bond
      </p>

      <div className="flex flex-col space-y-4 text-gold-light font-serif tracking-[0.2em] uppercase text-xs md:text-sm">
        <div className="flex items-center justify-center space-x-3">
          <span className="w-4 h-px bg-gold-muted/50"></span>
          <p>Saturday, September 5th 2026</p>
          <span className="w-4 h-px bg-gold-muted/50"></span>
        </div>

        <p>Auditorium Vellamunda</p>
        <p>1:00 PM</p>
      </div>

      {/* Navigate Button */}
      <a
        href="https://maps.google.com/?q=Auditorium+Vellamunda"
        target="_blank"
        rel="noopener noreferrer"
        className="mt-10 px-8 py-3 border border-gold-muted/40 rounded-full text-gold-light hover:bg-gold-muted/10 hover:border-gold-muted transition-all duration-300 font-serif tracking-[0.2em] text-xs uppercase flex items-center space-x-2 backdrop-blur-sm"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>Navigate</span>
      </a>
    </div>
  );
}