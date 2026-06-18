/** @module services/goal - Goal management service for emission reduction targets. */

import type { Goal } from '@/types';
import { storage } from './storage';

const STORAGE_KEY = 'goals';

/** Retrieve all saved emission reduction goals. */
export async function getGoals(): Promise<Goal[]> {
  const goals = storage.get<Goal[]>(STORAGE_KEY);
  return goals || [];
}

/**
 * Create a new emission reduction goal.
 * @param goalData - Goal data without the auto-generated ID.
 */
export async function addGoal(goalData: Omit<Goal, 'id'>): Promise<void> {
  const goals = await getGoals();
  const newGoal: Goal = {
    ...goalData,
    id: crypto.randomUUID(),
  };
  goals.push(newGoal);
  storage.set(STORAGE_KEY, goals);
}

/**
 * Update progress toward a goal and auto-mark as completed if the target is met.
 * @param id - The goal's unique ID.
 * @param progress - The new current value for the goal.
 */
export async function updateProgress(id: string, progress: number): Promise<void> {
  const goals = await getGoals();
  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) return;

  const goal = goals[index];
  if (!goal) return;

  goal.currentValue = progress;
  goal.isCompleted = goal.currentValue >= goal.targetReduction;

  storage.set(STORAGE_KEY, goals);
}

/** Remove a goal by its unique ID. */
export async function removeGoal(id: string): Promise<void> {
  const goals = await getGoals();
  const filtered = goals.filter((g) => g.id !== id);
  storage.set(STORAGE_KEY, filtered);
}
