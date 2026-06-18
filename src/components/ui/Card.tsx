'use client';

/** @module Card - Card component for structuring content panels */

import { forwardRef, type ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type CardVariant = 'default' | 'glass' | 'elevated' | 'bordered';
type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, keyof HTMLMotionProps<'div'>> {
  variant?: CardVariant;
  padding?: CardPadding;
  hover?: boolean;
  children: ReactNode;
  className?: string;
}

const variantClasses: Record<CardVariant, string> = {
  default:
    'bg-white dark:bg-slate-800 shadow-sm border border-slate-200/60 dark:border-slate-700/60',
  glass:
    'glass',
  elevated:
    'bg-white dark:bg-slate-800 shadow-lg shadow-slate-900/[0.06] dark:shadow-black/20 border border-slate-100 dark:border-slate-700/50',
  bordered:
    'bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600',
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

/**
 * Card component for bounding content sections with customized variants and spacing.
 * Supports a hover state with float animation for interactive elements.
 */
const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    variant = 'default',
    padding = 'md',
    hover = false,
    children,
    className = '',
    ...props
  },
  ref
) {
  const baseClasses = [
    'rounded-2xl',
    variantClasses[variant],
    paddingClasses[padding],
    hover ? 'cursor-pointer' : '',
    className,
  ].join(' ');

  if (hover) {
    return (
      <motion.div
        ref={ref}
        whileHover={{
          y: -3,
          boxShadow:
            '0 20px 25px -5px rgba(0,0,0,0.08), 0 8px 10px -6px rgba(0,0,0,0.04)',
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        className={baseClasses}
        {...(props as HTMLMotionProps<'div'>)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div ref={ref} className={baseClasses} {...props}>
      {children}
    </div>
  );
});

export { Card };
export type { CardProps, CardVariant, CardPadding };
