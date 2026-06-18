'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Target, BarChart3, Lightbulb, TrendingDown } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ──────────────────── Data ──────────────────── */

interface Benefit {
  icon: LucideIcon;
  title: string;
  description: string;
  accent: string;
  iconBg: string;
  glowColor: string;
}

const benefits: Benefit[] = [
  {
    icon: Target,
    title: 'Know Your Impact',
    description:
      'Get a personalized estimate of your daily carbon footprint in under 3 minutes.',
    accent: 'text-rose-400',
    iconBg: 'bg-rose-500/10',
    glowColor: 'group-hover:shadow-rose-500/10',
  },
  {
    icon: BarChart3,
    title: 'Find What Matters',
    description:
      'See exactly which habits contribute most to your emissions with clear visual breakdowns.',
    accent: 'text-blue-400',
    iconBg: 'bg-blue-500/10',
    glowColor: 'group-hover:shadow-blue-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Take Action',
    description:
      'Receive personalized, practical tips ranked by impact and ease of adoption.',
    accent: 'text-amber-400',
    iconBg: 'bg-amber-500/10',
    glowColor: 'group-hover:shadow-amber-500/10',
  },
  {
    icon: TrendingDown,
    title: 'Track Progress',
    description:
      'Watch your footprint shrink over time with beautiful charts and streak tracking.',
    accent: 'text-emerald-400',
    iconBg: 'bg-emerald-500/10',
    glowColor: 'group-hover:shadow-emerald-500/10',
  },
];

/* ──────────────────── Card ──────────────────── */

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.12, ease: 'easeOut' as const },
  }),
};

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      className={`group relative overflow-hidden rounded-3xl border border-slate-200/60 bg-white/70 p-8 backdrop-blur-xl shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${benefit.glowColor} dark:border-white/[0.08] dark:bg-white/[0.04]`}
    >
      {/* Corner glow on hover */}
      <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-gradient-to-br from-current to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-10" />

      {/* Icon */}
      <div className={`inline-flex rounded-2xl p-3 ${benefit.iconBg}`}>
        <benefit.icon className={`h-7 w-7 ${benefit.accent}`} strokeWidth={1.8} />
      </div>

      {/* Content */}
      <h3 className="mt-5 text-xl font-bold text-slate-900 dark:text-white">
        {benefit.title}
      </h3>
      <p className="mt-3 text-base leading-relaxed text-slate-600 dark:text-slate-400">
        {benefit.description}
      </p>

      {/* Bottom line accent */}
      <div
        className={`absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-transparent via-current to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-30 ${benefit.accent}`}
      />
    </motion.article>
  );
}

/* ──────────────────── Section ──────────────────── */

export default function BenefitsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      aria-label="Benefits"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-b from-emerald-50 to-transparent opacity-60 blur-3xl dark:from-emerald-950/30" />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <motion.div
          className="mx-auto max-w-2xl text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
        >
          <motion.span
            className="inline-block rounded-full bg-emerald-100 px-4 py-1.5 text-sm font-semibold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
          >
            Why use our platform
          </motion.span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            Everything you need to{' '}
            <span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
              go greener
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            From awareness to action — our tools make sustainable living simple,
            measurable, and rewarding.
          </p>
        </motion.div>

        {/* Cards grid */}
        <motion.div
          ref={ref}
          className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {benefits.map((benefit, i) => (
            <BenefitCard key={benefit.title} benefit={benefit} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
