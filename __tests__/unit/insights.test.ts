import { generateInsights, generateMonthlySummary } from '@/lib/insights/generator';
import type { AssessmentData, FootprintResult, CategoryBreakdown } from '@/types';

// ────────────────────────────────────────────────────────────────
// Test helpers
// ────────────────────────────────────────────────────────────────

/**
 * Build a minimal but valid AssessmentData, with overrides for specific
 * categories so the calculator produces predictable totals.
 */
function makeAssessment(overrides: Partial<AssessmentData> = {}): AssessmentData {
  return {
    id: 'test-1',
    date: '2024-06-01',
    transport: {
      vehicleType: 'petrol',
      dailyDistanceKm: 20,
      publicTransportDaysPerWeek: 2,
      flightsPerYear: 0,
    },
    energy: {
      monthlyElectricityKwh: 200,
      renewablePercentage: 0,
      usesGas: true,
      monthlyGasM3: 30,
      acHeatingHoursPerDay: 2,
    },
    food: {
      dietType: 'mediumMeat',
      localFoodPercentage: 20,
      foodWasteFrequency: 'sometimes',
    },
    shopping: {
      clothingItemsPerMonth: 2,
      electronicsPerYear: 1,
      prefersSecondHand: false,
    },
    waste: {
      recyclingFrequency: 'sometimes',
      composts: false,
      singleUsePlastic: 'sometimes',
      usesReusableItems: false,
    },
    travel: {
      flightsPerYear: 1,
      averageFlightDistance: 'medium',
      businessTravelPercentage: 0,
    },
    ...overrides,
  };
}

/** Create a low-footprint assessment that lands under the 2000 kg target. */
function makeLowFootprintAssessment(overrides: Partial<AssessmentData> = {}): AssessmentData {
  return makeAssessment({
    id: 'low-fp',
    transport: {
      vehicleType: 'none',
      dailyDistanceKm: 5,
      publicTransportDaysPerWeek: 5,
      flightsPerYear: 0,
    },
    energy: {
      monthlyElectricityKwh: 50,
      renewablePercentage: 90,
      usesGas: false,
      monthlyGasM3: 0,
      acHeatingHoursPerDay: 0,
    },
    food: {
      dietType: 'vegan',
      localFoodPercentage: 80,
      foodWasteFrequency: 'rarely',
    },
    shopping: {
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSecondHand: true,
    },
    waste: {
      recyclingFrequency: 'always',
      composts: true,
      singleUsePlastic: 'rarely',
      usesReusableItems: true,
    },
    travel: {
      flightsPerYear: 0,
      averageFlightDistance: 'short',
      businessTravelPercentage: 0,
    },
    ...overrides,
  });
}

/** Create a moderate assessment that should land between 2000 and 4800 kg. */
function makeModerateLowAssessment(overrides: Partial<AssessmentData> = {}): AssessmentData {
  return makeAssessment({
    id: 'mod-low',
    transport: {
      vehicleType: 'electric',
      dailyDistanceKm: 10,
      publicTransportDaysPerWeek: 3,
      flightsPerYear: 0,
    },
    energy: {
      monthlyElectricityKwh: 100,
      renewablePercentage: 50,
      usesGas: false,
      monthlyGasM3: 0,
      acHeatingHoursPerDay: 1,
    },
    food: {
      dietType: 'vegetarian',
      localFoodPercentage: 50,
      foodWasteFrequency: 'rarely',
    },
    shopping: {
      clothingItemsPerMonth: 1,
      electronicsPerYear: 0,
      prefersSecondHand: true,
    },
    waste: {
      recyclingFrequency: 'always',
      composts: true,
      singleUsePlastic: 'rarely',
      usesReusableItems: true,
    },
    travel: {
      flightsPerYear: 1,
      averageFlightDistance: 'short',
      businessTravelPercentage: 0,
    },
    ...overrides,
  });
}

/** Build a mock FootprintResult for generateMonthlySummary tests. */
function makeFootprintResult(overrides: Partial<FootprintResult> = {}): FootprintResult {
  const defaultCategories: CategoryBreakdown[] = [
    { category: 'transport', emissions: 1200, percentage: 25, trend: 'stable' },
    { category: 'energy', emissions: 1000, percentage: 21, trend: 'stable' },
    { category: 'food', emissions: 1100, percentage: 23, trend: 'stable' },
    { category: 'shopping', emissions: 500, percentage: 10, trend: 'stable' },
    { category: 'waste', emissions: 300, percentage: 6, trend: 'stable' },
    { category: 'travel', emissions: 700, percentage: 15, trend: 'stable' },
  ];

  return {
    totalDaily: 13.15,
    totalMonthly: 400,
    totalYearly: 4800,
    categories: defaultCategories,
    comparisonToAverage: 0,
    comparisonToTarget: 140,
    ...overrides,
  };
}

// ────────────────────────────────────────────────────────────────
// generateInsights
// ────────────────────────────────────────────────────────────────

