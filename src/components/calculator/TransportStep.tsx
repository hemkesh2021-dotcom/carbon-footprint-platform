'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Fuel, Leaf, Ban, Plus, Minus } from 'lucide-react';
import type { TransportData } from '@/types';

interface TransportStepProps {
  data: TransportData;
  onChange: (data: TransportData) => void;
}

const vehicleTypes: {
  value: TransportData['vehicleType'];
  label: string;
  icon: React.ReactNode;
  description: string;
}[] = [
  { value: 'petrol', label: 'Petrol', icon: <Fuel className="w-6 h-6" />, description: 'Petrol/Gasoline car' },
  { value: 'diesel', label: 'Diesel', icon: <Fuel className="w-6 h-6" />, description: 'Diesel car' },
  { value: 'electric', label: 'Electric', icon: <Zap className="w-6 h-6" />, description: 'Fully electric' },
  { value: 'hybrid', label: 'Hybrid', icon: <Leaf className="w-6 h-6" />, description: 'Hybrid vehicle' },
  { value: 'none', label: 'None', icon: <Ban className="w-6 h-6" />, description: 'No personal vehicle' },
];

export default function TransportStep({ data, onChange }: TransportStepProps) {
  const update = (partial: Partial<TransportData>) => {
    onChange({ ...data, ...partial });
  };

  const estimatedSubtotal = React.useMemo(() => {
    let total = 0;
    const vehicleFactors: Record<TransportData['vehicleType'], number> = {
      petrol: 0.21,
      diesel: 0.17,
      electric: 0.05,
      hybrid: 0.12,
      none: 0,
    };
    total += data.dailyDistanceKm * vehicleFactors[data.vehicleType] * 365;
    total -= data.publicTransportDaysPerWeek * data.dailyDistanceKm * vehicleFactors[data.vehicleType] * 52;
    total += data.publicTransportDaysPerWeek * data.dailyDistanceKm * 0.04 * 52;
    total += data.flightsPerYear * 250;
    return Math.max(0, Math.round(total));
  }, [data]);

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          🚗 Transport
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Tell us about how you get around day to day.
        </p>
      </div>

      {/* Vehicle Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          What type of vehicle do you use?
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {vehicleTypes.map((vehicle) => (
            <button
              key={vehicle.value}
              type="button"
              onClick={() => update({ vehicleType: vehicle.value })}
              aria-pressed={data.vehicleType === vehicle.value}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                data.vehicleType === vehicle.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-slate-800'
              }`}
            >
              <div
                className={`p-2 rounded-lg ${
                  data.vehicleType === vehicle.value
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                {vehicle.icon}
              </div>
              <span
                className={`text-sm font-medium ${
                  data.vehicleType === vehicle.value
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {vehicle.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Daily Commute Distance */}
      <div>
        <label
          htmlFor="commute-slider"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          Daily commute distance
        </label>
        <div className="flex items-center gap-4">
          <input
            id="commute-slider"
            type="range"
            min={0}
            max={100}
            step={5}
            value={data.dailyDistanceKm}
            onChange={(e) => update({ dailyDistanceKm: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.dailyDistanceKm}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Daily commute distance in kilometers"
          />
          <span className="min-w-[4rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data.dailyDistanceKm} km
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Average commute in most cities is around 15-25 km
        </p>
      </div>

      {/* Public Transport Days */}
      <div>
        <label
          htmlFor="public-transport-slider"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          Public transport days per week
        </label>
        <div className="flex items-center gap-4">
          <input
            id="public-transport-slider"
            type="range"
            min={0}
            max={7}
            step={1}
            value={data.publicTransportDaysPerWeek}
            onChange={(e) => update({ publicTransportDaysPerWeek: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.publicTransportDaysPerWeek}
            aria-valuemin={0}
            aria-valuemax={7}
            aria-label="Public transport days per week"
          />
          <span className="min-w-[4rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data.publicTransportDaysPerWeek} days
          </span>
        </div>
      </div>

      {/* Flights Per Year */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
          Flights per year
        </label>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => update({ flightsPerYear: Math.max(0, data.flightsPerYear - 1) })}
            disabled={data.flightsPerYear <= 0}
            aria-label="Decrease flights per year"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <span
            className="min-w-[3rem] text-center text-2xl font-bold text-slate-900 dark:text-white"
            aria-live="polite"
          >
            {data.flightsPerYear}
          </span>
          <button
            type="button"
            onClick={() => update({ flightsPerYear: Math.min(50, data.flightsPerYear + 1) })}
            disabled={data.flightsPerYear >= 50}
            aria-label="Increase flights per year"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Include both personal and business flights
        </p>
      </div>

      {/* Running Subtotal */}
      <motion.div
        key={estimatedSubtotal}
        initial={{ scale: 0.95 }}
        animate={{ scale: 1 }}
        className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800"
      >
        <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
          Estimated transport emissions
        </p>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
          ~{estimatedSubtotal.toLocaleString()} kg CO₂e/year
        </p>
      </motion.div>
    </motion.div>
  );
}
