/**
 * @module types/habit
 * @description Types for habit tracking and predefined habit templates.
 */

import type { EmissionCategory, Frequency } from './common';

/**
 * A user-tracked sustainable habit with streak and completion data.
 */
export interface Habit {
  /** Unique habit identifier. */
  id: string;
  /** Human-readable habit name. */
  name: string;
  /** The emission category this habit targets. */
  category: EmissionCategory;
  /** Emoji icon representing the habit. */
  icon: string;
  /** How often the habit should be performed. */
  frequency: Frequency;
  /** Current consecutive-completion streak count. */
  streakCount: number;
  /**
   * Completion history keyed by ISO date string (YYYY-MM-DD).
   * `true` = completed on that date.
   */
  completionHistory: Record<string, boolean>;
  /** Estimated monthly CO₂e reduction in kilograms. */
  estimatedReduction: number;
  /** ISO-8601 datetime when the habit was created. */
  createdAt: string;
  /** Whether the habit is currently active / being tracked. */
  isActive: boolean;
}

/**
 * A predefined habit template without user-specific data.
 * Used to create new Habit instances.
 */
export interface HabitTemplate {
  /** Template identifier (also used as the base for the habit id). */
  id: string;
  /** Human-readable habit name. */
  name: string;
  /** The emission category this habit targets. */
  category: EmissionCategory;
  /** Emoji icon representing the habit. */
  icon: string;
  /** How often the habit should be performed. */
  frequency: Frequency;
  /** Estimated monthly CO₂e reduction in kilograms. */
  estimatedReduction: number;
}
