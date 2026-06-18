/**
 * @module constants/benchmarks
 * @description Global and national carbon footprint benchmarks and targets.
 *
 * Sources:
 * - Global average: Our World in Data (2022) — ~4.8 tonnes CO₂ per capita
 * - National averages: World Bank / IEA data (2022)
 * - Paris-aligned target: IPCC SR15 — ~2 tonnes CO₂e per capita by 2030
 */

import type { EmissionCategory } from '@/types/common';

// ────────────────────────────────────────────────────────────────
// Global benchmarks (kg CO₂e per year)
// ────────────────────────────────────────────────────────────────

/** Global average annual carbon footprint in kg CO₂e per person. */
export const GLOBAL_AVERAGE_KG = 4800;

/** Paris Agreement–aligned annual sustainability target in kg CO₂e. */
export const SUSTAINABILITY_TARGET_KG = 2000;

// ────────────────────────────────────────────────────────────────
// National averages (kg CO₂e per year)
// ────────────────────────────────────────────────────────────────

/** Country codes mapped to annual per-capita emissions in kg CO₂e. */
export const NATIONAL_AVERAGES_KG: Readonly<Record<string, number>> = {
  US: 16000,
  CA: 14200,
  AU: 15000,
  GB: 5500,
  DE: 7900,
  FR: 4600,
  EU: 6800,
  CN: 7400,
  IN: 1900,
  BR: 2200,
  JP: 8700,
  KR: 11600,
  WORLD: 4800,
} as const;

// ────────────────────────────────────────────────────────────────
// Category average splits
// ────────────────────────────────────────────────────────────────

/**
 * Typical percentage contribution of each emission category
 * for an average global citizen.
 * Values sum to 100.
 */
export const CATEGORY_AVERAGE_PERCENTAGES: Readonly<
  Record<EmissionCategory, number>
> = {
  transport: 27,
  energy: 25,
  food: 23,
  shopping: 10,
  waste: 5,
  travel: 10,
} as const;

// ────────────────────────────────────────────────────────────────
// Helpful conversion constants
// ────────────────────────────────────────────────────────────────

/** Number of days in a standard year (non-leap). */
export const DAYS_PER_YEAR = 365;

/** Average number of days per month (365 / 12). */
export const DAYS_PER_MONTH = 30.417;

/** Number of months per year. */
export const MONTHS_PER_YEAR = 12;

/** Number of weeks per year. */
export const WEEKS_PER_YEAR = 52;
