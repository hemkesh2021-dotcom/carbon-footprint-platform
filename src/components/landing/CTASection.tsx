'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Leaf, TreePine, Sprout } from 'lucide-react';

/* ──────────────────── Floating Leaves ──────────────────── */

function FloatingLeaves() {
  const leaves = [
    { Icon: Leaf, x: '10%', y: '20%', size: 28, dur: 14, del: 0, rot: 20 },
    { Icon: TreePine, x: '85%', y: '15%', size: 32, dur: 16, del: 2, rot: -15 },
    { Icon: Sprout, x: '75%', y: '75%', size: 24, dur: 12, del: 4, rot: 25 },
    { Icon: Leaf, x: '15%', y: '70%', size: 20, dur: 15, del: 1, rot: -30 },
    { Icon: Sprout, x: '50%', y: '85%', size: 18, dur: 13, del: 3, rot: 10 },
    { Icon: Leaf, x: '90%', y: '50%', size: 22, dur: 11, del: 5, rot: -20 },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {leaves.map((leaf, i) => (
        <motion.div
          key={i}
          className="absolute text-white/[0.08]"
          style={{ left: leaf.x, top: leaf.y }}
          animate={{
            y: [0, -30, 10, -20, 0],
            x: [0, 15, -10, 5, 0],
            rotate: [0, leaf.rot, -leaf.rot / 2, leaf.rot / 3, 0],
          }}
          transition={{
            duration: leaf.dur,
            delay: leaf.del,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          <leaf.Icon size={leaf.size} />
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────── CTA Section ──────────────────── */

export default function CTASection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32" aria-label="Call to action">
      {/* Gradient background */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 dark:from-emerald-800 dark:via-teal-800 dark:to-cyan-900" />

      {/* Radial glow overlay */}
      <div
        className="pointer-events-none absolute inset-0 -z-[5]"
        aria-hidden="true"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,255,255,0.08), transparent)',
        }}
      />

      <FloatingLeaves />

      <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
        {/* Badge */}
        <motion.div
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm font-medium text-white backdrop-blur-sm"
          initial={{ opacity: 0, y: -10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Sprout size={14} />
          Start today
        </motion.div>

        {/* Headline */}
        <motion.h2
          className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          Ready to make a{' '}
          <span className="relative">
            difference
            <svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M2 8 C50 2, 150 2, 198 8"
                stroke="rgba(255,255,255,0.4)"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
          ?
        </motion.h2>

        {/* Subheadline */}
        <motion.p
          className="mt-6 text-lg text-white/80 sm:text-xl max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Start your free assessment and discover how small changes can create
          meaningful impact.
        </motion.p>

        {/* CTA button */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <Link
            href="/calculator"
            className="group relative inline-flex items-center gap-3 rounded-full bg-white px-10 py-5 text-base font-bold text-emerald-700 shadow-2xl shadow-black/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-black/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <span>Start Your Journey</span>
            <ArrowRight
              size={20}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
            {/* Shine effect */}
            <span className="absolute inset-0 -z-10 overflow-hidden rounded-full">
              <span className="absolute -left-full top-0 h-full w-1/3 skew-x-[-25deg] bg-gradient-to-r from-transparent via-emerald-100/50 to-transparent transition-all duration-700 group-hover:left-[120%]" />
            </span>
          </Link>
        </motion.div>

        {/* Supporting text */}
        <motion.p
          className="mt-6 text-sm text-white/60"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          Takes less than 3 minutes · No sign-up required · 100% free
        </motion.p>
      </div>
    </section>
  );
}
