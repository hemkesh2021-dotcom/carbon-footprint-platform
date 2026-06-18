/**
 * @module lib/calculator/comparisons
 * @description Functions for comparing a user's footprint against benchmarks
 * and converting emissions into tangible real-world equivalents.
 */

import {
  GLOBAL_AVERAGE_KG,
  SUSTAINABILITY_TARGET_KG,
} from '@/constants/benchmarks';
import { EQUIVALENTS } from './emission-factors';

// ────────────────────────────────────────────────────────────────
// Comparison functions
// ────────────────────────────────────────────────────────────────

/** Result of comparing a footprint to a benchmark. */
export interface BenchmarkComparison {
  /** Absolute difference in kg CO₂e (positive = above benchmark). */
  difference: number;
  /** Percentage difference (positive = above benchmark). */
  percentage: number;
  /** Human-readable label. */
  betterOrWorse: string;
}

/**
 * Compare an annual footprint against the global average.
 *
 * @param footprint - Annual emissions in kg CO₂e.
 * @returns Comparison result with difference, percentage, and label.
 *
 * @example
 * ```ts
 * compareToAverage(6000);
 * // → { difference: 1200, percentage: 25, betterOrWorse: 'above average' }
 * ```
 */
export function compareToAverage(footprint: number): BenchmarkComparison {
  const difference = roundTo(footprint - GLOBAL_AVERAGE_KG, 2);
  const percentage = roundTo((difference / GLOBAL_AVERAGE_KG) * 100, 1);

  let betterOrWorse: string;
  if (Math.abs(percentage) < 5) {
    betterOrWorse = 'about average';
  } else if (difference > 0) {
    betterOrWorse = 'above average';
  } else {
    betterOrWorse = 'below average';
  }

  return { difference, percentage, betterOrWorse };
}

/** Result of comparing a footprint to the sustainability target. */
export interface TargetComparison {
  /** Absolute difference in kg CO₂e (positive = above target). */
  difference: number;
  /** Percentage above/below the sustainability target. */
  percentage: number;
  /** Whether the user is on track (at or below target). */
  onTrack: boolean;
}

/**
 * Compare an annual footprint against the Paris-aligned sustainability target.
 *
 * @param footprint - Annual emissions in kg CO₂e.
 * @returns Comparison result with difference, percentage, and on-track flag.
 *
 * @example
 * ```ts
 * compareToTarget(1800);
 * // → { difference: -200, percentage: -10, onTrack: true }
 * ```
 */
export function compareToTarget(footprint: number): TargetComparison {
  const difference = roundTo(footprint - SUSTAINABILITY_TARGET_KG, 2);
  const percentage = roundTo((difference / SUSTAINABILITY_TARGET_KG) * 100, 1);

  return {
    difference,
    percentage,
    onTrack: footprint <= SUSTAINABILITY_TARGET_KG,
  };
}

// ────────────────────────────────────────────────────────────────
// Real-world equivalents
// ────────────────────────────────────────────────────────────────

/** Tangible equivalents for a given amount of CO₂e. */
export interface EmissionEquivalents {
  /** Kilometres driven in an average petrol car. */
  carKm: number;
  /** Days of running a laptop. */
  laptopDays: number;
  /** Trees needed to absorb this CO₂e in one year. */
  treesNeeded: number;
  /** Kilometres flown in an average flight. */
  flightKm: number;
}

/**
 * Convert a CO₂e value into tangible real-world equivalents.
 *
 * @param kgCO2e - The amount of CO₂e in kilograms.
 * @returns An object with car-km, laptop-days, trees needed, and flight-km equivalents.
 *
 * @example
 * ```ts
 * getEquivalents(1000);
 * // → { carKm: 4762, laptopDays: 47619, treesNeeded: 46, flightKm: 4444 }
 * ```
 */
export function getEquivalents(kgCO2e: number): EmissionEquivalents {
  return {
    carKm: Math.round(kgCO2e * EQUIVALENTS.carKmPerKgCO2e),
    laptopDays: Math.round(kgCO2e / EQUIVALENTS.laptopDayKgCO2e),
    treesNeeded: Math.ceil(kgCO2e / EQUIVALENTS.treeAbsorptionPerYear),
    flightKm: Math.round(kgCO2e * EQUIVALENTS.flightKmPerKgCO2e),
  };
}

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
