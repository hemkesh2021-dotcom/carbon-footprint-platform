'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { getHabits, markComplete } from '@/services/habit.service';
import type { Habit } from '@/types';
import { Check, Flame, ArrowRight } from 'lucide-react';

interface HabitStreakPanelProps {
  refreshTrigger?: number;
}

export function HabitStreakPanel({ refreshTrigger = 0 }: HabitStreakPanelProps) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const loadActiveHabits = async () => {
    try {
      const allHabits = await getHabits();
      setHabits(allHabits.filter((h) => h.isActive));
    } catch (error) {
      console.error('Failed to load active habits:', error);
    }
  };

  useEffect(() => {
    void loadActiveHabits();
  }, [refreshTrigger]);

  const handleToggleComplete = async (habit: Habit) => {
    setLoadingId(habit.id);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      if (todayStr) {
        await markComplete(habit.id, todayStr);
        await loadActiveHabits();
      }
    } catch (error) {
      console.error('Failed to update habit completion:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];
  const activeHabits = habits.slice(0, 4); // Show top 4 habits in panel

  return (
    <Card variant="glass" padding="lg" hover className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Daily Habit Streaks</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Complete daily habits to maintain your streaks</p>
        </div>
        <Link
          href="/habits"
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1 hover:underline"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {activeHabits.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <span className="text-3xl mb-2">🌱</span>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No habits active
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[250px] mt-1 mb-4">
            Start tracking small actions to build long-term carbon reductions.
          </p>
          <Link href="/habits">
            <Button variant="outline" size="sm">
              Browse Habits
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {activeHabits.map((habit) => {
            const isCompletedToday = todayStr ? !!habit.completionHistory[todayStr] : false;

            return (
              <div
                key={habit.id}
                onClick={() => handleToggleComplete(habit)}
                className={`flex justify-between items-center p-4 rounded-xl border transition-all duration-300 cursor-pointer ${
                  isCompletedToday
                    ? 'border-emerald-500/30 bg-emerald-500/5 dark:border-emerald-500/20'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon */}
                  <span className="text-2xl shrink-0">{habit.icon}</span>
                  
                  {/* Name and streak */}
                  <div className="min-w-0">
                    <p className={`text-sm font-semibold truncate ${
                      isCompletedToday ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-700 dark:text-slate-200'
                    }`}>
                      {habit.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="inline-flex items-center text-xs font-semibold text-amber-500">
                        <Flame className="w-3.5 h-3.5 fill-amber-500 animate-pulse" />
                        <span className="ml-0.5">{habit.streakCount} day streak</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Checkbox button */}
                <button
                  type="button"
                  aria-label={`Mark "${habit.name}" as ${isCompletedToday ? 'incomplete' : 'complete'}`}
                  disabled={loadingId === habit.id}
                  className={`w-6.5 h-6.5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
                    isCompletedToday
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-slate-300 dark:border-slate-700 text-transparent hover:border-emerald-500'
                  }`}
                >
                  {loadingId === habit.id ? (
                    <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Check className="w-4 h-4 stroke-[3]" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
