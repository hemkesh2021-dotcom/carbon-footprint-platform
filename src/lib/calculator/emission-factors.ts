/**
 * @module lib/calculator/emission-factors
 * @description All emission conversion factors expressed in kg CO₂e per unit.
 *
 * Sources:
 * - UK DEFRA GHG Conversion Factors (2023)
 * - US EPA Emission Factors Hub
 * - IPCC AR6 (2021)
 * - Our World in Data
 */

// ────────────────────────────────────────────────────────────────
// Transport — kg CO₂e per kilometre
// ────────────────────────────────────────────────────────────────

/** Per-kilometre emission factors for personal vehicles. */
export const VEHICLE_EMISSION_FACTORS: Readonly<Record<string, number>> = {
  petrol: 0.21,
  diesel: 0.17,
  electric: 0.05,
  hybrid: 0.12,
  none: 0,
} as const;

/** Per-passenger-km emission factors for public transport. */
export const PUBLIC_TRANSPORT_FACTORS = {
  /** Average bus emission per passenger-km. */
  bus: 0.089,
  /** Average rail/metro emission per passenger-km. */
  train: 0.041,
  /** Average motorcycle emission per km. */
  motorcycle: 0.113,
} as const;

/** Per-passenger-km emission factors for flights. */
export const FLIGHT_EMISSION_FACTORS = {
  /** Domestic / short-haul flight (< 1,500 km). */
  domestic: 0.255,
  /** International / long-haul flight (> 1,500 km). */
  international: 0.195,
} as const;

/**
 * Default public transport emission factor used when the
 * user indicates "public transport" generically (bus average).
 */
export const DEFAULT_PUBLIC_TRANSPORT_FACTOR = PUBLIC_TRANSPORT_FACTORS.bus;

// ────────────────────────────────────────────────────────────────
// Energy — kg CO₂e per unit
// ────────────────────────────────────────────────────────────────

/** Per-unit energy emission factors in kg CO₂e. */
export const ENERGY_EMISSION_FACTORS = {
  /** Grid electricity: kg CO₂e per kWh. */
  gridElectricity: 0.42,
  /** Renewable electricity: kg CO₂e per kWh (lifecycle). */
  renewableElectricity: 0.02,
  /** Natural gas: kg CO₂e per m³. */
  naturalGas: 2.0,
} as const;

// ────────────────────────────────────────────────────────────────
// Food — kg CO₂e per day per person
// ────────────────────────────────────────────────────────────────

/** Daily food emissions by diet type, in kg CO₂e/day. */
export const DIET_EMISSION_FACTORS: Readonly<Record<string, number>> = {
  highMeat: 7.19,
  mediumMeat: 5.63,
  lowMeat: 4.67,
  vegetarian: 3.81,
  vegan: 2.89,
} as const;

/**
 * Multiplier for local food sourcing.
 * Locally-sourced food reduces food-transport emissions (~5–10% of total).
 * At 100% local, emissions drop by ~8%.
 */
export const LOCAL_FOOD_REDUCTION_FACTOR = 0.08;

/**
 * Multiplier for food waste.
 * 'rarely' = +0%, 'sometimes' = +5%, 'often' = +15% additional emissions.
 */
export const FOOD_WASTE_FACTORS: Readonly<Record<string, number>> = {
  rarely: 0,
  sometimes: 0.05,
  often: 0.15,
} as const;

// ────────────────────────────────────────────────────────────────
// Shopping — kg CO₂e per item
// ────────────────────────────────────────────────────────────────

/** Per-item shopping emission factors in kg CO₂e. */
export const SHOPPING_EMISSION_FACTORS = {
  /** Fast-fashion clothing item. */
  fastFashion: 10,
  /** New electronics device (average). */
  electronics: 50,
  /** Second-hand / refurbished item (average). */
  secondHand: 1,
} as const;

// ────────────────────────────────────────────────────────────────
// Waste — kg CO₂e per kg of waste
// ────────────────────────────────────────────────────────────────

/** Per-kg waste emission factors in kg CO₂e. */
export const WASTE_EMISSION_FACTORS = {
  /** Waste sent to landfill: kg CO₂e per kg. */
  landfill: 0.58,
  /** Recycled waste: kg CO₂e per kg. */
  recycled: 0.02,
  /** Composted waste: kg CO₂e per kg. */
  composted: 0.01,
} as const;

/**
 * Average household waste production in kg per day.
 * Used as a baseline for waste emissions estimation.
 */
export const AVERAGE_DAILY_WASTE_KG = 1.2;

/**
 * Fraction of waste diverted from landfill based on recycling frequency.
 */
export const RECYCLING_DIVERSION_RATES: Readonly<Record<string, number>> = {
  never: 0,
  sometimes: 0.25,
  usually: 0.55,
  always: 0.8,
} as const;

/**
 * Single-use plastic emissions in kg CO₂e per day.
 * Based on average plastic consumption patterns.
 */
export const PLASTIC_EMISSION_FACTORS: Readonly<Record<string, number>> = {
  rarely: 0.02,
  sometimes: 0.08,
  often: 0.15,
} as const;

// ────────────────────────────────────────────────────────────────
// Travel — flight distance averages in km (one-way)
// ────────────────────────────────────────────────────────────────

/** Average one-way flight distances by category in kilometres. */
export const FLIGHT_DISTANCE_KM: Readonly<Record<string, number>> = {
  short: 800,
  medium: 2500,
  long: 7000,
} as const;

/**
 * Business-travel uplift factor.
 * Business class seats take more space → higher per-passenger emissions.
 * Typical multiplier is 2–3×; we use 2× average.
 */
export const BUSINESS_CLASS_MULTIPLIER = 2.0;

// ────────────────────────────────────────────────────────────────
// Equivalents — for comparison / visualisation
// ────────────────────────────────────────────────────────────────

/** Real-world equivalents for converting CO₂e into tangible comparisons. */
export const EQUIVALENTS = {
  /** kg CO₂e emitted per km driven in an average petrol car. */
  carKmPerKgCO2e: 1 / 0.21,
  /** kg CO₂e consumed by a laptop running for one day (~0.05 kWh × grid factor). */
  laptopDayKgCO2e: 0.021,
  /** kg CO₂e absorbed by one mature tree per year. */
  treeAbsorptionPerYear: 22,
  /** kg CO₂e emitted per flight-km (average of domestic & international). */
  flightKmPerKgCO2e: 1 / 0.225,
} as const;
