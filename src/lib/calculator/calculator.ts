/**
 * @module lib/calculator/calculator
 * @description Core carbon footprint calculation functions.
 *
 * All functions return **annual** emissions in kg CO₂e unless noted otherwise.
 * Each function documents the formula it uses.
 */

import type {
  AssessmentData,
  CategoryBreakdown,
  EnergyData,
  FoodData,
  FootprintResult,
  ShoppingData,
  TransportData,
  TravelData,
  WasteData,
} from '@/types/assessment';
import type { EmissionCategory } from '@/types/common';
import { DAYS_PER_YEAR, MONTHS_PER_YEAR } from '@/constants/benchmarks';
import {
  AVERAGE_DAILY_WASTE_KG,
  BUSINESS_CLASS_MULTIPLIER,
  DEFAULT_PUBLIC_TRANSPORT_FACTOR,
  DIET_EMISSION_FACTORS,
  ENERGY_EMISSION_FACTORS,
  FLIGHT_DISTANCE_KM,
  FLIGHT_EMISSION_FACTORS,
  FOOD_WASTE_FACTORS,
  LOCAL_FOOD_REDUCTION_FACTOR,
  PLASTIC_EMISSION_FACTORS,
  RECYCLING_DIVERSION_RATES,
  SHOPPING_EMISSION_FACTORS,
  VEHICLE_EMISSION_FACTORS,
  WASTE_EMISSION_FACTORS,
} from './emission-factors';
import { compareToAverage, compareToTarget } from './comparisons';

// ────────────────────────────────────────────────────────────────
// Individual category calculators
// ────────────────────────────────────────────────────────────────

/**
 * Calculate annual transport emissions.
 *
 * **Formula:**
 * - Car days per week  = 7 − publicTransportDaysPerWeek
 * - Car annual         = dailyDistanceKm × vehicleFactor × carDays/7 × 365
 * - Public transport   = dailyDistanceKm × busFactor × ptDays/7 × 365
 * - Flights            = flightsPerYear × avgDomesticDistance × domesticFlightFactor
 * - Total              = car + publicTransport + flights
 *
 * If vehicleType is 'none', car emissions are zero.
 *
 * @param data - Transport assessment inputs.
 * @returns Annual transport emissions in kg CO₂e.
 */
export function calculateTransportEmissions(data: TransportData): number {
  const vehicleFactor = VEHICLE_EMISSION_FACTORS[data.vehicleType] ?? 0;
  const ptDaysPerWeek = Math.min(Math.max(data.publicTransportDaysPerWeek, 0), 7);
  const carDaysPerWeek = 7 - ptDaysPerWeek;

  const carAnnual =
    data.dailyDistanceKm * vehicleFactor * (carDaysPerWeek / 7) * DAYS_PER_YEAR;

  const publicTransportAnnual =
    data.dailyDistanceKm *
    DEFAULT_PUBLIC_TRANSPORT_FACTOR *
    (ptDaysPerWeek / 7) *
    DAYS_PER_YEAR;

  // Domestic flights (short-haul average distance ~800 km round-trip = 1600 km)
  const flightAnnual =
    data.flightsPerYear * 800 * 2 * FLIGHT_EMISSION_FACTORS.domestic;

  return roundTo(carAnnual + publicTransportAnnual + flightAnnual, 2);
}

/**
 * Calculate annual household energy emissions.
 *
 * **Formula:**
 * - Grid share       = (100 − renewablePercentage) / 100
 * - Renewable share  = renewablePercentage / 100
 * - Electricity      = monthlyKwh × 12 × (gridShare × gridFactor + renewableShare × renewableFactor)
 * - Gas              = monthlyGasM3 × 12 × gasFactor (if usesGas)
 * - AC/Heating       = acHeatingHoursPerDay × 1.5 kW × gridFactor × 365
 * - Total            = electricity + gas + acHeating
 *
 * @param data - Energy assessment inputs.
 * @returns Annual energy emissions in kg CO₂e.
 */
