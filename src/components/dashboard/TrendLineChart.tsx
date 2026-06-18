'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { Card } from '@/components/ui/Card';
import type { AssessmentData } from '@/types';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';
import { formatDate } from '@/utils/formatting';
import { GLOBAL_AVERAGE_KG, SUSTAINABILITY_TARGET_KG } from '@/constants/benchmarks';

interface TrendLineChartProps {
  history: AssessmentData[];
}

export function TrendLineChart({ history }: TrendLineChartProps) {
  // Sort history chronologically
  const sortedHistory = [...history].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const data = sortedHistory.map((item) => {
    const result = calculateTotalFootprint(item);
    return {
      date: item.date,
      displayDate: formatDate(item.date),
      shortDate: new Date(item.date).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      }),
      emissions: Math.round(result.totalYearly),
    };
  });

  return (
    <Card variant="glass" padding="lg" hover className="w-full">
      <div className="mb-6">
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Emission Trend over Time</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">Track your carbon footprint history across assessments</p>
      </div>

      <div className="h-[300px] w-full">
        {data.length < 2 ? (
          <div className="flex flex-col items-center justify-center h-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
            <span className="text-3xl mb-2">📈</span>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Not enough data to display trend
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[250px] mt-1">
              Complete another assessment later to start charting your progress.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorEmissions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} className="stroke-slate-200 dark:stroke-slate-800" />
              <XAxis
                dataKey="shortDate"
                className="text-xs font-semibold text-slate-500 fill-slate-500"
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                className="text-xs font-semibold text-slate-500 fill-slate-500"
                tickLine={false}
                axisLine={false}
                unit=" kg"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0]?.payload;
                    return (
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-3 rounded-lg shadow-md text-xs">
                        <p className="font-bold text-slate-900 dark:text-white mb-1">
                          {item.displayDate}
                        </p>
                        <p className="text-emerald-600 dark:text-emerald-400 font-semibold">
                          Footprint: {item.emissions.toLocaleString()} kg CO₂e/yr
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              {/* Reference line for Global Average */}
              <ReferenceLine
                y={GLOBAL_AVERAGE_KG}
                stroke="#64748b"
                strokeDasharray="4 4"
                label={{
                  value: 'Global Avg',
                  position: 'top',
                  fill: '#64748b',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />
              
              {/* Reference line for Climate Target */}
              <ReferenceLine
                y={SUSTAINABILITY_TARGET_KG}
                stroke="#10b981"
                strokeDasharray="3 3"
                label={{
                  value: 'Paris Target',
                  position: 'bottom',
                  fill: '#10b981',
                  fontSize: 10,
                  fontWeight: 600,
                }}
              />

              <Area
                type="monotone"
                dataKey="emissions"
                stroke="#10b981"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorEmissions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </Card>
  );
}
