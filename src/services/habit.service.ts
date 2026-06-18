import type { Habit, HabitTemplate } from '@/types';
import { storage } from './storage';

const STORAGE_KEY = 'habits';

export const HABIT_TEMPLATES: HabitTemplate[] = [
  { id: 'no-car-monday', name: 'No-Car Monday', category: 'transport', icon: '🚌', frequency: 'weekly', estimatedReduction: 10 },
  { id: 'meatless-wednesday', name: 'Meatless Wednesday', category: 'food', icon: '🥬', frequency: 'weekly', estimatedReduction: 12 },
  { id: 'lights-off', name: 'Lights-Off Routine', category: 'energy', icon: '💡', frequency: 'daily', estimatedReduction: 5 },
  { id: 'reusable-bottle', name: 'Reusable Bottle Day', category: 'waste', icon: '🧴', frequency: 'daily', estimatedReduction: 3 },
  { id: 'zero-waste-shopping', name: 'Zero-Waste Shopping', category: 'shopping', icon: '♻️', frequency: 'weekly', estimatedReduction: 8 },
  { id: 'bike-to-work', name: 'Bike to Work', category: 'transport', icon: '🚲', frequency: 'daily', estimatedReduction: 15 },
  { id: 'unplug-idle', name: 'Unplug Idle Devices', category: 'energy', icon: '🔌', frequency: 'daily', estimatedReduction: 4 },
  { id: 'buy-local', name: 'Buy Local Produce', category: 'food', icon: '🛒', frequency: 'weekly', estimatedReduction: 6 },
];

export async function getHabitTemplates(): Promise<HabitTemplate[]> {
  return HABIT_TEMPLATES;
}

export async function getHabits(): Promise<Habit[]> {
  const habits = storage.get<Habit[]>(STORAGE_KEY);
  if (!habits) return [];
  
  // Recalculate streaks before returning
  return habits.map(recalculateStreak);
}

export async function addHabit(habitData: Omit<Habit, 'id' | 'streakCount' | 'completionHistory' | 'createdAt' | 'isActive'> & { id?: string }): Promise<void> {
  const habits = await getHabits();
  
  const newHabit: Habit = {
    ...habitData,
    id: habitData.id || crypto.randomUUID(),
    streakCount: 0,
    completionHistory: {},
    createdAt: new Date().toISOString(),
    isActive: true,
  };

  habits.push(newHabit);
  storage.set(STORAGE_KEY, habits);
}

export async function removeHabit(id: string): Promise<void> {
  const habits = await getHabits();
  const filtered = habits.filter((h) => h.id !== id);
  storage.set(STORAGE_KEY, filtered);
}

export async function markComplete(id: string, dateStr?: string): Promise<void> {
  const habits = await getHabits();
  const index = habits.findIndex((h) => h.id === id);
  if (index === -1) return;

  const targetDate = dateStr || new Date().toISOString().split('T')[0];
  if (!targetDate) return;

  const habit = habits[index];
  if (!habit) return;

  // Toggle completion
  if (habit.completionHistory[targetDate]) {
    delete habit.completionHistory[targetDate];
  } else {
    habit.completionHistory[targetDate] = true;
  }

  // Recalculate streak
  habits[index] = recalculateStreak(habit);

  storage.set(STORAGE_KEY, habits);
}

function recalculateStreak(habit: Habit): Habit {
  const history = habit.completionHistory;
  let streak = 0;
  
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  if (!todayStr || !yesterdayStr) return habit;

  // If we completed it neither today nor yesterday, the streak is 0.
  // Exception: if it's a weekly habit, the streak logic could be different,
  // but for simplicity we calculate consecutive days or weeks. Let's do daily-consecutive check.
  const hasCompletedToday = history[todayStr];
  const hasCompletedYesterday = history[yesterdayStr];

  if (!hasCompletedToday && !hasCompletedYesterday) {
    habit.streakCount = 0;
    return habit;
  }

  // Count backwards
  const currentCheck = hasCompletedToday ? today : yesterday;
  while (true) {
    const checkStr = currentCheck.toISOString().split('T')[0];
    if (checkStr && history[checkStr]) {
      streak++;
      currentCheck.setDate(currentCheck.getDate() - 1);
    } else {
      break;
    }
  }

  habit.streakCount = streak;
  return habit;
}
