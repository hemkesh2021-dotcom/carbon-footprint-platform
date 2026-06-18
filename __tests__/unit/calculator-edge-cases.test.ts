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

// ────────────────────────────────────────────────────────────────
// Transport edge cases
// ────────────────────────────────────────────────────────────────

describe('calculateTransportEmissions – edge cases', () => {
  it('vehicleType "none" produces zero car emissions (only PT + flights)', () => {
    const emissions = calculateTransportEmissions({
      vehicleType: 'none',
      dailyDistanceKm: 50,
      publicTransportDaysPerWeek: 0,
      flightsPerYear: 0,
    });

    // Vehicle factor for 'none' is 0, but PT still runs on non-PT days.
    // Car days = 7 - 0 = 7; car factor = 0 → car annual = 0
    // PT annual = 50 * 0.089 * (0/7) * 365 = 0
    // No flights → total = 0
    expect(emissions).toBe(0);
  });

  it('vehicleType "none" with public transport days still calculates PT emissions', () => {
    const emissions = calculateTransportEmissions({
      vehicleType: 'none',
      dailyDistanceKm: 20,
      publicTransportDaysPerWeek: 5,
      flightsPerYear: 0,
    });

    // Car annual = 0 (vehicle factor = 0)
    // PT annual = 20 * 0.089 * (5/7) * 365 > 0
    expect(emissions).toBeGreaterThan(0);
  });

  it('publicTransportDaysPerWeek is clamped to max 7', () => {
    const normal = calculateTransportEmissions({
      vehicleType: 'petrol',
      dailyDistanceKm: 20,
      publicTransportDaysPerWeek: 7,
      flightsPerYear: 0,
    });

    const over = calculateTransportEmissions({
      vehicleType: 'petrol',
      dailyDistanceKm: 20,
      publicTransportDaysPerWeek: 10,
      flightsPerYear: 0,
    });

    // Both should produce the same result because 10 is clamped to 7
    expect(over).toBe(normal);
  });

  it('zero daily distance with flights still produces flight emissions', () => {
    const emissions = calculateTransportEmissions({
      vehicleType: 'petrol',
      dailyDistanceKm: 0,
      publicTransportDaysPerWeek: 0,
      flightsPerYear: 2,
    });

    expect(emissions).toBeGreaterThan(0);
  });
});

// ────────────────────────────────────────────────────────────────
// Energy edge cases
// ────────────────────────────────────────────────────────────────

