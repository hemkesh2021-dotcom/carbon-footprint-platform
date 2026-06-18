'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

/* ──────────────────── Data ──────────────────── */

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  initial: string;
  rating: number;
  accentFrom: string;
  accentTo: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "I had no idea my diet was my biggest contributor. After switching to 2 meatless days a week, I've already saved over 30kg CO₂e!",
    name: 'Sarah',
    role: 'Student',
    initial: 'S',
    rating: 5,
    accentFrom: 'from-emerald-400',
    accentTo: 'to-teal-400',
  },
  {
    quote:
      'The habit tracker keeps me accountable. My family reduced our footprint by 18% in just two months.',
    name: 'James',
    role: 'Father of Two',
    initial: 'J',
    rating: 5,
    accentFrom: 'from-blue-400',
    accentTo: 'to-cyan-400',
  },
  {
    quote:
      'Simple, clear, and motivating. No guilt trips, just practical actions I can actually do.',
    name: 'Priya',
    role: 'Software Engineer',
    initial: 'P',
    rating: 5,
    accentFrom: 'from-violet-400',
    accentTo: 'to-purple-400',
  },
];

/* ──────────────────── Card ──────────────────── */

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.15, ease: 'easeOut' as const },
  }),
};

function TestimonialCard({
  testimonial,
  index,
}: {
  testimonial: Testimonial;
  index: number;
}) {
  return (
    <motion.article
      custom={index}
      variants={cardVariants}
      className="group relative flex flex-col rounded-3xl border border-slate-200/60 bg-white/80 p-8 shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-white/[0.08] dark:bg-white/[0.04]"
    >
      {/* Quote icon */}
      <Quote
        className="mb-4 h-8 w-8 text-emerald-400/30 dark:text-emerald-300/20"
        strokeWidth={1.5}
      />

      {/* Stars */}
      <div className="mb-4 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            size={16}
            className={
              i < testimonial.rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300 dark:text-slate-600'
            }
          />
        ))}
      </div>

      {/* Quote text */}
      <blockquote className="flex-1 text-base leading-relaxed text-slate-700 dark:text-slate-300">
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      {/* Author */}
      <div className="mt-6 flex items-center gap-4 border-t border-slate-100 pt-6 dark:border-white/[0.06]">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.accentFrom} ${testimonial.accentTo} text-lg font-bold text-white shadow-md`}
        >
          {testimonial.initial}
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            {testimonial.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {testimonial.role}
          </p>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        className={`absolute inset-x-6 bottom-0 h-[2px] rounded-full bg-gradient-to-r ${testimonial.accentFrom} ${testimonial.accentTo} opacity-0 transition-opacity duration-300 group-hover:opacity-60`}
      />
    </motion.article>
  );
}

/* ──────────────────── Section ──────────────────── */

export default function TestimonialsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section
      className="relative overflow-hidden py-24 sm:py-32 px-4 sm:px-6 lg:px-8"
      aria-label="Testimonials"
    >
      {/* Subtle background */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute right-0 top-0 h-[500px] w-[500px] rounded-full bg-gradient-to-bl from-teal-50 to-transparent opacity-60 blur-3xl dark:from-teal-950/20" />
        <div className="absolute bottom-0 left-0 h-[400px] w-[400px] rounded-full bg-gradient-to-tr from-emerald-50 to-transparent opacity-40 blur-3xl dark:from-emerald-950/20" />
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
          <span className="inline-block rounded-full bg-teal-100 px-4 py-1.5 text-sm font-semibold text-teal-700 dark:bg-teal-900/30 dark:text-teal-400">
            Community Stories
          </span>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl dark:text-white">
            People are already making a{' '}
            <span className="bg-gradient-to-r from-teal-500 to-emerald-500 bg-clip-text text-transparent">
              difference
            </span>
          </h2>
          <p className="mt-4 text-lg text-slate-600 dark:text-slate-400">
            See how small changes are adding up to real impact.
          </p>
        </motion.div>

        {/* Cards */}
        <motion.div
          ref={ref}
          className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
        >
          {testimonials.map((t, i) => (
            <TestimonialCard key={t.name} testimonial={t} index={i} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
