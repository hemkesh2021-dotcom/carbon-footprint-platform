/**
 * @module types/recommendation
 * @description Types for personalised carbon-reduction recommendations.
 */

import type { Difficulty, EmissionCategory } from './common';

/** Time required to adopt a recommended action. */
export type TimeToAdopt = 'immediate' | 'oneWeek' | 'oneMonth';

/** Financial impact of adopting a recommendation. */
export type CostImpact = 'savesMoney' | 'noCost' | 'smallCost';

/**
 * A single actionable recommendation to reduce the user's carbon footprint.
 */
export interface Recommendation {
  /** Unique recommendation identifier. */
  id: string;
  /** The emission category this recommendation targets. */
  category: EmissionCategory;
  /** Short, human-readable title. */
  title: string;
  /** Detailed description of the recommended action. */
  description: string;
  /** Estimated monthly CO₂e reduction in kilograms. */
  estimatedReduction: number;
  /** How difficult the action is to adopt. */
  difficulty: Difficulty;
  /** Approximate time needed to fully adopt the action. */
  timeToAdopt: TimeToAdopt;
  /** Financial impact of adopting this recommendation. */
  costImpact: CostImpact;
  /** Explanation of why this action matters for the planet. */
  whyItMatters: string;
  /** Whether the user has already adopted this action. */
  isAdopted: boolean;
}
