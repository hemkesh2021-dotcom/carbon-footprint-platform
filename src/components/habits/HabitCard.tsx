'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Check } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import type { Habit } from '@/types/habit';
import { formatCO2 } from '@/utils/formatting';

interface HabitCardProps {
  habit: Habit;
  onMarkComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;

/** Simple seeded PRNG for deterministic output across server/client */
function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/** Generate confetti particle data for micro-animation */
function generateConfettiParticles(count: number) {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: (seededRandom(i * 5 + 1) - 0.5) * 120,
    y: -(seededRandom(i * 5 + 2) * 80 + 30),
    rotation: seededRandom(i * 5 + 3) * 360,
    scale: 0.5 + seededRandom(i * 5 + 4) * 0.5,
    color: ['#10b981', '#34d399', '#6ee7b7', '#a7f3d0', '#fbbf24', '#f59e0b'][
      Math.floor(seededRandom(i * 5 + 5) * 6)
    ],
  }));
}

function getWeekDates(): Date[] {
  const now = new Date();
  const dayOfWeek = now.getDay();
  // Monday = 0 index, Sunday = 6 index
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(now);
  monday.setDate(now.getDate() + mondayOffset);
  monday.setHours(0, 0, 0, 0);

  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function HabitCard({ habit, onMarkComplete, onDelete }: HabitCardProps) {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const today = toDateString(new Date());
  const isCompletedToday = habit.completionHistory?.[today] ?? false;
  const weekDates = useMemo(() => getWeekDates(), []);

  const confettiParticles = useMemo(() => generateConfettiParticles(12), []);

  const handleComplete = useCallback(async () => {
    if (isCompletedToday || isCompleting) return;
    setIsCompleting(true);
    setShowConfetti(true);
    try {
      await onMarkComplete(habit.id);
    } finally {
      setIsCompleting(false);
      setTimeout(() => setShowConfetti(false), 800);
    }
  }, [habit.id, isCompletedToday, isCompleting, onMarkComplete]);

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    try {
      await onDelete(habit.id);
    } finally {
      setIsDeleting(false);
    }
  }, [habit.id, isDeleting, onDelete]);

  return (
    <motion.article
      layout
      layoutId={`habit-${habit.id}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: -10 }}
      transition={{ duration: 0.3 }}
      className="relative rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800"
      aria-label={`Habit: ${habit.name}`}
    >
      {/* Delete button */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="absolute right-3 top-3 rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
        aria-label={`Delete habit: ${habit.name}`}
      >
        <Trash2 className="h-4 w-4" />
      </button>

      {/* Icon + Name */}
      <div className="mb-3 flex items-center gap-3">
        <span className="text-3xl" role="img" aria-hidden="true">
          {habit.icon}
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-gray-900 dark:text-white">
            {habit.name}
          </h3>
          <Badge variant="neutral">{habit.category}</Badge>
        </div>
      </div>

      {/* Streak */}
      {(habit.streakCount ?? 0) > 0 && (
        <div className="mb-3 flex items-center gap-1.5">
          <motion.span
            animate={
              (habit.streakCount ?? 0) > 0
                ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] }
                : {}
            }
            transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
            className="text-lg"
            role="img"
            aria-hidden="true"
          >
            🔥
          </motion.span>
          <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
            {habit.streakCount} day streak
          </span>
        </div>
      )}

      {/* Weekly dots */}
      <div className="mb-4" role="group" aria-label="Weekly completion">
        <div className="flex items-center gap-1.5">
          {weekDates.map((date, i) => {
            const dateStr = toDateString(date);
            const completed = habit.completionHistory?.[dateStr] ?? false;
            return (
              <div key={dateStr} className="flex flex-col items-center gap-1">
                <span className="text-[10px] font-medium text-gray-500 dark:text-gray-400">
                  {DAY_LABELS[i]}
                </span>
                <motion.div
                  initial={false}
                  animate={{
                    backgroundColor: completed ? '#10b981' : '#e5e7eb',
                    scale: completed ? 1 : 0.85,
                  }}
                  className="h-3 w-3 rounded-full"
                  aria-label={`${DAY_LABELS[i]}: ${completed ? 'completed' : 'not completed'}`}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* CO₂ savings */}
      <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
        ~{formatCO2(habit.estimatedReduction ?? 0)} saved / month
      </p>

      {/* Mark Complete button with confetti */}
      <div className="relative">
        <motion.button
          onClick={handleComplete}
          disabled={isCompletedToday || isCompleting}
          whileTap={!isCompletedToday ? { scale: 0.95 } : {}}
          className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
            isCompletedToday
              ? 'cursor-default bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
              : 'bg-emerald-600 text-white hover:bg-emerald-700 active:bg-emerald-800 dark:bg-emerald-500 dark:hover:bg-emerald-600'
          }`}
          aria-label={isCompletedToday ? 'Already completed today' : `Mark ${habit.name} complete`}
        >
          <AnimatePresence mode="wait">
            {isCompletedToday ? (
              <motion.span
                key="done"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="flex items-center gap-2"
              >
                <Check className="h-4 w-4" />
                Completed Today
              </motion.span>
            ) : (
              <motion.span key="mark" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                Mark Complete
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>

        {/* Confetti micro-animation */}
        <AnimatePresence>
          {showConfetti && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-visible">
              {confettiParticles.map((particle) => (
                <motion.div
                  key={particle.id}
                  initial={{ opacity: 1, x: 0, y: 0, scale: 0, rotate: 0 }}
                  animate={{
                    opacity: 0,
                    x: particle.x,
                    y: particle.y,
                    scale: particle.scale,
                    rotate: particle.rotation,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                  className="absolute h-2 w-2 rounded-full"
                  style={{ backgroundColor: particle.color }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
