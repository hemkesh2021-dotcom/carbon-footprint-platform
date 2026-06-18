'use client';

import { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, Play, Leaf } from 'lucide-react';

/* ──────────────────── Floating Particles ──────────────────── */

interface Particle {
  id: number;
  size: number;
  x: number;
  y: number;
  duration: number;
  delay: number;
  opacity: number;
}

/**
 * Pre-computed particle positions to avoid hydration mismatches.
 * Using Math.random() at module scope produces different values on
 * server vs client, breaking React hydration.
 */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

const particles: Particle[] = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  size: seededRandom(i * 7 + 1) * 10 + 4,
  x: seededRandom(i * 7 + 2) * 100,
  y: seededRandom(i * 7 + 3) * 100,
  duration: seededRandom(i * 7 + 4) * 12 + 10,
  delay: seededRandom(i * 7 + 5) * 6,
  opacity: seededRandom(i * 7 + 6) * 0.4 + 0.1,
}));

function FloatingParticles() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {mounted &&
        particles.map((p) => (
          <motion.div
            key={p.id}
            className="absolute"
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
            animate={{
              y: [0, -60, -20, -80, 0],
              x: [0, 20, -15, 10, 0],
              rotate: [0, 90, 180, 270, 360],
              opacity: [p.opacity, p.opacity * 1.8, p.opacity, p.opacity * 1.5, p.opacity],
            }}
            transition={{
              duration: p.duration,
              delay: p.delay,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <Leaf
              size={p.size}
              className="text-emerald-400/40 dark:text-emerald-300/30"
            />
          </motion.div>
        ))}
    </div>
  );
}

/* ──────────────────── Animated Earth SVG ──────────────────── */

function AnimatedEarth() {
  return (
    <motion.div
      className="relative mx-auto w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96"
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1.2, delay: 0.6, ease: 'easeOut' }}
    >
      {/* Glow ring */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(16,185,129,0.2) 0%, rgba(6,182,212,0.1) 50%, transparent 70%)',
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <svg viewBox="0 0 400 400" className="relative z-10 w-full h-full" role="img" aria-label="Animated Earth illustration with green elements">
        <title>Earth with green sustainable elements</title>
        {/* Ocean */}
        <defs>
          <linearGradient id="earthGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0ea5e9" />
            <stop offset="50%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>
          <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <radialGradient id="atmosphereGlow" cx="30%" cy="30%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>
        </defs>

        {/* Earth circle */}
        <circle cx="200" cy="200" r="150" fill="url(#earthGradient)" />

        {/* Continents (simplified) */}
        <motion.path
          d="M140,120 Q160,100 190,110 Q210,105 220,120 Q240,115 250,130 Q260,150 250,170 Q240,180 220,175 Q200,185 180,175 Q160,180 145,165 Q130,145 140,120Z"
          fill="url(#landGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        />
        <motion.path
          d="M170,210 Q185,200 200,205 Q220,200 235,215 Q245,235 230,255 Q215,265 195,260 Q175,255 165,240 Q160,225 170,210Z"
          fill="url(#landGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
        />
        <motion.path
          d="M260,175 Q275,165 290,175 Q300,190 295,210 Q285,225 270,220 Q255,210 255,195 Q255,180 260,175Z"
          fill="url(#landGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        />

        {/* Atmosphere highlight */}
        <circle cx="200" cy="200" r="150" fill="url(#atmosphereGlow)" />

        {/* Orbit ring */}
        <motion.ellipse
          cx="200"
          cy="200"
          rx="185"
          ry="60"
          fill="none"
          stroke="rgba(16,185,129,0.3)"
          strokeWidth="1.5"
          strokeDasharray="8 6"
          transform="rotate(-20 200 200)"
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        />

        {/* Leaf satellites */}
        <motion.g
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <circle cx="370" cy="200" r="8" fill="#10b981" />
          <text x="366" y="204" fontSize="10" fill="white">🌿</text>
        </motion.g>
        <motion.g
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '200px 200px' }}
        >
          <circle cx="200" cy="35" r="6" fill="#06b6d4" />
        </motion.g>
      </svg>

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-emerald-400/20 dark:border-emerald-300/15"
          animate={{ scale: [1, 1.4], opacity: [0.4, 0] }}
          transition={{
            duration: 3,
            delay: i * 1,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  );
}

