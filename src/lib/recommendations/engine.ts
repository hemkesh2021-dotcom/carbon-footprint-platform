import type { FootprintResult, Recommendation } from '@/types';
import { RECOMMENDATION_TEMPLATES } from './actions';

/**
 * Generate a list of personalized recommendations based on the user's footprint result.
 * 
 * Logic:
 * 1. Sort the categories in the footprint result by emissions (highest first).
 * 2. Collect templates belonging to categories with highest emissions.
 * 3. Filter out recommendations that correspond to already-adopted habits.
 * 4. Sort recommendations by impact-to-difficulty ratio:
 *    - estimatedReduction (higher is better)
 *    - difficulty (easy = 3, medium = 2, hard = 1 - higher is better)
 * 5. Return a list of recommendations, marking them as isAdopted if they are in the adopted list.
 */
export function generateRecommendations(
  result: FootprintResult,
  adoptedHabitIds: string[] = []
): Recommendation[] {
  // Sort categories by emissions in descending order
  const sortedCategories = [...result.categories].sort((a, b) => b.emissions - a.emissions);
  
  // Map category to its rank (0 is highest)
  const categoryRanks = new Map<string, number>();
  sortedCategories.forEach((cat, idx) => {
    categoryRanks.set(cat.category, idx);
  });

  const recommendations: Recommendation[] = RECOMMENDATION_TEMPLATES.map((template) => {
    const isAdopted = adoptedHabitIds.includes(template.id);
    return {
      ...template,
      isAdopted,
    };
  });

  // Score each recommendation to determine its priority
  // Priority score = (categoryPriorityWeight) * (reductionValue) / difficulty
  const scored = recommendations.map((rec) => {
    const categoryRank = categoryRanks.get(rec.category) ?? 5; // default lowest priority
    
    // Weight categories: highest gets 10x multiplier, lowest gets 1x
    const categoryWeight = Math.max(10 - categoryRank * 2, 1);
    
    // Difficulty weight: easy = 3, medium = 1.5, hard = 0.5
    let difficultyWeight = 1.5;
    if (rec.difficulty === 'easy') difficultyWeight = 3;
    if (rec.difficulty === 'hard') difficultyWeight = 0.5;

    const score = categoryWeight * rec.estimatedReduction * difficultyWeight;

    return { rec, score };
  });

  // Sort by score in descending order
  scored.sort((a, b) => b.score - a.score);

  // Return the sorted recommendations
  return scored.map((item) => item.rec);
}
