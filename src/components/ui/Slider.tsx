'use client';

/** @module Slider - Slider component with track gradients, tooltip overlays, and accessible attributes */

import { useId } from 'react';

interface SliderProps {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label?: string;
  unit?: string;
  showValue?: boolean;
  className?: string;
}

/**
 * Slider component for selection from a range of numerical values.
 * Renders custom track colors and a dynamic tooltip above the thumb.
 */
function Slider({
  min,
  max,
  step = 1,
  value,
  onChange,
  label,
  unit = '',
  showValue = true,
  className = '',
}: SliderProps) {
  const id = useId();
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className={`w-full ${className}`}>
      {(label || showValue) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <label
              htmlFor={id}
              className="text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              {label}
            </label>
          )}
          {showValue && (
            <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 tabular-nums">
              {value}
              {unit ? ` ${unit}` : ''}
            </span>
          )}
        </div>
      )}

      <div className="relative w-full">
        {/* Tooltip */}
        {showValue && (
          <div
            className="absolute -top-8 transition-all duration-100"
            style={{
              left: `calc(${percentage}% - 18px)`,
            }}
            aria-hidden="true"
          >
            <div className="bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap tabular-nums">
              {value}{unit}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-900 dark:border-t-slate-100" />
            </div>
          </div>
        )}

        <input
          id={id}
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
          aria-label={label}
          className="w-full h-2 appearance-none rounded-full cursor-pointer
            bg-slate-200 dark:bg-slate-700
            [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:h-5
            [&::-webkit-slider-thumb]:w-5
            [&::-webkit-slider-thumb]:rounded-full
            [&::-webkit-slider-thumb]:bg-emerald-500
            [&::-webkit-slider-thumb]:shadow-md
            [&::-webkit-slider-thumb]:shadow-emerald-500/30
            [&::-webkit-slider-thumb]:border-2
            [&::-webkit-slider-thumb]:border-white
            [&::-webkit-slider-thumb]:dark:border-slate-800
            [&::-webkit-slider-thumb]:transition-transform
            [&::-webkit-slider-thumb]:duration-150
            [&::-webkit-slider-thumb]:hover:scale-110
            [&::-webkit-slider-thumb]:active:scale-95
            [&::-moz-range-thumb]:h-5
            [&::-moz-range-thumb]:w-5
            [&::-moz-range-thumb]:rounded-full
            [&::-moz-range-thumb]:bg-emerald-500
            [&::-moz-range-thumb]:border-2
            [&::-moz-range-thumb]:border-white
            [&::-moz-range-thumb]:dark:border-slate-800
            focus-visible:outline-none
            focus-visible:[&::-webkit-slider-thumb]:ring-2
            focus-visible:[&::-webkit-slider-thumb]:ring-emerald-500
            focus-visible:[&::-webkit-slider-thumb]:ring-offset-2
          "
          style={{
            background: `linear-gradient(to right, #10b981 0%, #10b981 ${percentage}%, transparent ${percentage}%, transparent 100%)`,
          }}
        />
      </div>
    </div>
  );
}

export { Slider };
export type { SliderProps };
