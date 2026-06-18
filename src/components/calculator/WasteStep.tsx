'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Recycle, Leaf, Package, ShoppingBag } from 'lucide-react';
import type { WasteData } from '@/types';

interface WasteStepProps {
  data: WasteData;
  onChange: (data: WasteData) => void;
}

const recyclingOptions: { value: WasteData['recyclingFrequency']; label: string; emoji: string }[] = [
  { value: 'never', label: 'Never', emoji: '❌' },
  { value: 'sometimes', label: 'Sometimes', emoji: '🔄' },
  { value: 'usually', label: 'Usually', emoji: '♻️' },
  { value: 'always', label: 'Always', emoji: '💚' },
];

const plasticOptions: { value: WasteData['singleUsePlastic']; label: string; emoji: string }[] = [
  { value: 'rarely', label: 'Rarely', emoji: '🌿' },
  { value: 'sometimes', label: 'Sometimes', emoji: '🤷' },
  { value: 'often', label: 'Often', emoji: '🛒' },
];

export default function WasteStep({ data, onChange }: WasteStepProps) {
  const update = (partial: Partial<WasteData>) => {
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          ♻️ Waste & Recycling
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          How you manage waste impacts your carbon footprint more than you think.
        </p>
      </div>

      {/* Recycling Frequency */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Recycle className="w-4 h-4 text-green-500" />
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            How often do you recycle?
          </label>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {recyclingOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update({ recyclingFrequency: option.value })}
              aria-pressed={data.recyclingFrequency === option.value}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                data.recyclingFrequency === option.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span
                className={`text-sm font-semibold ${
                  data.recyclingFrequency === option.value
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Composts Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <Leaf className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Do you compost?
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Composting food scraps & garden waste
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.composts}
          onClick={() => update({ composts: !data.composts })}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            data.composts ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
              data.composts ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Single-Use Plastic */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-red-500" />
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            How often do you use single-use plastics?
          </label>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {plasticOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => update({ singleUsePlastic: option.value })}
              aria-pressed={data.singleUsePlastic === option.value}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                data.singleUsePlastic === option.value
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 shadow-md'
                  : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white dark:bg-gray-800'
              }`}
            >
              <span className="text-2xl">{option.emoji}</span>
              <span
                className={`text-sm font-semibold ${
                  data.singleUsePlastic === option.value
                    ? 'text-emerald-700 dark:text-emerald-300'
                    : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {option.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Uses Reusable Items Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="flex items-center gap-3">
          <ShoppingBag className="w-5 h-5 text-teal-500" />
          <div>
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Do you use reusable items?
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Reusable water bottle, shopping bag, food containers
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.usesReusableItems}
          onClick={() => update({ usesReusableItems: !data.usesReusableItems })}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            data.usesReusableItems ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-gray-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
              data.usesReusableItems ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
}
