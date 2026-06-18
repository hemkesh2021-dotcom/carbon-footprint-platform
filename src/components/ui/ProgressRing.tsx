'use client';

import { useId } from 'react';
import { motion } from 'framer-motion';

type RingColor = 'emerald' | 'blue' | 'amber' | 'red';

interface ProgressRingProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: RingColor;
  showValue?: boolean;
  label?: string;
  gradient?: boolean;
  className?: string;
}

const colorMap: Record<RingColor, { stroke: string; track: string; stops: [string, string] }> = {
  emerald: {
    stroke: '#10b981',
    track: 'stroke-emerald-100 dark:stroke-emerald-950',
    stops: ['#059669', '#34d399'],
  },
  blue: {
    stroke: '#3b82f6',
    track: 'stroke-blue-100 dark:stroke-blue-950',
    stops: ['#2563eb', '#60a5fa'],
  },
  amber: {
    stroke: '#f59e0b',
    track: 'stroke-amber-100 dark:stroke-amber-950',
    stops: ['#d97706', '#fbbf24'],
  },
  red: {
    stroke: '#ef4444',
    track: 'stroke-red-100 dark:stroke-red-950',
    stops: ['#dc2626', '#f87171'],
  },
};

function ProgressRing({
  value,
  size = 120,
  strokeWidth = 8,
  color = 'emerald',
  showValue = true,
  label,
  gradient = false,
  className = '',
}: ProgressRingProps) {
  const gradientId = useId();
  const clampedValue = Math.min(Math.max(value, 0), 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (clampedValue / 100) * circumference;
  const center = size / 2;
  const { stroke, track, stops } = colorMap[color];

  return (
    <div
      className={`inline-flex flex-col items-center justify-center relative gap-1 ${className}`}
      role="progressbar"
      aria-valuenow={Math.round(clampedValue)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label ?? `${Math.round(clampedValue)}% complete`}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="-rotate-90"
      >
        {gradient && (
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={stops[0]} />
              <stop offset="100%" stopColor={stops[1]} />
            </linearGradient>
          </defs>
        )}

        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={track}
          strokeLinecap="round"
        />

        {/* Progress */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={gradient ? `url(#${gradientId})` : stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </svg>

      {/* Center label */}
      {showValue && (
        <div
          className="absolute flex flex-col items-center justify-center"
          style={{ width: size, height: size }}
          aria-hidden="true"
        >
          <span className="text-2xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
            {Math.round(clampedValue)}%
          </span>
        </div>
      )}

      {label && (
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-1">
          {label}
        </span>
      )}
    </div>
  );
}

export { ProgressRing };
export type { ProgressRingProps, RingColor };
