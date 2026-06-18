import * as assessmentService from '@/services/assessment.service';
import { storage } from '@/services/storage';
import type { AssessmentData } from '@/types';

describe('Assessment Integration Flow', () => {
  beforeEach(() => {
    storage.clear();
  });

  afterEach(() => {
    storage.clear();
  });

  const sampleAssessment: Omit<AssessmentData, 'id' | 'date'> = {
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

  test('should support assessment creation, retrieval, and deletion', async () => {
    // 1. Initial assessments history should be empty
    let history = await assessmentService.getAssessmentHistory();
    expect(history).toEqual([]);

    // 2. Save a new assessment
    await assessmentService.saveAssessment(sampleAssessment);

    // 3. Retrieve and verify history and latest
    history = await assessmentService.getAssessmentHistory();
    expect(history.length).toBe(1);
    expect(history[0]!.transport.vehicleType).toBe('petrol');

    const latest = await assessmentService.getLatestAssessment();
    expect(latest).not.toBeNull();
    expect(latest!.id).toBe(history[0]!.id);

    // 4. Delete the assessment
    await assessmentService.deleteAssessment(latest!.id);

    // 5. Verify empty history
    history = await assessmentService.getAssessmentHistory();
    expect(history).toEqual([]);
  });
});
