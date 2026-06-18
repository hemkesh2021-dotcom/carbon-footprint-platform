/** @module Badge - Badge UI component for tags and categories */

import { type ReactNode } from 'react';

type BadgeVariant = 'success' | 'warning' | 'info' | 'neutral' | 'category';
type BadgeSize = 'sm' | 'md';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: BadgeSize;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300',
  warning:
    'bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300',
  info: 'bg-blue-100 text-blue-800 dark:bg-blue-500/15 dark:text-blue-300',
  neutral:
    'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
  category:
    'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
};

const sizeClasses: Record<BadgeSize, string> = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-3 py-1 text-sm gap-1.5',
};

/**
 * Badge component for displaying small status tags, metrics, or category indicators.
 * @param props - Properties for configuring the badge look and content.
 * @returns React element representing the badge.
 */
function Badge({
  variant = 'neutral',
  size = 'sm',
  icon,
  children,
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
    >
      {icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}
      {children}
    </span>
  );
}

export { Badge };
export type { BadgeProps, BadgeVariant, BadgeSize };
