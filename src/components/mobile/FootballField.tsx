import React from 'react';

interface FootballFieldProps {
  children?: React.ReactNode;
  className?: string;
  vertical?: boolean;
}

/** Shared responsive pitch used by mobile training and squad-building screens. */
export const FootballField: React.FC<FootballFieldProps> = ({ children, className = '', vertical = false }) => (
  <div
    className={`relative overflow-hidden rounded-3xl border-2 border-emerald-200/50 bg-emerald-700 ${vertical ? 'min-h-[620px]' : 'min-h-[460px]'} ${className}`}
    aria-label="ملعب كرة قدم"
  >
    <div className="absolute inset-0 opacity-25" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(255,255,255,.16) 0 10%, transparent 10% 20%)' }} />
    <div className="absolute inset-4 border-2 border-white/70" />
    <div className="absolute left-4 right-4 top-1/2 border-t-2 border-white/70" />
    <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/70" />
    <div className="absolute left-1/2 top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
    <div className="absolute left-1/2 top-4 h-20 w-2/5 -translate-x-1/2 border-x-2 border-b-2 border-white/70" />
    <div className="absolute bottom-4 left-1/2 h-20 w-2/5 -translate-x-1/2 border-x-2 border-t-2 border-white/70" />
    {children}
  </div>
);
