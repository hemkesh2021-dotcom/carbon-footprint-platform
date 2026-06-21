'use client';

/** @module CategoryRingChart - Component or utility for CategoryRingChart */


import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Card } from '@/components/ui/Card';
import { CATEGORY_META } from '@/constants/categories';
import { formatCO2 } from '@/utils/formatting';
import type { FootprintResult } from '@/types';

interface CategoryRingChartProps {
  result: FootprintResult;
}

export function CategoryRingChart({ result }: CategoryRingChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const data = result.categories.map((cat, idx) => {
    const meta = CATEGORY_META[cat.category];
    return {
      name: meta.label,
      value: Math.round(cat.emissions),
      percentage: cat.percentage,
      color: meta.color,
      icon: meta.icon,
      categoryKey: cat.category,
      index: idx,
    };
  });

  const activeItem = activeIndex !== null ? data[activeIndex] : null;

  return (
    <Card variant="glass" padding="lg" hover className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Category Breakdown</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">See which areas contribute the most to your footprint</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
        {/* Donut Chart */}
        <div className="sm:col-span-5 h-[200px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                    style={{ transition: 'opacity 0.2s ease, transform 0.2s ease', cursor: 'pointer' }}
                  />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0]?.payload;
                    return (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-2.5 rounded-lg shadow-md text-xs">
                        <p className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{item.icon}</span> {item.name}
                        </p>
                        <p className="text-slate-500 dark:text-slate-400 mt-0.5">
                          {item.value.toLocaleString()} kg CO₂e ({item.percentage}%)
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Center text in donut hole */}
          <div className="absolute pointer-events-none flex flex-col items-center justify-center text-center">
            {activeItem ? (
              <>
                <span className="text-xl">{activeItem.icon}</span>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none mt-1">
                  {activeItem.name}
                </span>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  {activeItem.percentage}%
                </span>
              </>
            ) : (
              <>
                <span className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest leading-none">
                  Total
                </span>
                <span className="text-base font-extrabold text-slate-800 dark:text-slate-100 mt-0.5">
                  {Math.round(result.totalYearly / 1000).toFixed(1)}t
                </span>
                <span className="text-[10px] text-slate-400 dark:text-slate-500">CO₂e/yr</span>
              </>
            )}
          </div>
        </div>

        {/* Legend grid */}
        <div className="sm:col-span-7 grid grid-cols-2 gap-3">
          {data.map((entry) => {
            const isHighlighted = activeIndex === entry.index;
            return (
              <div
                key={entry.categoryKey}
                onMouseEnter={() => setActiveIndex(entry.index)}
                onMouseLeave={() => setActiveIndex(null)}
                className={`flex items-start gap-2.5 p-2 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isHighlighted
                    ? 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40 shadow-sm'
                    : 'border-transparent'
                }`}
              >
                <span
                  className="w-3 h-3 rounded-full mt-1 shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate">
                    {entry.name}
                  </p>
                  <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 mt-0.5">
                    {formatCO2(entry.value)}
                  </p>
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                    {entry.percentage}%
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
