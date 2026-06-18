/**
 * @module types/goal
 * @description Types for carbon-reduction goal tracking.
 */

import type { EmissionCategory } from './common';

/**
 * A user-defined carbon-reduction goal.
 */
export interface Goal {
  /** Unique goal identifier. */
  id: string;
  /** Human-readable goal title. */
  title: string;
  /** Target reduction as a percentage (0–100) of the baseline value. */
  targetReduction: number;
  /** Optional specific emission category to target. */
  category?: EmissionCategory;
  /** ISO-8601 date string for the goal deadline. */
  deadline: string;
  /** Baseline annual emissions value in kg CO₂e when the goal was set. */
  baselineValue: number;
  /** Current annual emissions value in kg CO₂e. */
  currentValue: number;
  /** ISO-8601 datetime when the goal was created. */
  createdAt: string;
  /** Whether the goal has been completed (target reached). */
  isCompleted: boolean;
}
