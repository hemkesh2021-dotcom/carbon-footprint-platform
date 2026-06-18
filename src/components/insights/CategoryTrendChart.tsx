'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';
import type { Assessment } from '@/types';
import { formatDate, formatCO2 } from '@/utils/formatting';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';

interface CategoryTrendChartProps {
  assessments: Assessment[];
}

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#10b981',
  shopping: '#8b5cf6',
  waste: '#ef4444',
  housing: '#06b6d4',
  other: '#6b7280',
};

interface CategoryTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

function CategoryTooltip({ active, payload, label }: CategoryTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  const total = payload.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-lg dark:border-slate-700 dark:bg-slate-800">
      <p className="mb-2 text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center justify-between gap-4">
          <span className="flex items-center gap-1.5">
            <span
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs capitalize text-slate-700 dark:text-slate-300">
              {entry.name}
            </span>
          </span>
          <span className="text-xs font-medium text-slate-900 dark:text-white">
            {formatCO2(entry.value)}
          </span>
        </div>
      ))}
      <div className="mt-2 border-t border-slate-200 pt-2 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
            Total
          </span>
          <span className="text-xs font-bold text-slate-900 dark:text-white">
            {formatCO2(total)}
          </span>
        </div>
      </div>
    </div>
  );
}

export function CategoryTrendChart({ assessments }: CategoryTrendChartProps) {
  const { chartData, categories } = useMemo(() => {
    const sorted = assessments
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const allCategories = new Set<string>();

    const data = sorted.map((assessment) => {
      const result = calculateTotalFootprint(assessment);
      const point: Record<string, string | number> = {
        date: formatDate(assessment.date),
      };

      result.categories.forEach((cat) => {
        point[cat.category] = Math.round(cat.emissions);
        allCategories.add(cat.category);
      });

      return point;
    });

    return {
      chartData: data,
      categories: Array.from(allCategories),
    };
  }, [assessments]);

  if (assessments.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Category Breakdown
        </h3>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <span className="mb-3 text-4xl" role="img" aria-hidden="true">
            📊
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Complete an assessment to see your category breakdown.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
        Category Breakdown
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value: number) => `${value}`}
            />
            <Tooltip content={<CategoryTooltip />} />
            <Legend
              iconType="circle"
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              formatter={(value: string) =>
                value.charAt(0).toUpperCase() + value.slice(1)
              }
            />
            {categories.map((category) => (
              <Bar
                key={category}
                dataKey={category}
                stackId="a"
                fill={CATEGORY_COLORS[category] ?? '#6b7280'}
                radius={
                  categories.indexOf(category) === categories.length - 1
                    ? [4, 4, 0, 0]
                    : [0, 0, 0, 0]
                }
                name={category}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
