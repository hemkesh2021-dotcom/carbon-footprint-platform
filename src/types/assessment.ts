/**
 * @module types/assessment
 * @description Types for carbon footprint assessment data, inputs, and results.
 */

import type { EmissionCategory, TrendDirection } from './common';

// ────────────────────────────────────────────────────────────────
// Input data types — one per assessment category
// ────────────────────────────────────────────────────────────────

/** Vehicle fuel / propulsion types. */
export type VehicleType = 'petrol' | 'diesel' | 'electric' | 'hybrid' | 'none';

/** Transport-related assessment inputs. */
export interface TransportData {
  /** Type of vehicle used for daily commute. */
  vehicleType: VehicleType;
  /** One-way daily commute distance in kilometres. */
  dailyDistanceKm: number;
  /** Number of days per week using public transport instead of a car. */
  publicTransportDaysPerWeek: number;
  /** Total number of domestic/short flights taken per year. */
  flightsPerYear: number;
}

/** Household energy assessment inputs. */
export interface EnergyData {
  /** Monthly electricity consumption in kilowatt-hours. */
  monthlyElectricityKwh: number;
  /** Percentage (0–100) of electricity sourced from renewables. */
  renewablePercentage: number;
  /** Whether the household uses natural gas. */
  usesGas: boolean;
  /** Monthly natural-gas consumption in cubic metres (m³). */
  monthlyGasM3: number;
  /** Average hours per day running air-conditioning or heating. */
  acHeatingHoursPerDay: number;
}

/** Diet type classification. */
export type DietType = 'vegan' | 'vegetarian' | 'lowMeat' | 'mediumMeat' | 'highMeat';

/** Food waste frequency self-assessment. */
export type WasteFrequency = 'rarely' | 'sometimes' | 'often';

/** Food-related assessment inputs. */
export interface FoodData {
  /** Self-reported diet classification. */
  dietType: DietType;
  /** Percentage (0–100) of food sourced locally. */
  localFoodPercentage: number;
  /** Self-reported food-waste frequency. */
  foodWasteFrequency: WasteFrequency;
}

/** Shopping / consumption assessment inputs. */
export interface ShoppingData {
  /** Average new clothing items purchased per month. */
  clothingItemsPerMonth: number;
  /** Average new electronics purchased per year. */
  electronicsPerYear: number;
  /** Whether the user prefers second-hand / refurbished goods. */
  prefersSecondHand: boolean;
}

/** Recycling frequency self-assessment. */
export type RecyclingFrequency = 'never' | 'sometimes' | 'usually' | 'always';

/** Single-use plastic frequency. */
export type PlasticUsage = 'rarely' | 'sometimes' | 'often';

/** Waste management assessment inputs. */
export interface WasteData {
  /** Self-reported recycling frequency. */
  recyclingFrequency: RecyclingFrequency;
  /** Whether the user composts food/garden waste. */
  composts: boolean;
  /** Self-reported frequency of single-use plastic consumption. */
  singleUsePlastic: PlasticUsage;
  /** Whether the user regularly uses reusable bags, bottles, etc. */
  usesReusableItems: boolean;
}

/** Flight distance classification. */
export type FlightDistance = 'short' | 'medium' | 'long';

/** Air-travel assessment inputs. */
export interface TravelData {
  /** Total flights taken per year (round-trips). */
  flightsPerYear: number;
  /** Typical flight distance category. */
  averageFlightDistance: FlightDistance;
  /** Percentage (0–100) of flights that are for business. */
  businessTravelPercentage: number;
}

// ────────────────────────────────────────────────────────────────
// Full assessment & result types
// ────────────────────────────────────────────────────────────────

/** A complete assessment submission. */
export interface AssessmentData {
  /** Unique assessment identifier. */
  id: string;
  /** ISO-8601 date string when the assessment was completed. */
  date: string;
  transport: TransportData;
  energy: EnergyData;
  food: FoodData;
  shopping: ShoppingData;
  waste: WasteData;
  travel: TravelData;
}

/** Breakdown of emissions for a single category. */
export interface CategoryBreakdown {
  /** The emission category. */
  category: EmissionCategory;
  /** Annual emissions in kg CO₂e. */
  emissions: number;
  /** Percentage of total footprint. */
  percentage: number;
  /** Trend compared to the previous assessment period. */
  trend: TrendDirection;
}

/** The computed result of a full carbon footprint assessment. */
export interface FootprintResult {
  /** Estimated daily emissions in kg CO₂e. */
  totalDaily: number;
  /** Estimated monthly emissions in kg CO₂e. */
  totalMonthly: number;
  /** Estimated annual emissions in kg CO₂e. */
  totalYearly: number;
  /** Per-category breakdown of annual emissions. */
  categories: CategoryBreakdown[];
  /** Percentage difference vs. global average (negative = better). */
  comparisonToAverage: number;
  /** Percentage difference vs. sustainability target (negative = better). */
  comparisonToTarget: number;
}