export function calculateEnergyEmissions(data: EnergyData): number {
  const renewableShare = Math.min(Math.max(data.renewablePercentage, 0), 100) / 100;
  const gridShare = 1 - renewableShare;

  const electricityAnnual =
    data.monthlyElectricityKwh *
    MONTHS_PER_YEAR *
    (gridShare * ENERGY_EMISSION_FACTORS.gridElectricity +
      renewableShare * ENERGY_EMISSION_FACTORS.renewableElectricity);

  const gasAnnual = data.usesGas
    ? data.monthlyGasM3 * MONTHS_PER_YEAR * ENERGY_EMISSION_FACTORS.naturalGas
    : 0;

  // AC/Heating: assume average 1.5 kW draw
  const AC_AVERAGE_KW = 1.5;
  const acHeatingAnnual =
    data.acHeatingHoursPerDay *
    AC_AVERAGE_KW *
    ENERGY_EMISSION_FACTORS.gridElectricity *
    DAYS_PER_YEAR;

  return roundTo(electricityAnnual + gasAnnual + acHeatingAnnual, 2);
}

/**
 * Calculate annual food emissions.
 *
 * **Formula:**
 * - Base daily      = dietFactor (kg CO₂e/day)
 * - Local reduction = base × localFoodPercentage/100 × LOCAL_FOOD_REDUCTION_FACTOR
 * - Waste uplift    = base × wasteMultiplier
 * - Annual          = (base − localReduction + wasteUplift) × 365
 *
 * @param data - Food assessment inputs.
 * @returns Annual food emissions in kg CO₂e.
 */
export function calculateFoodEmissions(data: FoodData): number {
  const baseDaily = DIET_EMISSION_FACTORS[data.dietType] ?? DIET_EMISSION_FACTORS.mediumMeat;
  const localReduction =
    baseDaily * (data.localFoodPercentage / 100) * LOCAL_FOOD_REDUCTION_FACTOR;
  const wasteUplift =
    baseDaily * (FOOD_WASTE_FACTORS[data.foodWasteFrequency] ?? 0);

  const adjustedDaily = baseDaily - localReduction + wasteUplift;

  return roundTo(adjustedDaily * DAYS_PER_YEAR, 2);
}

/**
 * Calculate annual shopping / consumption emissions.
 *
 * **Formula:**
 * - Clothing annual  = clothingItemsPerMonth × 12 × (prefersSecondHand ? secondHandFactor : fastFashionFactor)
 * - Electronics      = electronicsPerYear × electronicsFactor
 * - Total            = clothing + electronics
 *
 * @param data - Shopping assessment inputs.
 * @returns Annual shopping emissions in kg CO₂e.
 */
export function calculateShoppingEmissions(data: ShoppingData): number {
  const clothingFactor = data.prefersSecondHand
    ? SHOPPING_EMISSION_FACTORS.secondHand
    : SHOPPING_EMISSION_FACTORS.fastFashion;

  const clothingAnnual =
    data.clothingItemsPerMonth * MONTHS_PER_YEAR * clothingFactor;

  const electronicsAnnual =
    data.electronicsPerYear * SHOPPING_EMISSION_FACTORS.electronics;

  return roundTo(clothingAnnual + electronicsAnnual, 2);
}

/**
 * Calculate annual waste emissions.
 *
 * **Formula:**
 * - Daily waste      = AVERAGE_DAILY_WASTE_KG
 * - Recycled share   = RECYCLING_DIVERSION_RATES[recyclingFrequency]
 * - Composted share  = composts ? 0.15 : 0
 * - Landfill share   = 1 − recycled − composted (min 0)
 * - Daily emission   = waste × (landfill × landfillFactor + recycled × recycledFactor + composted × compostFactor)
 * - Plastic          = PLASTIC_EMISSION_FACTORS[singleUsePlastic] per day
 * - Reusable bonus   = usesReusableItems ? −10% on plastic
 * - Annual           = (dailyEmission + plastic) × 365
 *
 * @param data - Waste assessment inputs.
 * @returns Annual waste emissions in kg CO₂e.
 */
