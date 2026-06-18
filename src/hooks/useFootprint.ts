'use client';

/** @module hooks/useFootprint - React hook that computes footprint results, recommendations, and equivalents. */

import { useState, useEffect } from 'react';
import type { Assessment, Recommendation, FootprintResult } from '@/types';
import { generateRecommendations } from '@/lib/recommendations/engine';
import { getEquivalents } from '@/lib/calculator/comparisons';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';

interface Equivalent {
  label: string;
  value: string;
  emoji: string;
}

interface UseFootprintReturn {
  result: FootprintResult | null;
  recommendations: Recommendation[];
  equivalents: Equivalent[];
  isLoading: boolean;
}

/**
 * Compute the carbon footprint breakdown, recommendations, and real-world equivalents for an assessment.
 * @param assessment - The assessment to analyze, or null to reset.
 * @returns Footprint result, ranked recommendations, tangible equivalents, and loading state.
 */
export function useFootprint(assessment: Assessment | null): UseFootprintReturn {
  const [result, setResult] = useState<FootprintResult | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [equivalents, setEquivalents] = useState<Equivalent[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!assessment) {
      setResult(null);
      setRecommendations([]);
      setEquivalents([]);
      return;
    }

    setIsLoading(true);
    try {
      const footprintResult = calculateTotalFootprint(assessment);
      const computedRecommendations = generateRecommendations(footprintResult);
      const rawEquivalents = getEquivalents(footprintResult.totalYearly);

      // Map to Equivalent structure
      const computedEquivalents: Equivalent[] = [
        {
          label: 'Flights from NYC to London',
          // Average flight emits ~986 kg CO2e
          value: (footprintResult.totalYearly / 986).toFixed(1),
          emoji: '✈️',
        },
        {
          label: 'Trees needed to offset',
          value: rawEquivalents.treesNeeded.toString(),
          emoji: '🌳',
        },
        {
          label: 'Commute by car (km)',
          value: rawEquivalents.carKm.toLocaleString(),
          emoji: '🚗',
        },
        {
          label: 'Days running a laptop',
          value: rawEquivalents.laptopDays.toLocaleString(),
          emoji: '💻',
        },
      ];

      setResult(footprintResult);
      setRecommendations(computedRecommendations);
      setEquivalents(computedEquivalents);
    } catch (error) {
      console.error('Failed to compute footprint:', error);
    } finally {
      setIsLoading(false);
    }
  }, [assessment]);

  return {
    result,
    recommendations,
    equivalents,
    isLoading,
  };
}