describe('generateInsights', () => {
  it('returns a suggestion when assessments array is empty', () => {
    const insights = generateInsights([]);

    expect(insights).toHaveLength(1);
    expect(insights[0]!.type).toBe('suggestion');
    expect(insights[0]!.message).toContain('first footprint assessment');
  });

  it('returns an achievement and a suggestion for single assessment', () => {
    const assessment = makeAssessment();
    const insights = generateInsights([assessment]);

    // First insight should be the "first assessment" achievement
    expect(insights.length).toBeGreaterThanOrEqual(2);
    expect(insights[0]!.type).toBe('achievement');
    expect(insights[0]!.message).toContain('first footprint assessment');

    // Second insight should be a suggestion about the highest category
    expect(insights[1]!.type).toBe('suggestion');
    expect(insights[1]!.message).toContain('highest emission source');
    expect(insights[1]!.category).toBeDefined();
  });

  it('returns improvement insight when footprint decreased', () => {
    const first = makeAssessment({ id: 'a1', date: '2024-01-01' });
    // Lower emissions for the second assessment
    const second = makeAssessment({
      id: 'a2',
      date: '2024-06-01',
      transport: {
        vehicleType: 'electric',
        dailyDistanceKm: 10,
        publicTransportDaysPerWeek: 5,
        flightsPerYear: 0,
      },
      energy: {
        monthlyElectricityKwh: 100,
        renewablePercentage: 80,
        usesGas: false,
        monthlyGasM3: 0,
        acHeatingHoursPerDay: 1,
      },
      travel: {
        flightsPerYear: 0,
        averageFlightDistance: 'short',
        businessTravelPercentage: 0,
      },
    });

    const insights = generateInsights([first, second]);

    const improvement = insights.find((i) => i.type === 'improvement');
    expect(improvement).toBeDefined();
    expect(improvement!.message).toContain('decreased');
  });

  it('returns suggestion insight when footprint increased', () => {
    const first = makeAssessment({ id: 'a1', date: '2024-01-01' });
    // Higher emissions for the second assessment
    const second = makeAssessment({
      id: 'a2',
      date: '2024-06-01',
      transport: {
        vehicleType: 'petrol',
        dailyDistanceKm: 60,
        publicTransportDaysPerWeek: 0,
        flightsPerYear: 5,
      },
      energy: {
        monthlyElectricityKwh: 600,
        renewablePercentage: 0,
        usesGas: true,
        monthlyGasM3: 100,
        acHeatingHoursPerDay: 8,
      },
      travel: {
        flightsPerYear: 5,
        averageFlightDistance: 'long',
        businessTravelPercentage: 50,
      },
    });

    const insights = generateInsights([first, second]);

    const suggestion = insights.find(
      (i) => i.type === 'suggestion' && i.message.includes('increased')
    );
    expect(suggestion).toBeDefined();
  });

  it('returns achievement insight when footprint is stable', () => {
    const first = makeAssessment({ id: 'a1', date: '2024-01-01' });
    // Nearly identical assessment
    const second = makeAssessment({ id: 'a2', date: '2024-06-01' });

    const insights = generateInsights([first, second]);

    const achievement = insights.find(
      (i) => i.type === 'achievement' && i.message.includes('stable')
    );
    expect(achievement).toBeDefined();
  });

  it('returns Paris target achievement when footprint is under 2000 kg', () => {
    const low1 = makeLowFootprintAssessment({ id: 'l1', date: '2024-01-01' });
    const low2 = makeLowFootprintAssessment({ id: 'l2', date: '2024-06-01' });

    const insights = generateInsights([low1, low2]);

    const parisAchievement = insights.find(
      (i) => i.type === 'achievement' && i.message.includes('2,000')
    );
    expect(parisAchievement).toBeDefined();
  });

  it('returns below-average achievement when footprint is under 4800 kg but above 2000', () => {
    const mod1 = makeModerateLowAssessment({ id: 'm1', date: '2024-01-01' });
    const mod2 = makeModerateLowAssessment({ id: 'm2', date: '2024-06-01' });

    const insights = generateInsights([mod1, mod2]);

    const belowAvg = insights.find(
      (i) => i.type === 'achievement' && i.message.includes('below the global average')
    );
    expect(belowAvg).toBeDefined();
  });
});

// ────────────────────────────────────────────────────────────────
// generateMonthlySummary
// ────────────────────────────────────────────────────────────────

describe('generateMonthlySummary', () => {
  it('returns a summary with comparison when there is no previous result', () => {
    const current = makeFootprintResult();
    const summary = generateMonthlySummary(current, null);

    expect(summary).toContain('estimated carbon footprint');
    expect(summary).toContain('largest source');
  });

  it('mentions the highest category when there is no previous result', () => {
    const current = makeFootprintResult({
      categories: [
        { category: 'transport', emissions: 3000, percentage: 60, trend: 'stable' },
        { category: 'energy', emissions: 1000, percentage: 20, trend: 'stable' },
        { category: 'food', emissions: 500, percentage: 10, trend: 'stable' },
        { category: 'shopping', emissions: 200, percentage: 4, trend: 'stable' },
        { category: 'waste', emissions: 100, percentage: 2, trend: 'stable' },
        { category: 'travel', emissions: 200, percentage: 4, trend: 'stable' },
      ],
    });

    const summary = generateMonthlySummary(current, null);
    expect(summary).toContain('transport');
  });

  it('returns a savings summary when footprint decreased', () => {
    const previous = makeFootprintResult({ totalYearly: 5000 });
    const current = makeFootprintResult({ totalYearly: 4000 });

    const summary = generateMonthlySummary(current, previous);

    expect(summary).toContain('saved');
    expect(summary).toContain('1000');
  });

  it('returns an increase summary when footprint went up', () => {
    const previous = makeFootprintResult({ totalYearly: 4000 });
    const current = makeFootprintResult({ totalYearly: 5000 });

    const summary = generateMonthlySummary(current, previous);

    expect(summary).toContain('up by');
    expect(summary).toContain('1000');
  });

  it('returns a stable message when footprint is the same', () => {
    const previous = makeFootprintResult({ totalYearly: 4800 });
    const current = makeFootprintResult({ totalYearly: 4800 });

    const summary = generateMonthlySummary(current, previous);

    expect(summary).toContain('identical');
  });
});
