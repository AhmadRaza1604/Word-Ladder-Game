import React from 'react';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', className = '' }) => {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24',
  };

  return (
    <div className={`relative flex items-center justify-center shrink-0 ${sizeMap[size]} ${className}`}>
      <svg
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_3px_12px_rgba(79,70,229,0.35)]"
      >
        <defs>
          <linearGradient id="logoPrimary" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#4F46E5" />
            <stop offset="100%" stopColor="#6366F1" />
          </linearGradient>

          <linearGradient id="rungGold" x1="16" y1="16" x2="48" y2="16" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#FBBF24" />
          </linearGradient>
        </defs>

        {/* Minimalist Rounded Square Tile */}
        <rect
          x="4"
          y="4"
          width="56"
          height="56"
          rx="16"
          className="fill-indigo-600/10 dark:fill-indigo-950/60 stroke-indigo-600/30 dark:stroke-indigo-500/40"
          strokeWidth="2"
        />

        {/* Two Vertical Clean Rails */}
        <path
          d="M20 14V50"
          stroke="currentColor"
          className="text-indigo-600 dark:text-indigo-400"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        <path
          d="M44 14V50"
          stroke="currentColor"
          className="text-indigo-600 dark:text-indigo-400"
          strokeWidth="3.5"
          strokeLinecap="round"
        />

        {/* 3 Ascending Creative Ladder Rungs */}
        {/* Rung 1: Bottom */}
        <rect
          x="19"
          y="40"
          width="26"
          height="5"
          rx="2.5"
          className="fill-indigo-500/80 dark:fill-indigo-400"
        />

        {/* Rung 2: Middle */}
        <rect
          x="19"
          y="28"
          width="26"
          height="5"
          rx="2.5"
          className="fill-cyan-500 dark:fill-cyan-400"
        />

        {/* Rung 3: Top Goal */}
        <rect
          x="19"
          y="16"
          width="26"
          height="5"
          rx="2.5"
          fill="url(#rungGold)"
        />

        {/* Summit Sparkle Star Accent */}
        <path
          d="M32 9L33.5 12.5L37 14L33.5 15.5L32 19L30.5 15.5L27 14L30.5 12.5Z"
          fill="#F59E0B"
        />
      </svg>
    </div>
  );
};
