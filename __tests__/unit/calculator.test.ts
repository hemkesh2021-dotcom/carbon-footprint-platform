import {
  calculateTransportEmissions,
  calculateEnergyEmissions,
  calculateFoodEmissions,
  calculateShoppingEmissions,
  calculateWasteEmissions,
  calculateTravelEmissions,
  calculateTotalFootprint,
} from '@/lib/calculator/calculator';
import type { AssessmentData } from '@/types';

describe('Calculator Business Logic', () => {
  const sampleAssessment: AssessmentData = {
    id: 'test-id',
    date: new Date().toISOString(),
    transport: {
      vehicleType: 'petrol',
      dailyDistanceKm: 20,
      publicTransportDaysPerWeek: 2,
      flightsPerYear: 2,
    },
    energy: {
      monthlyElectricityKwh: 300,
      renewablePercentage: 0,
      usesGas: true,
      monthlyGasM3: 50,
      acHeatingHoursPerDay: 4,
    },
    food: {
      dietType: 'mediumMeat',
      localFoodPercentage: 30,
      foodWasteFrequency: 'sometimes',
    },
    shopping: {
      clothingItemsPerMonth: 3,
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
  };

  test('should calculate transport emissions correctly', () => {
    const emissions = calculateTransportEmissions(sampleAssessment.transport);
    expect(emissions).toBeGreaterThan(0);
    expect(typeof emissions).toBe('number');
  });

  test('should calculate energy emissions correctly', () => {
    const emissions = calculateEnergyEmissions(sampleAssessment.energy);
    expect(emissions).toBeGreaterThan(0);
    expect(typeof emissions).toBe('number');
  });

  test('should calculate food emissions correctly', () => {
    const emissions = calculateFoodEmissions(sampleAssessment.food);
    expect(emissions).toBeGreaterThan(0);
    expect(typeof emissions).toBe('number');
  });

  test('should calculate shopping emissions correctly', () => {
    const emissions = calculateShoppingEmissions(sampleAssessment.shopping);
    expect(emissions).toBeGreaterThan(0);
    expect(typeof emissions).toBe('number');
  });

  test('should calculate waste emissions correctly', () => {
    const emissions = calculateWasteEmissions(sampleAssessment.waste);
    expect(emissions).toBeGreaterThan(0);
    expect(typeof emissions).toBe('number');
  });

  test('should calculate travel emissions correctly', () => {
    const emissions = calculateTravelEmissions(sampleAssessment.travel);
    expect(emissions).toBeGreaterThan(0);
    expect(typeof emissions).toBe('number');
  });

  test('should aggregate all categories in total footprint calculation', () => {
    const result = calculateTotalFootprint(sampleAssessment);
    expect(result.totalYearly).toBeGreaterThan(0);
    expect(result.totalMonthly).toBeCloseTo(result.totalYearly / 12, 1);
    expect(result.totalDaily).toBeCloseTo(result.totalYearly / 365, 1);
    expect(result.categories.length).toBe(6);
    expect(result.comparisonToAverage).toBeDefined();
    expect(result.comparisonToTarget).toBeDefined();
  });
});
