'use client';

/** @module hooks/useHabits - React hook for tracking sustainable habits and streaks. */

import { useState, useEffect, useCallback } from 'react';
import type { Habit, HabitTemplate } from '@/types/habit';
import * as habitService from '@/services/habit.service';

interface UseHabitsReturn {
  habits: Habit[];
  templates: HabitTemplate[];
  addHabit: (habit: Omit<Habit, 'id'>) => Promise<void>;
  removeHabit: (id: string) => Promise<void>;
  markComplete: (id: string, date?: string) => Promise<void>;
  isLoading: boolean;
}

/** Manage sustainable habit tracking with templates, completion toggling, and streak calculation. */
export function useHabits(): UseHabitsReturn {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [templates, setTemplates] = useState<HabitTemplate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadHabits = useCallback(async () => {
    setIsLoading(true);
    try {
      const [loadedHabits, loadedTemplates] = await Promise.all([
        habitService.getHabits(),
        habitService.getHabitTemplates(),
      ]);
      setHabits(loadedHabits);
      setTemplates(loadedTemplates);
    } catch (error) {
      console.error('Failed to load habits:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadHabits();
  }, [loadHabits]);

  const addHabit = useCallback(
    async (habit: Omit<Habit, 'id'>) => {
      await habitService.addHabit(habit);
      await loadHabits();
    },
    [loadHabits],
  );

  const removeHabit = useCallback(
    async (id: string) => {
      await habitService.removeHabit(id);
      await loadHabits();
    },
    [loadHabits],
  );

  const markComplete = useCallback(
    async (id: string, date?: string) => {
      await habitService.markComplete(id, date);
      await loadHabits();
    },
    [loadHabits],
  );

  return {
    habits,
    templates,
    addHabit,
    removeHabit,
    markComplete,
    isLoading,
  };
}