/* ──────────────────── Stats Row ──────────────────── */

const stats = [
  { value: '4.8 tonnes', label: 'Avg per person/year' },
  { value: '27%', label: 'From transport' },
  { value: '30%', label: 'Reducible with habits' },
];

function StatsRow() {
  return (
    <motion.div
      className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-3 sm:gap-6 max-w-2xl mx-auto"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.15, delayChildren: 1.5 } },
      }}
    >
      {stats.map((stat) => (
        <motion.div
          key={stat.label}
          className="group relative rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md px-6 py-5 text-center transition-colors hover:bg-white/10 dark:border-white/[0.06] dark:bg-white/[0.03]"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
          }}
        >
          <p className="text-2xl font-bold text-emerald-400 dark:text-emerald-300">
            {stat.value}
          </p>
          <p className="mt-1 text-sm text-slate-300">
            {stat.label}
          </p>
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ──────────────────── Hero Section ──────────────────── */

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' as const },
  }),
};

export default function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const headlineWords = [
    { text: 'Understand', gradient: false },
    { text: 'your', gradient: false },
    { text: 'carbon', gradient: true },
    { text: 'footprint.', gradient: true },
    { text: 'Reduce', gradient: false },
    { text: 'it', gradient: false },
    { text: 'with', gradient: false },
    { text: 'simple', gradient: true },
    { text: 'daily', gradient: true },
    { text: 'actions.', gradient: true },
  ];

  return (
    <section
      ref={ref}
      className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-20 sm:px-6 lg:px-8"
      aria-label="Hero"
    >
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-20"
        style={{ y: backgroundY }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950 via-teal-950 to-sky-950 dark:from-[#020e08] dark:via-[#021210] dark:to-[#021018]" />
        <motion.div
          className="absolute inset-0 opacity-50"
          animate={{
            background: [
              'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(16,185,129,0.25), transparent)',
              'radial-gradient(ellipse 80% 60% at 80% 30%, rgba(6,182,212,0.25), transparent)',
              'radial-gradient(ellipse 80% 60% at 50% 70%, rgba(16,185,129,0.25), transparent)',
              'radial-gradient(ellipse 80% 60% at 20% 40%, rgba(6,182,212,0.25), transparent)',
            ],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </motion.div>

      <FloatingParticles />

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center text-center"
        style={{ opacity: contentOpacity }}
      >
        {/* Badge */}
        <motion.div
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-300 backdrop-blur-sm"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Free Carbon Calculator
        </motion.div>

        {/* Headline */}
        <h1 className="max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
          <motion.span
            className="flex flex-wrap justify-center gap-x-3 gap-y-1 sm:gap-x-4"
            initial="hidden"
            animate="visible"
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={`${word.text}-${i}`}
                custom={i}
                variants={wordVariants}
                className={
                  word.gradient
                    ? 'bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400 bg-clip-text text-transparent'
                    : ''
                }
              >
                {word.text}
              </motion.span>
            ))}
          </motion.span>
        </h1>

        {/* Subheadline */}
        <motion.p
          className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-300/90 sm:text-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1 }}
        >
          Track your lifestyle impact, discover your biggest emission sources,
          and get personalized tips to live more sustainably.
        </motion.p>

        {/* CTAs */}
        <motion.div
          className="mt-10 flex flex-col gap-4 sm:flex-row sm:gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.2 }}
        >
          <Link
            href="/calculator"
            className="group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full bg-emerald-500 px-8 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-400"
          >
            <span className="absolute inset-0 -z-10 bg-gradient-to-r from-emerald-400 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
            Calculate My Footprint
            <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/10 hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/50"
          >
            <Play size={16} />
            View Dashboard
          </Link>
        </motion.div>

        {/* Earth illustration */}
        <div className="mt-12 lg:mt-16">
          <AnimatedEarth />
        </div>

        {/* Stats */}
        <StatsRow />
      </motion.div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white to-transparent dark:from-[#0a0a0a]" />
    </section>
  );
}
