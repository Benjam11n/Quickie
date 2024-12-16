'use client';

import { cn } from '@/lib/utils';

interface SprayLoaderProps {
  className?: string;
  size?: 'sm' | 'default' | 'lg';
}

export function SprayLoader({ className, size = 'default' }: SprayLoaderProps) {
  return (
    <div
      className={cn(
        'relative flex items-center justify-center',
        size === 'sm' && 'size-16',
        size === 'default' && 'size-24',
        size === 'lg' && 'size-32',
        className
      )}
    >
      <svg viewBox="0 0 100 100" className="animate-pulse">
        {/* Perfume Bottle */}
        <path
          d="M40 70 L40 85 L60 85 L60 70 Q60 60 50 60 Q40 60 40 70"
          className="fill-primary/20 stroke-primary"
          strokeWidth="2"
        />
        <rect
          x="45"
          y="50"
          width="10"
          height="10"
          className="fill-primary/20 stroke-primary"
          strokeWidth="2"
        />

        {/* Spray Animation */}
        <g className="animate-[spray_2s_ease-in-out_infinite]">
          <circle cx="50" cy="30" r="2" className="fill-primary/40" />
          <circle cx="45" cy="25" r="2" className="fill-primary/40" />
          <circle cx="55" cy="25" r="2" className="fill-primary/40" />
          <circle cx="40" cy="20" r="2" className="fill-primary/40" />
          <circle cx="50" cy="20" r="2" className="fill-primary/40" />
          <circle cx="60" cy="20" r="2" className="fill-primary/40" />
        </g>
      </svg>
    </div>
  );
}
