'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Flame, Snowflake, Sun } from 'lucide-react';
import type { EnergyData } from '@/types';

interface EnergyStepProps {
  data: EnergyData;
  onChange: (data: EnergyData) => void;
}

export default function EnergyStep({ data, onChange }: EnergyStepProps) {
  const update = (partial: Partial<EnergyData>) => {
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
          ⚡ Home Energy
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Tell us about your household energy consumption.
        </p>
      </div>

      {/* Monthly Electricity */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <label
            htmlFor="electricity-slider"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Monthly electricity usage
          </label>
        </div>
        <div className="flex items-center gap-4">
          <input
            id="electricity-slider"
            type="range"
            min={0}
            max={1000}
            step={50}
            value={data.monthlyElectricityKwh}
            onChange={(e) => update({ monthlyElectricityKwh: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.monthlyElectricityKwh}
            aria-valuemin={0}
            aria-valuemax={1000}
            aria-label="Monthly electricity usage in kilowatt hours"
          />
          <span className="min-w-[5rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data.monthlyElectricityKwh} kWh
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          💡 Average household uses ~300 kWh/month
        </p>
      </div>

      {/* Renewable Energy Percentage */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Sun className="w-4 h-4 text-yellow-500" />
          <label
            htmlFor="renewable-slider"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Renewable energy percentage
          </label>
        </div>
        <div className="flex items-center gap-4">
          <input
            id="renewable-slider"
            type="range"
            min={0}
            max={100}
            step={10}
            value={data.renewablePercentage}
            onChange={(e) => update({ renewablePercentage: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.renewablePercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Renewable energy percentage"
          />
          <span className="min-w-[4rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data.renewablePercentage}%
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          🌱 Solar panels or green energy tariff? Count it here
        </p>
      </div>

      {/* Gas Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 text-orange-500" />
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Do you use natural gas?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              For heating, cooking, or hot water
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.usesGas}
          onClick={() => update({ usesGas: !data.usesGas })}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            data.usesGas ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
              data.usesGas ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Monthly Gas Usage - conditional */}
      {data.usesGas && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <label
            htmlFor="gas-slider"
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
          >
            Monthly gas usage
          </label>
          <div className="flex items-center gap-4">
            <input
              id="gas-slider"
              type="range"
              min={0}
              max={200}
              step={10}
              value={data.monthlyGasM3}
              onChange={(e) => update({ monthlyGasM3: Number(e.target.value) })}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
              aria-valuenow={data.monthlyGasM3}
              aria-valuemin={0}
              aria-valuemax={200}
              aria-label="Monthly gas usage in cubic meters"
            />
            <span className="min-w-[4rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
              {data.monthlyGasM3} m³
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Check your gas bill for exact figures
          </p>
        </motion.div>
      )}

      {/* AC/Heating Hours */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Snowflake className="w-4 h-4 text-blue-500" />
          <label
            htmlFor="ac-slider"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            AC / Heating hours per day
          </label>
        </div>
        <div className="flex items-center gap-4">
          <input
            id="ac-slider"
            type="range"
            min={0}
            max={24}
            step={1}
            value={data.acHeatingHoursPerDay}
            onChange={(e) => update({ acHeatingHoursPerDay: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.acHeatingHoursPerDay}
            aria-valuemin={0}
            aria-valuemax={24}
            aria-label="Air conditioning or heating hours per day"
          />
          <span className="min-w-[4rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data.acHeatingHoursPerDay} hrs
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          ❄️ Include both air conditioning and heating time
        </p>
      </div>
    </motion.div>
  );
}
