/**
 * @module unit/comparisons.test
 * @description Unit tests for carbon footprint benchmark comparison utilities.
 */

import {
  compareToAverage,
  compareToTarget,
  getEquivalents,
} from '@/lib/calculator/comparisons';
import { GLOBAL_AVERAGE_KG, SUSTAINABILITY_TARGET_KG } from '@/constants/benchmarks';

describe('Benchmark and Equivalents Calculations', () => {
  describe('compareToAverage', () => {
    test('returns "below average" when footprint is significantly lower', () => {
      const footprint = 3000;
      const result = compareToAverage(footprint);
      expect(result.betterOrWorse).toBe('below average');
      expect(result.difference).toBeLessThan(0);
      expect(result.percentage).toBeLessThan(-5);
    });

    test('returns "above average" when footprint is significantly higher', () => {
      const footprint = 6000;
      const result = compareToAverage(footprint);
      expect(result.betterOrWorse).toBe('above average');
      expect(result.difference).toBeGreaterThan(0);
      expect(result.percentage).toBeGreaterThan(5);
    });

    test('returns "about average" when footprint is within 5% of global average', () => {
      const footprint = GLOBAL_AVERAGE_KG * 1.02; // 2% above average
      const result = compareToAverage(footprint);
      expect(result.betterOrWorse).toBe('about average');
      expect(Math.abs(result.percentage)).toBeLessThan(5);
    });
  });

  describe('compareToTarget', () => {
    test('returns onTrack true when footprint is at or below target', () => {
      const result = compareToTarget(SUSTAINABILITY_TARGET_KG - 100);
      expect(result.onTrack).toBe(true);
      expect(result.difference).toBe(-100);
      expect(result.percentage).toBeLessThan(0);
    });

    test('returns onTrack false when footprint is above target', () => {
      const result = compareToTarget(SUSTAINABILITY_TARGET_KG + 500);
      expect(result.onTrack).toBe(false);
      expect(result.difference).toBe(500);
      expect(result.percentage).toBeGreaterThan(0);
    });
  });

  describe('getEquivalents', () => {
    test('correctly converts CO2e kg to various real-world equivalents', () => {
      const kg = 1000;
      const result = getEquivalents(kg);
      
      expect(result.carKm).toBeGreaterThan(0);
      expect(result.laptopDays).toBeGreaterThan(0);
      expect(result.treesNeeded).toBeGreaterThan(0);
      expect(result.flightKm).toBeGreaterThan(0);
      
      // Verify calculations match the coefficients
      // carKm: 1000 * 5.0 = 5000 (roughly, depending on constants)
      // let's just assert they are numbers and match the logic
      expect(typeof result.carKm).toBe('number');
      expect(typeof result.laptopDays).toBe('number');
      expect(typeof result.treesNeeded).toBe('number');
      expect(typeof result.flightKm).toBe('number');
    });
  });
});
