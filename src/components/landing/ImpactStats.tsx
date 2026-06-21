'use client';

/** @module ImpactStats - Component or utility for ImpactStats */


import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView } from 'framer-motion';
import { Globe, Car, Target as TargetIcon, Sparkles } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ──────────────────── Count-up Hook ──────────────────── */

function useCountUp(
  end: number,
  isActive: boolean,
  options: { duration?: number; decimals?: number } = {}
): string {
  const { duration = 2000, decimals = 1 } = options;
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const animate = useCallback(
    function tick(timestamp: number) {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(eased * end);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    },
    [end, duration]
  );

  useEffect(() => {
    if (!isActive) return;
    startTimeRef.current = null;
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [isActive, animate]);

  return decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
}

/* ──────────────────── Data ──────────────────── */

interface StatItem {
  icon: LucideIcon;
  value: number;
  decimals: number;
  suffix: string;
  label: string;
  description: string;
  color: string;
}

const statItems: StatItem[] = [
  {
    icon: Globe,
    value: 4.8,
    decimals: 1,
    suffix: ' tonnes',
    label: 'Average Annual CO₂e',
    description: 'Per person worldwide',
    color: 'text-blue-400',
  },
  {
    icon: Car,
    value: 27,
    decimals: 0,
    suffix: '%',
    label: 'Transport Emissions',
    description: 'Of global emissions from transport',
    color: 'text-amber-400',
  },
  {
    icon: TargetIcon,
    value: 2.0,
    decimals: 1,
    suffix: ' tonnes',
    label: 'Paris Agreement Target',
    description: 'Per person per year by 2030',
    color: 'text-emerald-400',
  },
  {
    icon: Sparkles,
    value: 30,
    decimals: 0,
    suffix: '%',
    label: 'Reducible Footprint',
    description: 'Through simple habit changes',
    color: 'text-violet-400',
  },
];

/* ──────────────────── Stat Card ──────────────────── */

function StatCard({
  item,
  index,
  isInView,
}: {
  item: StatItem;
  index: number;
  isInView: boolean;
}) {
  const count = useCountUp(item.value, isInView, {
    duration: 2200,
    decimals: item.decimals,
  });

  return (
    <motion.div
      className="relative flex flex-col items-center px-6 py-8 text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
    >
      {/* Icon */}
      <div className={`mb-4 rounded-2xl bg-white/5 p-3 ${item.color}`}>
        <item.icon className="h-7 w-7" strokeWidth={1.8} />
      </div>

      {/* Animated number */}
      <p className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
        {count}
        <span className={item.color}>{item.suffix}</span>
      </p>

      {/* Label */}
      <p className="mt-2 text-base font-semibold text-white/90">{item.label}</p>
      <p className="mt-1 text-sm text-slate-400">{item.description}</p>
    </motion.div>
  );
}

/* ──────────────────── Section ──────────────────── */

export default function ImpactStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="relative overflow-hidden py-24 sm:py-32" aria-label="Impact statistics">
      {/* Background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900 dark:from-[#050a08] dark:via-[#061210] dark:to-[#05080a]" />

      {/* Decorative grid */}
      <div
        className="pointer-events-none absolute inset-0 -z-[5] opacity-[0.03]"
        aria-hidden="true"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-[5] h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[120px]" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
            The numbers that{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              matter
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-400">
            Understanding the scale of our impact is the first step toward meaningful change.
          </p>
        </motion.div>

        {/* Stats grid */}
        <div
          ref={ref}
          className="mt-16 grid grid-cols-1 divide-y divide-white/[0.06] sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-4"
        >
          {statItems.map((item, i) => (
            <StatCard key={item.label} item={item} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
