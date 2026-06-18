/**
 * @module types/common
 * @description Common shared types used across the Carbon Footprint Awareness Platform.
 */

/**
 * Emission categories tracked by the platform.
 * Each category represents a major area of personal carbon emissions.
 */
export type EmissionCategory =
  | 'transport'
  | 'energy'
  | 'food'
  | 'shopping'
  | 'waste'
  | 'travel';

/** All valid emission categories as a readonly array for runtime iteration. */
export const EMISSION_CATEGORIES: readonly EmissionCategory[] = [
  'transport',
  'energy',
  'food',
  'shopping',
  'waste',
  'travel',
] as const;

/**
 * Time frame for viewing and aggregating emission data.
 */
export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

/**
 * Direction of a trend compared to a previous period.
 */
export type TrendDirection = 'up' | 'down' | 'stable';

/**
 * Difficulty level for recommendations and habit adoption.
 */
export type Difficulty = 'easy' | 'medium' | 'hard';

/**
 * Frequency at which a habit should be performed.
 */
export type Frequency = 'daily' | 'weekly';
