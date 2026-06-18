'use client';

/** @module HabitsPage - Habit tracker page with custom habits creation and streak calendar rendering */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Loader2, Leaf } from 'lucide-react';
import { HabitList } from '@/components/habits/HabitList';
import { StreakCalendar } from '@/components/habits/StreakCalendar';
import { AddHabitModal } from '@/components/habits/AddHabitModal';
import { useHabits } from '@/hooks/useHabits';

/**
 * HabitsPage component managing habit trackers.
 * Includes habit templates selection modal, streak summary charts, and daily checklists.
 */
export default function HabitsPage() {
  const { habits, templates, addHabit, removeHabit, markComplete, isLoading } =
    useHabits();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Loading your habits...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="flex items-center gap-3 text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          <Leaf className="h-8 w-8 text-emerald-600" />
          Habit Tracker
        </h1>
        <p className="mt-2 max-w-2xl text-slate-600 dark:text-slate-400">
          Build sustainable habits to reduce your carbon footprint. Track your
          daily progress and maintain your streaks.
        </p>
      </motion.div>

      {/* Onboarding card when no habits */}
      {habits.length === 0 && (
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20"
        >
          <div className="flex flex-col items-center px-6 py-12 text-center sm:py-16">
            <span className="mb-4 text-6xl" role="img" aria-hidden="true">
              🌍
            </span>
            <h2 className="mb-2 text-2xl font-bold text-slate-900 dark:text-white">
              Start Your Green Journey
            </h2>
            <p className="mb-6 max-w-md text-slate-600 dark:text-slate-400">
              Every small action counts! Add your first eco-friendly habit and
              start tracking your impact on the planet.
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25 transition-all hover:bg-emerald-700 hover:shadow-xl hover:shadow-emerald-500/30 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              <Plus className="h-5 w-5" />
              Add Your First Habit
            </button>
          </div>
        </motion.section>
      )}

      {/* Main content */}
      <div className="space-y-8">
        {/* Habit list */}
        <HabitList
          habits={habits}
          onMarkComplete={markComplete}
          onDelete={removeHabit}
          onAddClick={() => setIsModalOpen(true)}
        />

        {/* Streak calendar */}
        {habits.length > 0 && <StreakCalendar habits={habits} />}
      </div>

      {/* Floating Add Button */}
      {habits.length > 0 && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsModalOpen(true)}
          className="fixed bottom-8 right-8 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-500/30 transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          aria-label="Add new habit"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      )}

      {/* Add habit modal */}
      <AddHabitModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddHabit={addHabit}
        templates={templates}
      />
    </div>
  );
}
