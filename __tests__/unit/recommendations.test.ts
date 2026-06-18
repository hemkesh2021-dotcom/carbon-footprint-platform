import { generateRecommendations } from '@/lib/recommendations/engine';
import type { FootprintResult } from '@/types';

describe('Recommendations Engine', () => {
  const mockResult: FootprintResult = {
    totalDaily: 10,
    totalMonthly: 300,
    totalYearly: 3600,
    categories: [
      { category: 'transport', emissions: 1500, percentage: 41.7, trend: 'stable' },
      { category: 'energy', emissions: 1200, percentage: 33.3, trend: 'stable' },
      { category: 'food', emissions: 500, percentage: 13.9, trend: 'stable' },
      { category: 'shopping', emissions: 200, percentage: 5.6, trend: 'stable' },
      { category: 'waste', emissions: 100, percentage: 2.8, trend: 'stable' },
      { category: 'travel', emissions: 100, percentage: 2.8, trend: 'stable' },
    ],
    comparisonToAverage: -10,
    comparisonToTarget: 80,
  };

  test('should generate recommendations sorted by priority score', () => {
    const recommendations = generateRecommendations(mockResult);
    expect(recommendations.length).toBeGreaterThan(0);
    
    // First recommendation should be transport or energy as they are the highest emitting categories
    const firstRec = recommendations[0];
    expect(firstRec).toBeDefined();
    expect(['transport', 'energy']).toContain(firstRec!.category);
  });

  test('should mark already adopted habits as isAdopted', () => {
    const recommendations = generateRecommendations(mockResult);
    const firstId = recommendations[0]!.id;

    const updatedRecommendations = generateRecommendations(mockResult, [firstId]);
    const updatedFirstRec = updatedRecommendations.find(r => r.id === firstId);
    expect(updatedFirstRec?.isAdopted).toBe(true);
  });
});
