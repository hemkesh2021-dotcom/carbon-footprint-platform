'use client';

/** @module ResultsView - Component or utility for ResultsView */


import React, { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts';
import { ArrowRight, RotateCcw, TreePine, Car, Laptop, Lightbulb, TrendingDown } from 'lucide-react';
import type { FootprintResult } from '@/types';
import { getEquivalents } from '@/lib/calculator/comparisons';
import { GLOBAL_AVERAGE_KG, SUSTAINABILITY_TARGET_KG } from '@/constants/benchmarks';
import { generateRecommendations } from '@/lib/recommendations/engine';
import Link from 'next/link';

interface ResultsViewProps {
  result: FootprintResult;
  onRecalculate: () => void;
}

const CATEGORY_COLORS: Record<string, string> = {
  transport: '#3b82f6',
  energy: '#f59e0b',
  food: '#10b981',
  shopping: '#8b5cf6',
  waste: '#ef4444',
  travel: '#06b6d4',
};

const CATEGORY_LABELS: Record<string, string> = {
  transport: 'Transport',
  energy: 'Energy',
  food: 'Food & Diet',
  shopping: 'Shopping',
  waste: 'Waste',
  travel: 'Travel',
};

function AnimatedCounter({ target, duration = 2000 }: { target: number; duration?: number }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [target, duration]);

  return <span>{count.toLocaleString()}</span>;
}

export default function ResultsView({ result, onRecalculate }: ResultsViewProps) {
  const totalYearly = result.totalYearly;
  const totalMonthly = Math.round(totalYearly / 12);
  const totalDaily = Math.round(totalYearly / 365);

  const equivalents = getEquivalents(totalYearly);
  const recommendations = generateRecommendations(result);

  const pieData = result.categories.map((item) => ({
    name: CATEGORY_LABELS[item.category] || item.category,
    value: Math.round(item.emissions),
    color: CATEGORY_COLORS[item.category] || '#6b7280',
  }));

  const comparisonData = [
    {
      name: 'Your Footprint',
      value: totalYearly,
      fill: totalYearly > GLOBAL_AVERAGE_KG ? '#ef4444' : totalYearly > SUSTAINABILITY_TARGET_KG ? '#f59e0b' : '#10b981',
    },
    { name: 'National Average', value: GLOBAL_AVERAGE_KG, fill: '#6b7280' },
    { name: 'Sustainability Target', value: SUSTAINABILITY_TARGET_KG, fill: '#10b981' },
  ];

  const getComparisonColor = useCallback(() => {
    if (totalYearly <= SUSTAINABILITY_TARGET_KG) return 'text-green-500';
    if (totalYearly <= GLOBAL_AVERAGE_KG) return 'text-amber-500';
    return 'text-red-500';
  }, [totalYearly]);

  const getComparisonMessage = useCallback(() => {
    if (totalYearly <= SUSTAINABILITY_TARGET_KG) return '🎉 Below sustainability target! Great job!';
    if (totalYearly <= GLOBAL_AVERAGE_KG) return '👍 Below national average, but room to improve';
    return '⚠️ Above national average — let\'s work on reducing this';
  }, [totalYearly]);

  const equivalentIcons = [
    { icon: <Car className="w-6 h-6" />, label: `driving ${equivalents.carKm.toLocaleString()} km`, emoji: '🚗' },
    { icon: <Laptop className="w-6 h-6" />, label: `powering a laptop for ${equivalents.laptopDays.toLocaleString()} days`, emoji: '💻' },
    { icon: <TreePine className="w-6 h-6" />, label: `${equivalents.treesNeeded.toLocaleString()} trees to offset`, emoji: '🌳' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Main Score */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-center p-8 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200 dark:border-emerald-800"
      >
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
          Your Annual Carbon Footprint
        </p>
        <div className={`text-6xl sm:text-7xl font-extrabold ${getComparisonColor()} mb-2`}>
          <AnimatedCounter target={totalYearly} />
        </div>
        <p className="text-xl font-semibold text-slate-700 dark:text-slate-300 mb-4">
          kg CO₂e / year
        </p>
        <div className="flex justify-center gap-6 text-sm text-slate-500 dark:text-slate-400">
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300">{totalMonthly.toLocaleString()}</span> kg/month
          </div>
          <div>
            <span className="font-bold text-slate-700 dark:text-slate-300">{totalDaily.toLocaleString()}</span> kg/day
          </div>
        </div>
        <p className={`mt-4 text-sm font-medium ${getComparisonColor()}`}>
          {getComparisonMessage()}
        </p>
      </motion.div>

      {/* Category Breakdown Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          Category Breakdown
        </h3>
        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                stroke="none"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: unknown) => [`${Number(value).toLocaleString()} kg CO₂e`, '']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
              />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value: string) => (
                  <span className="text-sm text-slate-700 dark:text-slate-300">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4">
          {pieData.map((entry) => {
            const percentage = Math.round((entry.value / totalYearly) * 100);
            return (
              <div key={entry.name} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-slate-600 dark:text-slate-400">{entry.name}:</span>
                <span className="font-semibold text-slate-900 dark:text-white">{percentage}%</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Comparison Bar Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm"
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          How You Compare
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={comparisonData} layout="vertical" margin={{ left: 10, right: 30 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(v: number) => `${(v / 1000).toFixed(1)}t`} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={130} />
              <Tooltip
                formatter={(value: unknown) => [`${Number(value).toLocaleString()} kg CO₂e`, '']}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
              />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={24}>
                {comparisonData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Equivalents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">
          What Does This Mean?
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {equivalentIcons.map((eq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + i * 0.15 }}
              className="flex flex-col items-center gap-3 p-5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-center"
            >
              <span className="text-3xl">{eq.emoji}</span>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                That&apos;s like <span className="font-bold text-slate-900 dark:text-white">{eq.label}</span>
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Top 3 Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
      >
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          Top Recommendations
        </h3>
        <div className="space-y-3">
          {recommendations.slice(0, 3).map((rec, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.1 + i * 0.15 }}
              className="flex items-start gap-4 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                <TrendingDown className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-900 dark:text-white">
                  {rec.title}
                </p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  {rec.description}
                </p>
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 rounded-full">
                    Save ~{rec.estimatedReduction} kg CO₂e/month
                  </span>
                  <span
                    className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      rec.difficulty === 'easy'
                        ? 'text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/20'
                        : rec.difficulty === 'medium'
                        ? 'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-900/20'
                        : 'text-red-700 bg-red-50 dark:text-red-300 dark:bg-red-900/20'
                    }`}
                  >
                    {rec.difficulty.charAt(0).toUpperCase() + rec.difficulty.slice(1)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4 }}
        className="flex flex-col sm:flex-row gap-4 pt-4"
      >
        <Link
          href="/dashboard"
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors shadow-lg shadow-emerald-600/25 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          View Dashboard
          <ArrowRight className="w-5 h-5" />
        </Link>
        <button
          type="button"
          onClick={onRecalculate}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-emerald-600 text-emerald-600 dark:text-emerald-400 dark:border-emerald-400 font-semibold hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        >
          <RotateCcw className="w-5 h-5" />
          Recalculate
        </button>
      </motion.div>
    </motion.div>
  );
}
