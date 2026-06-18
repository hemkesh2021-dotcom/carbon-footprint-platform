'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Plus } from 'lucide-react';
import { HabitCard } from '@/components/habits/HabitCard';
import type { Habit } from '@/types/habit';

type CategoryFilter = 'all' | string;

interface HabitListProps {
  habits: Habit[];
  onMarkComplete: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddClick: () => void;
}

const FILTER_TABS: { label: string; value: CategoryFilter }[] = [
  { label: 'All', value: 'all' },
  { label: '🚗 Transport', value: 'transport' },
  { label: '⚡ Energy', value: 'energy' },
  { label: '🥗 Food', value: 'food' },
  { label: '🛍️ Shopping', value: 'shopping' },
  { label: '♻️ Waste', value: 'waste' },
];

export function HabitList({ habits, onMarkComplete, onDelete, onAddClick }: HabitListProps) {
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('all');

  const filteredHabits = useMemo(() => {
    if (activeFilter === 'all') return habits;
    return habits.filter(
      (h) => h.category.toLowerCase() === activeFilter.toLowerCase(),
    );
  }, [habits, activeFilter]);

  return (
    <section aria-label="Habit list">
      {/* Filter tabs */}
      <div className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter habits by category">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.value}
            role="tab"
            aria-selected={activeFilter === tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 ${
              activeFilter === tab.value
                ? 'bg-emerald-600 text-white shadow-sm dark:bg-emerald-500'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Habit grid or empty state */}
      {filteredHabits.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center dark:border-slate-600 dark:bg-slate-800/50"
        >
          <span className="mb-4 text-5xl" role="img" aria-hidden="true">
            🌱
          </span>
          <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
            {habits.length === 0
              ? 'No habits yet'
              : 'No habits in this category'}
          </h3>
          <p className="mb-6 max-w-sm text-sm text-slate-500 dark:text-slate-400">
            {habits.length === 0
              ? 'Start building eco-friendly habits! Add your first habit to begin tracking.'
              : 'Try selecting a different category or add a new habit.'}
          </p>
          <button
            onClick={onAddClick}
            className="flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-600"
          >
            <Plus className="h-4 w-4" />
            Add Habit
          </button>
        </motion.div>
      ) : (
        <LayoutGroup>
          <motion.div
            layout
            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="tabpanel"
          >
            <AnimatePresence mode="popLayout">
              {filteredHabits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onMarkComplete={onMarkComplete}
                  onDelete={onDelete}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      )}
    </section>
  );
}
