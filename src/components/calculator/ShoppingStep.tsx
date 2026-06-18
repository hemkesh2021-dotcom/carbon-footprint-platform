'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Smartphone, Recycle, Plus, Minus } from 'lucide-react';
import type { ShoppingData } from '@/types';

interface ShoppingStepProps {
  data: ShoppingData;
  onChange: (data: ShoppingData) => void;
}

export default function ShoppingStep({ data, onChange }: ShoppingStepProps) {
  const update = (partial: Partial<ShoppingData>) => {
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
          🛍️ Shopping
        </h2>
        <p className="text-slate-600 dark:text-slate-400">
          Consumer goods contribute significantly to carbon emissions.
        </p>
      </div>

      {/* Clothing Items Per Month */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <ShoppingBag className="w-4 h-4 text-purple-500" />
          <label
            htmlFor="clothing-slider"
            className="text-sm font-semibold text-slate-700 dark:text-slate-300"
          >
            Clothing items purchased per month
          </label>
        </div>
        <div className="flex items-center gap-4">
          <input
            id="clothing-slider"
            type="range"
            min={0}
            max={20}
            step={1}
            value={data.clothingItemsPerMonth}
            onChange={(e) => update({ clothingItemsPerMonth: Number(e.target.value) })}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            aria-valuenow={data.clothingItemsPerMonth}
            aria-valuemin={0}
            aria-valuemax={20}
            aria-label="Clothing items purchased per month"
          />
          <span className="min-w-[4rem] text-right text-lg font-bold text-emerald-600 dark:text-emerald-400">
            {data.clothingItemsPerMonth}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Each new clothing item produces ~10 kg of CO₂e on average
        </p>
      </div>

      {/* Electronics Per Year */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Smartphone className="w-4 h-4 text-blue-500" />
          <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            Electronics purchased per year
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => update({ electronicsPerYear: Math.max(0, data.electronicsPerYear - 1) })}
            disabled={data.electronicsPerYear <= 0}
            aria-label="Decrease electronics per year"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Minus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
          <span
            className="min-w-[3rem] text-center text-2xl font-bold text-slate-900 dark:text-white"
            aria-live="polite"
          >
            {data.electronicsPerYear}
          </span>
          <button
            type="button"
            onClick={() => update({ electronicsPerYear: Math.min(20, data.electronicsPerYear + 1) })}
            disabled={data.electronicsPerYear >= 20}
            aria-label="Increase electronics per year"
            className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <Plus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
          </button>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Phones, laptops, tablets, TVs, etc.
        </p>
      </div>

      {/* Prefers Second-Hand Toggle */}
      <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <div className="flex items-center gap-3">
          <Recycle className="w-5 h-5 text-green-500" />
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Do you prefer second-hand items?
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Thrift stores, refurbished electronics, hand-me-downs
            </p>
          </div>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={data.prefersSecondHand}
          onClick={() => update({ prefersSecondHand: !data.prefersSecondHand })}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
            data.prefersSecondHand ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-200 ${
              data.prefersSecondHand ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </motion.div>
  );
}
