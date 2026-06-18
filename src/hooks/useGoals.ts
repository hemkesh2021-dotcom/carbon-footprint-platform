'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Goal } from '@/types/goal';
import * as goalService from '@/services/goal.service';

interface UseGoalsReturn {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => Promise<void>;
  updateProgress: (id: string, progress: number) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  isLoading: boolean;
}

export function useGoals(): UseGoalsReturn {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadGoals = useCallback(async () => {
    setIsLoading(true);
    try {
      const loadedGoals = await goalService.getGoals();
      setGoals(loadedGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadGoals();
  }, [loadGoals]);

  const addGoal = useCallback(
    async (goal: Omit<Goal, 'id'>) => {
      await goalService.addGoal(goal);
      await loadGoals();
    },
    [loadGoals],
  );

  const updateProgress = useCallback(
    async (id: string, progress: number) => {
      await goalService.updateProgress(id, progress);
      await loadGoals();
    },
    [loadGoals],
  );

  const removeGoal = useCallback(
    async (id: string) => {
      await goalService.removeGoal(id);
      await loadGoals();
    },
    [loadGoals],
  );

  return {
    goals,
    addGoal,
    updateProgress,
    removeGoal,
    isLoading,
  };
}
