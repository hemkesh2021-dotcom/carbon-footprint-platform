'use client';

/** @module TravelStep - Component or utility for TravelStep */


import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Plus, Minus, Info } from 'lucide-react';
import type { TravelData } from '@/types';

interface TravelStepProps {
  data: TravelData;
  onChange: (data: TravelData) => void;
}

const distanceOptions: {
  value: TravelData['averageFlightDistance'];
  label: string;
  description: string;
  emoji: string;
}[] = [
  { value: 'short', label: 'Short-haul', description: '< 3 hours', emoji: '🛫' },
  { value: 'medium', label: 'Medium-haul', description: '3-6 hours', emoji: '✈️' },
  { value: 'long', label: 'Long-haul', description: '> 6 hours', emoji: '🌍' },
];

export default function TravelStep({ data, onChange }: TravelStepProps) {
  const update = (partial: Partial<TravelData>) => {
    onChange({ ...data, ...partial });
  };

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
          ✈️ Travel
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Long-distance travel and holidays – how far do you fly?
        </p>
      </div>

      {/* Info Note */}
      <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
        <Info className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Don&apos;t worry about commute flights — those are counted in the transport section.
        </p>
      </div>

      {/* Flights Per Year */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Plane className="w-4 h-4 text-sky-500" />
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Holiday/leisure flights per year
          </p>
        </div>
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
          Round trips count as 2 flights
        </p>
      </div>

      {/* Average Flight Distance */}
      <div>
        <p className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          Average flight distance
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {distanceOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update({ averageFlightDistance: option.value })}
              aria-pressed={data.averageFlightDistance === option.value}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                data.averageFlightDistance === option.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-slate-800'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span
                className={`text-sm font-semibold ${
                  data.averageFlightDistance === option.value
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {option.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {option.description}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Business vs Personal Split */}
      <div>
        <label
          htmlFor="business-split-slider"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          Business vs Personal split
        </label>
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Personal</span>
          <input
            id="business-split-slider"
            type="range"
            min={0}
            max={100}
            step={10}
            value={data.businessTravelPercentage}
            onChange={(e) => update({ businessTravelPercentage: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.businessTravelPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Business travel percentage"
          />
          <span className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">Business</span>
        </div>
        <p className="text-center text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-2">
          {data.businessTravelPercentage}% Business / {100 - data.businessTravelPercentage}% Personal
        </p>
      </div>
    </motion.div>
  );
}
