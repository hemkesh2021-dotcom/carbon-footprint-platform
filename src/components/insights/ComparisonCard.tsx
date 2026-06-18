'use client';

import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingDown, TrendingUp, ArrowRight } from 'lucide-react';
import type { Assessment } from '@/types';
import { formatCO2 } from '@/utils/formatting';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';

interface ComparisonCardProps {
  assessments: Assessment[];
}

interface CategoryComparison {
  category: string;
  previous: number;
  current: number;
  change: number;
  changePercent: number;
}

export function ComparisonCard({ assessments }: ComparisonCardProps) {
  const comparison = useMemo(() => {
    if (assessments.length < 2) return null;

    const sorted = assessments
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const previous = sorted[sorted.length - 2];
    const current = sorted[sorted.length - 1];

    if (!previous || !current) return null;

    const prevResult = calculateTotalFootprint(previous);
    const currResult = calculateTotalFootprint(current);

    const prevTotal = prevResult.totalYearly;
    const currTotal = currResult.totalYearly;
    const totalChange = currTotal - prevTotal;
    const totalChangePercent =
      prevTotal !== 0 ? (totalChange / prevTotal) * 100 : 0;

    // Per-category comparison
    const categories: CategoryComparison[] = prevResult.categories.map((prevCat) => {
      const currCat = currResult.categories.find((c) => c.category === prevCat.category);
      const prevVal = prevCat.emissions;
      const currVal = currCat ? currCat.emissions : 0;
      const change = currVal - prevVal;
      const changePercent = prevVal !== 0 ? (change / prevVal) * 100 : 0;

      return {
        category: prevCat.category,
        previous: prevVal,
        current: currVal,
        change,
        changePercent,
      };
    });

    return {
      prevTotal,
      currTotal,
      totalChange,
      totalChangePercent,
      categories,
      previousDate: previous.date,
      currentDate: current.date,
    };
  }, [assessments]);

  if (assessments.length < 2) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Progress Comparison
        </h3>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <span className="mb-3 text-4xl" role="img" aria-hidden="true">
            📋
          </span>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Complete another assessment to see how your footprint has changed.
          </p>
        </div>
      </section>
    );
  }

  if (!comparison) return null;

  const isImproved = comparison.totalChange <= 0;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
        Progress Comparison
      </h3>

      {/* Total comparison */}
      <div className="mb-6 flex items-center justify-between gap-4">
        {/* Previous */}
        <div className="flex-1 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Previous
          </p>
          <p className="text-2xl font-bold text-slate-700 dark:text-slate-300">
            {formatCO2(comparison.prevTotal)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">kg CO₂e/yr</p>
        </div>

        {/* Arrow with change */}
        <div className="flex flex-col items-center gap-1">
          <div
            className={`flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold ${
              isImproved
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {isImproved ? (
              <TrendingDown className="h-4 w-4" />
            ) : (
              <TrendingUp className="h-4 w-4" />
            )}
            {Math.abs(comparison.totalChangePercent).toFixed(1)}%
          </div>
          <ArrowRight className="h-5 w-5 text-slate-400" />
        </div>

        {/* Current */}
        <div className="flex-1 text-center">
          <p className="mb-1 text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Current
          </p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">
            {formatCO2(comparison.currTotal)}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">kg CO₂e/yr</p>
        </div>
      </div>

      {/* Category breakdowns */}
      <div className="space-y-3">
        <h4 className="text-xs font-medium uppercase tracking-wider text-slate-500 dark:text-slate-400">
          By Category
        </h4>
        {comparison.categories.map((cat) => {
          const improved = cat.change <= 0;
          const maxVal = Math.max(cat.previous, cat.current, 1);

          return (
            <div key={cat.category}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
                  {cat.category}
                </span>
                <span
                  className={`text-xs font-semibold ${
                    improved
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {improved ? '↓' : '↑'}{' '}
                  {Math.abs(cat.changePercent).toFixed(1)}%
                </span>
              </div>
              {/* Mini bars */}
              <div className="flex gap-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(cat.previous / maxVal) * 100}%`,
                  }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="h-2 rounded-full bg-slate-300 dark:bg-slate-600"
                  title={`Previous: ${formatCO2(cat.previous)}`}
                />
              </div>
              <div className="mt-1 flex gap-1">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(cat.current / maxVal) * 100}%`,
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className={`h-2 rounded-full ${
                    improved
                      ? 'bg-emerald-500 dark:bg-emerald-400'
                      : 'bg-red-500 dark:bg-red-400'
                  }`}
                  title={`Current: ${formatCO2(cat.current)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
