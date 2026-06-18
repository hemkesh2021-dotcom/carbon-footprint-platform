import type { Goal } from '@/types';
import { storage } from './storage';

const STORAGE_KEY = 'goals';

export async function getGoals(): Promise<Goal[]> {
  const goals = storage.get<Goal[]>(STORAGE_KEY);
  return goals || [];
}

export async function addGoal(goalData: Omit<Goal, 'id'>): Promise<void> {
  const goals = await getGoals();
  const newGoal: Goal = {
    ...goalData,
    id: crypto.randomUUID(),
  };
  goals.push(newGoal);
  storage.set(STORAGE_KEY, goals);
}

export async function updateProgress(id: string, progress: number): Promise<void> {
  const goals = await getGoals();
  const index = goals.findIndex((g) => g.id === id);
  if (index === -1) return;

  const goal = goals[index];
  if (!goal) return;

  goal.currentValue = progress;
  // If currentValue (e.g. reduction %) meets or exceeds targetReduction %, it is completed
  // Wait, in types/goal.ts:
  // export interface Goal { id: string; title: string; targetReduction: number; category?: EmissionCategory; deadline: string; baselineValue: number; currentValue: number; createdAt: string; isCompleted: boolean; }
  goal.isCompleted = goal.currentValue >= goal.targetReduction;

  storage.set(STORAGE_KEY, goals);
}

export async function removeGoal(id: string): Promise<void> {
  const goals = await getGoals();
  const filtered = goals.filter((g) => g.id !== id);
  storage.set(STORAGE_KEY, filtered);
}
