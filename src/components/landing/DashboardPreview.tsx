'use client';

/** @module DashboardPreview - Component or utility for DashboardPreview */


import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useInView, useMotionValue, useTransform, useSpring } from 'framer-motion';
import {
  TrendingDown,
  Zap,
  Utensils,
  Car,
  Home,
  ShoppingBag,
  ArrowDownRight,
  CheckCircle,
  Flame,
} from 'lucide-react';

/* ──────────────────── Count-up Hook ──────────────────── */

function useCountUp(end: number, isActive: boolean, duration = 2200): number {
  const [value, setValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const rafRef = useRef<number>(0);

  const animate = useCallback(
    function tick(timestamp: number) {
      if (startTimeRef.current === null) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * end));

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

  return value;
}

/* ──────────────────── Donut Chart (SVG) ──────────────────── */

interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

const segments: DonutSegment[] = [
  { label: 'Transport', value: 35, color: '#f59e0b' },
  { label: 'Diet', value: 25, color: '#10b981' },
  { label: 'Housing', value: 22, color: '#3b82f6' },
  { label: 'Shopping', value: 18, color: '#8b5cf6' },
];

function DonutChart({ isInView }: { isInView: boolean }) {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative h-36 w-36 mx-auto">
      <svg viewBox="0 0 128 128" className="h-full w-full -rotate-90">
        {segments.map((seg, i) => {
          const segLen = (seg.value / total) * circumference;
          const prevSum = segments.slice(0, i).reduce((sum, s) => sum + s.value, 0);
          const offset = (prevSum / total) * circumference;

          return (
            <motion.circle
              key={seg.label}
              cx="64"
              cy="64"
              r={radius}
              fill="none"
              stroke={seg.color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={`${segLen - 3} ${circumference - segLen + 3}`}
              strokeDashoffset={-offset}
              initial={{ opacity: 0, pathLength: 0 }}
              animate={isInView ? { opacity: 1, pathLength: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.5 + i * 0.15, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <p className="text-xs font-medium text-slate-400">Total</p>
        <p className="text-lg font-extrabold text-slate-900 dark:text-white">100%</p>
      </div>
    </div>
  );
}

/* ──────────────────── Trend Line (SVG) ──────────────────── */

function TrendLine({ isInView }: { isInView: boolean }) {
  const points = [80, 75, 78, 68, 62, 55, 50, 42, 38];
  const width = 240;
  const height = 70;
  const stepX = width / (points.length - 1);

  const pathData = points
    .map((y, i) => {
      const px = i * stepX;
      const py = height - (y / 100) * height;
      return `${i === 0 ? 'M' : 'L'}${px},${py}`;
    })
    .join(' ');

  const areaPath = `${pathData} L${width},${height} L0,${height} Z`;

  return (
    <div className="relative h-20 w-full">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-full w-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id="trendFill" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
          </linearGradient>
        </defs>
        <motion.path
          d={areaPath}
          fill="url(#trendFill)"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.path
          d={pathData}
          fill="none"
          stroke="#10b981"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.8, ease: 'easeInOut' }}
        />
      </svg>
      <div className="absolute right-0 top-1 flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
        <ArrowDownRight size={12} />
        -18%
      </div>
    </div>
  );
}

/* ──────────────────── Mini Recommendation Cards ──────────────────── */

interface Recommendation {
  icon: typeof Zap;
  text: string;
  impact: string;
  color: string;
}

const recommendations: Recommendation[] = [
  {
    icon: Utensils,
    text: 'Try 2 meatless days per week',
    impact: '-120 kg/yr',
    color: 'text-emerald-500',
  },
  {
    icon: Car,
    text: 'Carpool twice a week',
    impact: '-85 kg/yr',
    color: 'text-amber-500',
  },
  {
    icon: Zap,
    text: 'Switch to LED lighting',
    impact: '-45 kg/yr',
    color: 'text-blue-500',
  },
];

function MiniRecommendations({ isInView }: { isInView: boolean }) {
  return (
    <div className="space-y-2">
      {recommendations.map((rec, i) => (
        <motion.div
          key={rec.text}
          className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/60 px-3 py-2.5 backdrop-blur-sm transition-colors hover:bg-white dark:border-white/[0.06] dark:bg-white/[0.03] dark:hover:bg-white/[0.06]"
          initial={{ opacity: 0, x: 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: 1.2 + i * 0.12 }}
        >
          <div className={`rounded-lg bg-slate-50 p-1.5 dark:bg-white/[0.05] ${rec.color}`}>
            <rec.icon size={14} />
          </div>
          <p className="flex-1 text-xs font-medium text-slate-700 dark:text-slate-300">
            {rec.text}
          </p>
          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
            {rec.impact}
          </span>
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────── Category Legend ──────────────────── */

const categoryIcons = [
  { icon: Car, label: 'Transport', pct: '35%', color: '#f59e0b' },
  { icon: Utensils, label: 'Diet', pct: '25%', color: '#10b981' },
  { icon: Home, label: 'Housing', pct: '22%', color: '#3b82f6' },
  { icon: ShoppingBag, label: 'Shopping', pct: '18%', color: '#8b5cf6' },
];

function CategoryLegend() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {categoryIcons.map((cat) => (
        <div key={cat.label} className="flex items-center gap-2">
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ backgroundColor: cat.color }}
          />
          <span className="text-xs text-slate-600 dark:text-slate-400">
            {cat.label}
          </span>
          <span className="ml-auto text-xs font-semibold text-slate-800 dark:text-slate-200">
            {cat.pct}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ──────────────────── Dashboard Preview ──────────────────── */

export default function DashboardPreview() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const count = useCountUp(3847, isInView);

  // 3D tilt on mouse move
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [6, -6]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-400, 400], [-6, 6]), {
    stiffness: 150,
    damping: 20,
  });

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(e.clientX - centerX);
    mouseY.set(e.clientY - centerY);
  }

  function handleMouseLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      aria-label="Dashboard preview"
    >
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 opacity-60 blur-3xl dark:from-emerald-950/20 dark:via-teal-950/15 dark:to-cyan-950/20" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="inline-block rounded-full bg-cyan-100 px-4 py-1.5 text-sm font-semibold text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400">
            Live Preview
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Your{' '}
            <span className="bg-gradient-to-r from-cyan-500 to-emerald-500 bg-clip-text text-transparent">
              personalized
            </span>{' '}
            dashboard
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            Beautiful insights into your carbon footprint — updated in real time.
          </p>
        </motion.div>

        {/* 3D tilt wrapper */}
        <div
          className="mt-16 perspective-[1200px]"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            ref={ref}
            style={{ rotateX, rotateY }}
            className="mx-auto max-w-4xl"
          >
            {/* Dashboard mockup glass card */}
            <motion.div
              className="relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/80 p-6 shadow-2xl shadow-black/5 backdrop-blur-2xl sm:p-8 dark:border-white/[0.08] dark:bg-white/[0.04] dark:shadow-black/30"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {/* Top bar */}
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                    <TrendingDown className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      Your Carbon Footprint
                    </p>
                    <p className="text-2xl font-extrabold text-slate-900 sm:text-3xl dark:text-white">
                      {count.toLocaleString()}
                      <span className="ml-1 text-base font-semibold text-slate-400">
                        kg CO₂e/year
                      </span>
                    </p>
                  </div>
                </div>
                <div className="hidden items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-600 sm:flex dark:bg-emerald-900/30 dark:text-emerald-400">
                  <CheckCircle size={14} />
                  Below avg
                </div>
              </div>

              {/* Content grid */}
              <div className="grid gap-6 sm:grid-cols-2">
                {/* Left: Donut + Legend */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                  <p className="mb-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
                    Emission Breakdown
                  </p>
                  <DonutChart isInView={isInView} />
                  <div className="mt-4">
                    <CategoryLegend />
                  </div>
                </div>

                {/* Right: Trend + Recommendations */}
                <div className="space-y-5">
                  {/* Trend */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-5 dark:border-white/[0.05] dark:bg-white/[0.02]">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                        6-Month Trend
                      </p>
                      <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                        <Flame size={12} />
                        12 day streak
                      </div>
                    </div>
                    <TrendLine isInView={isInView} />
                  </div>

                  {/* Recommendations */}
                  <div>
                    <p className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Top Recommendations
                    </p>
                    <MiniRecommendations isInView={isInView} />
                  </div>
                </div>
              </div>

              {/* Shine overlay */}
              <motion.div
                className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent opacity-0 dark:from-white/5"
                animate={isInView ? { opacity: [0, 0.5, 0] } : {}}
                transition={{ duration: 2, delay: 0.5 }}
                aria-hidden="true"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
