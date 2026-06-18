'use client';

import { motion } from 'framer-motion';

type ProgressColor = 'emerald' | 'blue' | 'amber' | 'red';
type ProgressSize = 'sm' | 'md' | 'lg';

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: ProgressColor;
  size?: ProgressSize;
  showLabel?: boolean;
  animated?: boolean;
  className?: string;
  label?: string;
}

const colorClasses: Record<ProgressColor, string> = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  red: 'bg-red-500',
};

const trackColorClasses: Record<ProgressColor, string> = {
  emerald: 'bg-emerald-100 dark:bg-emerald-950',
  blue: 'bg-blue-100 dark:bg-blue-950',
  amber: 'bg-amber-100 dark:bg-amber-950',
  red: 'bg-red-100 dark:bg-red-950',
};

const sizeClasses: Record<ProgressSize, string> = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
};

function ProgressBar({
  value,
  max = 100,
  color = 'emerald',
  size = 'md',
  showLabel = false,
  animated = true,
  className = '',
  label,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const ariaLabel = label ?? `Progress: ${Math.round(percentage)}%`;

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1.5">
          {label && (
            <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {label}
            </span>
          )}
          <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 tabular-nums">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      <div
        className={`w-full rounded-full overflow-hidden ${trackColorClasses[color]} ${sizeClasses[size]}`}
        role="progressbar"
        aria-valuenow={Math.round(percentage)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={ariaLabel}
      >
        <motion.div
          className={`h-full rounded-full ${colorClasses[color]}`}
          initial={animated ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }
              : { duration: 0 }
          }
        />
      </div>
    </div>
  );
}

export { ProgressBar };
export type { ProgressBarProps, ProgressColor, ProgressSize };