describe('calculateEnergyEmissions – edge cases', () => {
  it('100% renewable greatly reduces electricity emissions', () => {
    const gridOnly = calculateEnergyEmissions({
      monthlyElectricityKwh: 300,
      renewablePercentage: 0,
      usesGas: false,
      monthlyGasM3: 0,
      acHeatingHoursPerDay: 0,
    });

    const fullRenewable = calculateEnergyEmissions({
      monthlyElectricityKwh: 300,
      renewablePercentage: 100,
      usesGas: false,
      monthlyGasM3: 0,
      acHeatingHoursPerDay: 0,
    });

    expect(fullRenewable).toBeLessThan(gridOnly);
    // Renewable factor (0.02) vs grid (0.42) → ~21x reduction
    expect(fullRenewable).toBeLessThan(gridOnly * 0.1);
  });

  it('no gas usage yields zero gas emissions', () => {
    const withGas = calculateEnergyEmissions({
      monthlyElectricityKwh: 0,
      renewablePercentage: 0,
      usesGas: true,
      monthlyGasM3: 50,
      acHeatingHoursPerDay: 0,
    });

    const noGas = calculateEnergyEmissions({
      monthlyElectricityKwh: 0,
      renewablePercentage: 0,
      usesGas: false,
      monthlyGasM3: 50,
      acHeatingHoursPerDay: 0,
    });

    expect(noGas).toBe(0);
    expect(withGas).toBeGreaterThan(0);
  });

  it('AC/heating at 0 hours produces zero AC emissions', () => {
    const noAC = calculateEnergyEmissions({
      monthlyElectricityKwh: 0,
      renewablePercentage: 0,
      usesGas: false,
      monthlyGasM3: 0,
      acHeatingHoursPerDay: 0,
    });

    expect(noAC).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────────
// Food edge cases
// ────────────────────────────────────────────────────────────────

describe('calculateFoodEmissions – edge cases', () => {
  it('vegan diet produces significantly less emissions than highMeat', () => {
    const veganEmissions = calculateFoodEmissions({
      dietType: 'vegan',
      localFoodPercentage: 0,
      foodWasteFrequency: 'rarely',
    });

    const highMeatEmissions = calculateFoodEmissions({
      dietType: 'highMeat',
      localFoodPercentage: 0,
      foodWasteFrequency: 'rarely',
    });

    expect(veganEmissions).toBeLessThan(highMeatEmissions);
    // vegan (2.89) vs highMeat (7.19) → roughly 2.5x difference
    expect(highMeatEmissions / veganEmissions).toBeGreaterThan(2);
  });

  it('100% local food reduces emissions via LOCAL_FOOD_REDUCTION_FACTOR', () => {
    const noLocal = calculateFoodEmissions({
      dietType: 'mediumMeat',
      localFoodPercentage: 0,
      foodWasteFrequency: 'rarely',
    });

    const fullLocal = calculateFoodEmissions({
      dietType: 'mediumMeat',
      localFoodPercentage: 100,
      foodWasteFrequency: 'rarely',
    });

    expect(fullLocal).toBeLessThan(noLocal);
  });

  it('food waste "often" increases emissions compared to "rarely"', () => {
    const rarely = calculateFoodEmissions({
      dietType: 'mediumMeat',
      localFoodPercentage: 0,
      foodWasteFrequency: 'rarely',
    });

    const often = calculateFoodEmissions({
      dietType: 'mediumMeat',
      localFoodPercentage: 0,
      foodWasteFrequency: 'often',
    });

    expect(often).toBeGreaterThan(rarely);
  });
});

// ────────────────────────────────────────────────────────────────
// Shopping edge cases
// ────────────────────────────────────────────────────────────────

describe('calculateShoppingEmissions – edge cases', () => {
  it('second-hand preference reduces clothing emissions', () => {
    const newClothing = calculateShoppingEmissions({
      clothingItemsPerMonth: 5,
      electronicsPerYear: 0,
      prefersSecondHand: false,
    });

    const secondHand = calculateShoppingEmissions({
      clothingItemsPerMonth: 5,
      electronicsPerYear: 0,
      prefersSecondHand: true,
    });

    // fastFashion = 10 per item, secondHand = 1 per item → 10x difference
    expect(secondHand).toBeLessThan(newClothing);
    expect(newClothing / secondHand).toBeCloseTo(10, 0);
  });

  it('zero clothing and zero electronics gives zero emissions', () => {
    const emissions = calculateShoppingEmissions({
      clothingItemsPerMonth: 0,
      electronicsPerYear: 0,
      prefersSecondHand: false,
    });

    expect(emissions).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────────
// Waste edge cases
// ────────────────────────────────────────────────────────────────

describe('calculateWasteEmissions – edge cases', () => {
  it('always recycling + composting minimises waste emissions', () => {
    const bestCase = calculateWasteEmissions({
      recyclingFrequency: 'always',
      composts: true,
      singleUsePlastic: 'rarely',
      usesReusableItems: true,
    });

    const worstCase = calculateWasteEmissions({
      recyclingFrequency: 'never',
      composts: false,
      singleUsePlastic: 'often',
      usesReusableItems: false,
    });

    expect(bestCase).toBeLessThan(worstCase);
  });

  it('usesReusableItems reduces plastic emissions by 10%', () => {
    const withoutReusable = calculateWasteEmissions({
      recyclingFrequency: 'never',
      composts: false,
      singleUsePlastic: 'often',
      usesReusableItems: false,
    });

    const withReusable = calculateWasteEmissions({
      recyclingFrequency: 'never',
      composts: false,
      singleUsePlastic: 'often',
      usesReusableItems: true,
    });

    expect(withReusable).toBeLessThan(withoutReusable);
  });

  it('composting diverts 15% from landfill', () => {
    const noCompost = calculateWasteEmissions({
      recyclingFrequency: 'never',
      composts: false,
      singleUsePlastic: 'rarely',
      usesReusableItems: false,
    });

    const withCompost = calculateWasteEmissions({
      recyclingFrequency: 'never',
      composts: true,
      singleUsePlastic: 'rarely',
      usesReusableItems: false,
    });

    expect(withCompost).toBeLessThan(noCompost);
  });
});

// ────────────────────────────────────────────────────────────────
// Travel edge cases
// ────────────────────────────────────────────────────────────────

describe('calculateTravelEmissions – edge cases', () => {
  it('business class increases travel emissions', () => {
    const economy = calculateTravelEmissions({
      flightsPerYear: 4,
      averageFlightDistance: 'medium',
      businessTravelPercentage: 0,
    });

    const fullBusiness = calculateTravelEmissions({
      flightsPerYear: 4,
      averageFlightDistance: 'medium',
      businessTravelPercentage: 100,
    });

    // BUSINESS_CLASS_MULTIPLIER = 2.0 → full business = 2x economy
    expect(fullBusiness).toBeCloseTo(economy * 2, 1);
  });

  it('long flights produce more emissions than short flights', () => {
    const shortFlights = calculateTravelEmissions({
      flightsPerYear: 2,
      averageFlightDistance: 'short',
      businessTravelPercentage: 0,
    });

    const longFlights = calculateTravelEmissions({
      flightsPerYear: 2,
      averageFlightDistance: 'long',
      businessTravelPercentage: 0,
    });

    // long (7000 km × 0.195) vs short (800 km × 0.255)
    expect(longFlights).toBeGreaterThan(shortFlights);
  });

  it('zero flights produce zero travel emissions', () => {
    const emissions = calculateTravelEmissions({
      flightsPerYear: 0,
      averageFlightDistance: 'long',
      businessTravelPercentage: 100,
    });

    expect(emissions).toBe(0);
  });
});

// ────────────────────────────────────────────────────────────────
// Total footprint edge cases
// ────────────────────────────────────────────────────────────────

describe('calculateTotalFootprint – edge cases', () => {
  it('all-zero / minimal inputs produce minimal results', () => {
    const minimal: AssessmentData = {
      id: 'minimal',
      date: '2024-01-01',
      transport: {
        vehicleType: 'none',
        dailyDistanceKm: 0,
        publicTransportDaysPerWeek: 0,
        flightsPerYear: 0,
      },
      energy: {
        monthlyElectricityKwh: 0,
        renewablePercentage: 100,
        usesGas: false,
        monthlyGasM3: 0,
        acHeatingHoursPerDay: 0,
      },
      food: {
        dietType: 'vegan',
        localFoodPercentage: 100,
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
    };

    const result = calculateTotalFootprint(minimal);

    expect(result.totalYearly).toBeGreaterThanOrEqual(0);
    expect(result.categories).toHaveLength(6);

    // Transport and shopping and travel should be zero or near-zero
    const transport = result.categories.find((c) => c.category === 'transport');
    expect(transport!.emissions).toBe(0);

    const shopping = result.categories.find((c) => c.category === 'shopping');
    expect(shopping!.emissions).toBe(0);

    const travel = result.categories.find((c) => c.category === 'travel');
    expect(travel!.emissions).toBe(0);
  });

  it('category percentages sum to approximately 100 for non-zero total', () => {
    const assessment: AssessmentData = {
      id: 'pct-test',
      date: '2024-01-01',
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
        flightsPerYear: 2,
        averageFlightDistance: 'medium',
        businessTravelPercentage: 0,
      },
    };

    const result = calculateTotalFootprint(assessment);

    const totalPercentage = result.categories.reduce(
      (sum, cat) => sum + cat.percentage,
      0
    );

    // Allow small rounding differences
    expect(totalPercentage).toBeGreaterThan(99);
    expect(totalPercentage).toBeLessThanOrEqual(101);
  });

  it('monthly and daily totals are consistent with yearly total', () => {
    const assessment: AssessmentData = {
      id: 'consistency',
      date: '2024-01-01',
      transport: {
        vehicleType: 'petrol',
        dailyDistanceKm: 15,
        publicTransportDaysPerWeek: 3,
        flightsPerYear: 1,
      },
      energy: {
        monthlyElectricityKwh: 250,
        renewablePercentage: 20,
        usesGas: true,
        monthlyGasM3: 40,
        acHeatingHoursPerDay: 3,
      },
      food: {
        dietType: 'lowMeat',
        localFoodPercentage: 40,
        foodWasteFrequency: 'rarely',
      },
      shopping: {
        clothingItemsPerMonth: 2,
        electronicsPerYear: 1,
        prefersSecondHand: false,
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
    };

    const result = calculateTotalFootprint(assessment);

    expect(result.totalMonthly).toBeCloseTo(result.totalYearly / 12, 1);
    expect(result.totalDaily).toBeCloseTo(result.totalYearly / 365, 1);
  });
});
