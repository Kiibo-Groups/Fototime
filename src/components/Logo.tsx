import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  className?: string;
}

export default function Logo({ size = 'md', showBadge = true, className = '' }: LogoProps) {
  const iconSizes = {
    sm: 'h-7 w-7',
    md: 'h-9 w-9',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl',
  };

  return (
    <div className={`flex items-center gap-2.5 select-none ${className}`}>
      {/* High-Tech Shutter Lens Aperture Symbol */}
      <div
        className={`relative flex items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg shadow-amber-500/25 transition-transform group-hover:scale-105 ${iconSizes[size]}`}
      >
        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[70%] w-[70%]"
        >
          {/* Camera body frame */}
          <rect
            x="4"
            y="9"
            width="40"
            height="32"
            rx="7"
            stroke="#090a0f"
            strokeWidth="3.5"
            fill="none"
          />
          {/* Top flash mount / pentaprism */}
          <path
            d="M16 9L18.5 4.5C19 3.5 20 3 21 3H27C28 3 29 3.5 29.5 4.5L32 9"
            stroke="#090a0f"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Aperture Iris blades */}
          <circle cx="24" cy="25" r="9.5" stroke="#090a0f" strokeWidth="3" />
          <path d="M24 15.5L28.5 22.5" stroke="#090a0f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M33 21L27.5 28.5" stroke="#090a0f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M29 32L21.5 30" stroke="#090a0f" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M16 28L18 20.5" stroke="#090a0f" strokeWidth="2.5" strokeLinecap="round" />
          {/* Lens center focal dot */}
          <circle cx="24" cy="25" r="3" fill="#090a0f" />
        </svg>

        {/* Ambient glow highlight */}
        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-transparent via-white/20 to-white/40 pointer-events-none" />
      </div>

      {/* Brand Name Typography */}
      <div className="flex items-baseline">
        <span className={`font-display font-black tracking-tight text-white ${textSizes[size]}`}>
          FOTO<span className="text-amber-500">TIME</span>
        </span>
        {showBadge && (
          <span className="ml-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-widest text-amber-400">
            MX
          </span>
        )}
      </div>
    </div>
  );
}
