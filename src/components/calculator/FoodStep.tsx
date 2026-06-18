'use client';

import React from 'react';
import { motion } from 'framer-motion';
import type { FoodData } from '@/types';

interface FoodStepProps {
  data: FoodData;
  onChange: (data: FoodData) => void;
}

const dietOptions: {
  value: FoodData['dietType'];
  emoji: string;
  label: string;
  description: string;
  dailyKg: string;
}[] = [
  { value: 'highMeat', emoji: '🥩', label: 'High Meat', description: 'Meat daily', dailyKg: '~7.2 kg' },
  { value: 'mediumMeat', emoji: '🍖', label: 'Medium Meat', description: '3-5 days/week', dailyKg: '~5.6 kg' },
  { value: 'lowMeat', emoji: '🍗', label: 'Low Meat', description: '1-2 days/week', dailyKg: '~4.7 kg' },
  { value: 'vegetarian', emoji: '🥬', label: 'Vegetarian', description: 'No meat', dailyKg: '~3.8 kg' },
  { value: 'vegan', emoji: '🌱', label: 'Vegan', description: 'Fully plant-based', dailyKg: '~2.9 kg' },
];

const wasteOptions: { value: FoodData['foodWasteFrequency']; label: string }[] = [
  { value: 'rarely', label: 'Rarely' },
  { value: 'sometimes', label: 'Sometimes' },
  { value: 'often', label: 'Often' },
];

export default function FoodStep({ data, onChange }: FoodStepProps) {
  const update = (partial: Partial<FoodData>) => {
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
          🍽️ Food & Diet
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Your diet is one of the biggest factors in your carbon footprint.
        </p>
      </div>

      {/* Diet Type Selector */}
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
          How would you describe your diet?
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
          {dietOptions.map((diet) => (
            <button
              key={diet.value}
              type="button"
              onClick={() => update({ dietType: diet.value })}
              aria-pressed={data.dietType === diet.value}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                data.dietType === diet.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md'
                  : 'border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-slate-800'
              }`}
            >
              <span className="text-3xl">{diet.emoji}</span>
              <span
                className={`text-sm font-semibold ${
                  data.dietType === diet.value
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-slate-700 dark:text-slate-300'
                }`}
              >
                {diet.label}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {diet.description}
              </span>
              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
                {diet.dailyKg} CO₂e/day
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Local Food Percentage */}
      <div>
        <label
          htmlFor="local-food-slider"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          How much of your food is locally sourced?
        </label>
        <div className="flex items-center gap-4">
          <input
            id="local-food-slider"
            type="range"
            min={0}
            max={100}
            step={10}
            value={data.localFoodPercentage}
            onChange={(e) => update({ localFoodPercentage: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.localFoodPercentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Local food percentage"
          />
          <span className="min-w-[4rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data.localFoodPercentage}%
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          🌍 Local food has lower transport emissions
        </p>
      </div>

      {/* Food Waste Frequency */}
      <div>
        <label
          htmlFor="food-waste-select"
          className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2"
        >
          How often do you waste food?
        </label>
        <div className="flex gap-3">
          {wasteOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update({ foodWasteFrequency: option.value })}
              aria-pressed={data.foodWasteFrequency === option.value}
              className={`flex-1 py-3 px-4 rounded-xl border-2 text-sm font-semibold transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                data.foodWasteFrequency === option.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-slate-800'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
