import * as habitService from '@/services/habit.service';
import { storage } from '@/services/storage';

describe('Habit Integration Flow', () => {
  beforeEach(() => {
    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  test('should support the full lifecycle of a habit (add, read, complete, delete)', async () => {
    // 1. Initial habits list should be empty
    let habits = await habitService.getHabits();
    expect(habits).toEqual([]);

    // 2. Add a new habit
    const newHabitData = {
      name: 'No Car Monday',
      category: 'transport' as const,
      icon: '🚌',
      frequency: 'weekly' as const,
      estimatedReduction: 10,
    };
    await habitService.addHabit(newHabitData);

    // 3. Read back habits list and verify addition
    habits = await habitService.getHabits();
    expect(habits.length).toBe(1);
    expect(habits[0]!.name).toBe('No Car Monday');
    expect(habits[0]!.streakCount).toBe(0);

    const habitId = habits[0]!.id;

    // 4. Mark the habit complete for today
    const todayStr = new Date().toISOString().split('T')[0]!;
    await habitService.markComplete(habitId, todayStr);

    // 5. Read back and verify completion and streak update
    habits = await habitService.getHabits();
    expect(habits[0]!.completionHistory[todayStr]).toBe(true);
    expect(habits[0]!.streakCount).toBe(1);

    // 5.1. Unmark the habit complete (toggle off)
    await habitService.markComplete(habitId, todayStr);
    habits = await habitService.getHabits();
    expect(habits[0]!.completionHistory[todayStr]).toBeUndefined();
    expect(habits[0]!.streakCount).toBe(0);

    // 5.2. Test getHabitTemplates
    const templates = await habitService.getHabitTemplates();
    expect(templates.length).toBeGreaterThan(0);
    expect(templates[0]).toHaveProperty('id');

    // 6. Delete the habit
    await habitService.removeHabit(habitId);

    // 7. Verify habits list is empty again
    habits = await habitService.getHabits();
    expect(habits).toEqual([]);
  });

  test('should handle edge cases in habit service', async () => {
    await expect(habitService.markComplete('non-existent-id')).resolves.not.toThrow();

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split('T')[0]!;

    const newHabitData = {
      name: 'Lights-off Routine',
      category: 'energy' as const,
      icon: '💡',
      frequency: 'daily' as const,
      estimatedReduction: 5,
    };
    await habitService.addHabit(newHabitData);
    let habits = await habitService.getHabits();
    const habitId = habits[0]!.id;

    await habitService.markComplete(habitId, yesterdayStr);
    habits = await habitService.getHabits();
    expect(habits[0]!.streakCount).toBe(1);
  });
});