export function calculateWasteEmissions(data: WasteData): number {
  const recycledShare = RECYCLING_DIVERSION_RATES[data.recyclingFrequency] ?? 0;
  const compostShare = data.composts ? 0.15 : 0;
  const landfillShare = Math.max(1 - recycledShare - compostShare, 0);

  const dailyWasteEmission =
    AVERAGE_DAILY_WASTE_KG *
    (landfillShare * WASTE_EMISSION_FACTORS.landfill +
      recycledShare * WASTE_EMISSION_FACTORS.recycled +
      compostShare * WASTE_EMISSION_FACTORS.composted);

  let dailyPlastic = PLASTIC_EMISSION_FACTORS[data.singleUsePlastic] ?? 0;
  if (data.usesReusableItems) {
    dailyPlastic *= 0.9; // 10% reduction for using reusable items
  }

  return roundTo((dailyWasteEmission + dailyPlastic) * DAYS_PER_YEAR, 2);
}

/**
 * Calculate annual air-travel emissions.
 *
 * **Formula:**
 * - One-way distance = FLIGHT_DISTANCE_KM[averageFlightDistance]
 * - Round-trip km     = distance × 2
 * - Emission factor   = short → domestic, medium/long → international
 * - Business uplift   = 1 + (businessTravelPercentage/100) × (BUSINESS_CLASS_MULTIPLIER − 1)
 * - Annual            = flightsPerYear × roundTripKm × factor × businessUplift
 *
 * @param data - Travel assessment inputs.
 * @returns Annual travel emissions in kg CO₂e.
 */
export function calculateTravelEmissions(data: TravelData): number {
  const distanceOneWay = FLIGHT_DISTANCE_KM[data.averageFlightDistance] ?? FLIGHT_DISTANCE_KM.medium;
  const roundTripKm = distanceOneWay * 2;

  const flightFactor =
    data.averageFlightDistance === 'short'
      ? FLIGHT_EMISSION_FACTORS.domestic
      : FLIGHT_EMISSION_FACTORS.international;

  // Business class takes more cabin space, increasing per-passenger emissions.
  const businessFraction = Math.min(Math.max(data.businessTravelPercentage, 0), 100) / 100;
  const businessUplift = 1 + businessFraction * (BUSINESS_CLASS_MULTIPLIER - 1);

  return roundTo(
    data.flightsPerYear * roundTripKm * flightFactor * businessUplift,
    2,
  );
}

// ────────────────────────────────────────────────────────────────
// Aggregate calculator
// ────────────────────────────────────────────────────────────────

/**
 * Calculate the complete carbon footprint from an assessment.
 *
 * Computes per-category emissions, totals, and comparisons to global
 * averages and the Paris-aligned sustainability target.
 *
 * @param assessment - A full assessment data object.
 * @returns A complete FootprintResult with daily/monthly/yearly totals and breakdowns.
 */
export function calculateTotalFootprint(
  assessment: AssessmentData,
): FootprintResult {
  const categoryEmissions: Record<EmissionCategory, number> = {
    transport: calculateTransportEmissions(assessment.transport),
    energy: calculateEnergyEmissions(assessment.energy),
    food: calculateFoodEmissions(assessment.food),
    shopping: calculateShoppingEmissions(assessment.shopping),
    waste: calculateWasteEmissions(assessment.waste),
    travel: calculateTravelEmissions(assessment.travel),
  };

  const totalYearly = roundTo(
    Object.values(categoryEmissions).reduce((sum, val) => sum + val, 0),
    2,
  );

  const totalMonthly = roundTo(totalYearly / MONTHS_PER_YEAR, 2);
  const totalDaily = roundTo(totalYearly / DAYS_PER_YEAR, 2);

  const categories: CategoryBreakdown[] = (
    Object.entries(categoryEmissions) as [EmissionCategory, number][]
  ).map(([category, emissions]) => ({
    category,
    emissions: roundTo(emissions, 2),
    percentage: totalYearly > 0 ? roundTo((emissions / totalYearly) * 100, 1) : 0,
    trend: 'stable' as const, // Trend requires historical data; default to stable.
  }));

  const avgComparison = compareToAverage(totalYearly);
  const targetComparison = compareToTarget(totalYearly);

  return {
    totalDaily,
    totalMonthly,
    totalYearly,
    categories,
    comparisonToAverage: avgComparison.percentage,
    comparisonToTarget: targetComparison.percentage,
  };
}

// ────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────

/**
 * Round a number to a given number of decimal places.
 *
 * @param value - The number to round.
 * @param decimals - Number of decimal places (default 2).
 * @returns The rounded number.
 */
function roundTo(value: number, decimals: number = 2): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}
