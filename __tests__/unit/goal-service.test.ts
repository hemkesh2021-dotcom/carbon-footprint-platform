import { getGoals, addGoal, updateProgress, removeGoal } from '@/services/goal.service';
import { storage } from '@/services/storage';
import type { Goal } from '@/types';

// ────────────────────────────────────────────────────────────────
// goal service
// ────────────────────────────────────────────────────────────────

describe('goal service', () => {
  let uuidCounter: number;

  beforeEach(() => {
    localStorage.clear();
    uuidCounter = 0;

    // Mock crypto.randomUUID to produce deterministic IDs
    jest.spyOn(crypto, 'randomUUID').mockImplementation(() => {
      uuidCounter += 1;
      return `mock-uuid-${uuidCounter}` as ReturnType<typeof crypto.randomUUID>;
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const sampleGoalData: Omit<Goal, 'id'> = {
    title: 'Reduce transport emissions',
    targetReduction: 20,
    category: 'transport',
    deadline: '2025-12-31',
    baselineValue: 1000,
    currentValue: 0,
    createdAt: '2024-06-01T00:00:00Z',
    isCompleted: false,
  };

  // ── getGoals ────────────────────────────────────────────────

  describe('getGoals', () => {
    it('returns an empty array when no goals are stored', async () => {
      const goals = await getGoals();
      expect(goals).toEqual([]);
    });

    it('returns stored goals', async () => {
      const storedGoals: Goal[] = [{ ...sampleGoalData, id: 'existing-1' }];
      storage.set('goals', storedGoals);

      const goals = await getGoals();

      expect(goals).toHaveLength(1);
      expect(goals[0]!.id).toBe('existing-1');
      expect(goals[0]!.title).toBe('Reduce transport emissions');
    });
  });

  // ── addGoal ─────────────────────────────────────────────────

  describe('addGoal', () => {
    it('adds a new goal with an auto-generated ID', async () => {
      await addGoal(sampleGoalData);

      const goals = await getGoals();

      expect(goals).toHaveLength(1);
      expect(goals[0]!.id).toBe('mock-uuid-1');
      expect(goals[0]!.title).toBe('Reduce transport emissions');
    });

    it('appends to existing goals', async () => {
      await addGoal(sampleGoalData);
      await addGoal({ ...sampleGoalData, title: 'Reduce energy use' });

      const goals = await getGoals();

      expect(goals).toHaveLength(2);
      expect(goals[0]!.id).toBe('mock-uuid-1');
      expect(goals[1]!.id).toBe('mock-uuid-2');
    });

    it('preserves all goal data fields', async () => {
      await addGoal(sampleGoalData);

      const goals = await getGoals();
      const goal = goals[0]!;

      expect(goal.targetReduction).toBe(20);
      expect(goal.category).toBe('transport');
      expect(goal.deadline).toBe('2025-12-31');
      expect(goal.baselineValue).toBe(1000);
      expect(goal.currentValue).toBe(0);
      expect(goal.isCompleted).toBe(false);
    });
  });

  // ── updateProgress ──────────────────────────────────────────

  describe('updateProgress', () => {
    it('updates the currentValue of a goal', async () => {
      await addGoal(sampleGoalData);
      const goals = await getGoals();
      const goalId = goals[0]!.id;

      await updateProgress(goalId, 10);

      const updated = await getGoals();
      expect(updated[0]!.currentValue).toBe(10);
    });

    it('marks goal as completed when currentValue meets targetReduction', async () => {
      await addGoal(sampleGoalData);
      const goals = await getGoals();
      const goalId = goals[0]!.id;

      // targetReduction is 20, set currentValue to 20
      await updateProgress(goalId, 20);

      const updated = await getGoals();
      expect(updated[0]!.isCompleted).toBe(true);
    });

    it('marks goal as completed when currentValue exceeds targetReduction', async () => {
      await addGoal(sampleGoalData);
      const goals = await getGoals();
      const goalId = goals[0]!.id;

      await updateProgress(goalId, 25);

      const updated = await getGoals();
      expect(updated[0]!.isCompleted).toBe(true);
    });

    it('does not mark goal as completed when below target', async () => {
      await addGoal(sampleGoalData);
      const goals = await getGoals();
      const goalId = goals[0]!.id;

      await updateProgress(goalId, 10);

      const updated = await getGoals();
      expect(updated[0]!.isCompleted).toBe(false);
    });

    it('does nothing for a non-existent goal ID', async () => {
      await addGoal(sampleGoalData);

      // Should not throw
      await updateProgress('nonexistent-id', 50);

      const goals = await getGoals();
      expect(goals).toHaveLength(1);
      expect(goals[0]!.currentValue).toBe(0);
    });
  });

  // ── removeGoal ──────────────────────────────────────────────

  describe('removeGoal', () => {
    it('removes a specific goal by ID', async () => {
      await addGoal(sampleGoalData);
      await addGoal({ ...sampleGoalData, title: 'Second goal' });

      const before = await getGoals();
      expect(before).toHaveLength(2);

      await removeGoal(before[0]!.id);

      const after = await getGoals();
      expect(after).toHaveLength(1);
      expect(after[0]!.title).toBe('Second goal');
    });

    it('does nothing for a non-existent ID', async () => {
      await addGoal(sampleGoalData);

      await removeGoal('nonexistent-id');

      const goals = await getGoals();
      expect(goals).toHaveLength(1);
    });

    it('handles removing the last remaining goal', async () => {
      await addGoal(sampleGoalData);
      const goals = await getGoals();

      await removeGoal(goals[0]!.id);

      const after = await getGoals();
      expect(after).toEqual([]);
    });
  });
});
