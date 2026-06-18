'use client';

import { useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
} from 'recharts';
import type { Assessment } from '@/types';
import { formatDate, formatCO2 } from '@/utils/formatting';
import { SUSTAINABILITY_TARGET_KG } from '@/constants/benchmarks';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';

interface MonthlyTrendChartProps {
  assessments: Assessment[];
}

interface ChartDataPoint {
  date: string;
  footprint: number;
  formattedDate: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    dataKey: string;
  }>;
  label?: string;
}

function ChartTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg dark:border-gray-700 dark:bg-gray-800">
      <p className="mb-1 text-xs font-medium text-gray-500 dark:text-gray-400">
        {label}
      </p>
      <p className="text-lg font-bold text-gray-900 dark:text-white">
        {formatCO2(payload[0].value)}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">kg CO₂e / year</p>
    </div>
  );
}

export function MonthlyTrendChart({ assessments }: MonthlyTrendChartProps) {
  const chartData = useMemo<ChartDataPoint[]>(() => {
    return assessments
      .slice()
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((assessment) => {
        const result = calculateTotalFootprint(assessment);
        return {
          date: assessment.date,
          footprint: Math.round(result.totalYearly),
          formattedDate: formatDate(assessment.date),
        };
      });
  }, [assessments]);

  if (assessments.length === 0) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-white">
          Footprint Trend
        </h3>
        <div className="flex h-64 flex-col items-center justify-center text-center">
          <span className="mb-3 text-4xl" role="img" aria-hidden="true">
            📈
          </span>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Complete your first assessment to see your footprint trend.
          </p>
        </div>
      </section>
    );
  }

  const avgFootprint =
    chartData.reduce((sum, d) => sum + d.footprint, 0) / chartData.length;

  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <h3 className="mb-6 text-lg font-semibold text-gray-900 dark:text-white">
        Footprint Trend
      </h3>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="footprintGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="formattedDate"
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
            <Tooltip content={<ChartTooltip />} />
            <ReferenceLine
              y={SUSTAINABILITY_TARGET_KG}
              stroke="#10b981"
              strokeDasharray="5 5"
              label={{
                value: 'Paris Target',
                position: 'right',
                fill: '#10b981',
                fontSize: 11,
              }}
            />
            <ReferenceLine
              y={avgFootprint}
              stroke="#f59e0b"
              strokeDasharray="3 3"
              label={{
                value: 'Your Avg',
                position: 'right',
                fill: '#f59e0b',
                fontSize: 11,
              }}
            />
            <Area
              type="monotone"
              dataKey="footprint"
              stroke="#10b981"
              strokeWidth={2}
              fill="url(#footprintGradient)"
              dot={{ r: 4, fill: '#10b981', strokeWidth: 2, stroke: '#fff' }}
              activeDot={{ r: 6, stroke: '#10b981', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
