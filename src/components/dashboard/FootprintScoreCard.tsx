'use client';

/** @module FootprintScoreCard - Component or utility for FootprintScoreCard */


import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressRing } from '@/components/ui/ProgressRing';
import { formatCO2, formatPercentage } from '@/utils/formatting';
import { ArrowDownRight, ArrowUpRight, ShieldAlert } from 'lucide-react';
import type { FootprintResult } from '@/types';

interface FootprintScoreCardProps {
  result: FootprintResult;
  previousResult?: FootprintResult | null;
}

export function FootprintScoreCard({ result, previousResult }: FootprintScoreCardProps) {
  const [timeframe, setTimeframe] = useState<'daily' | 'monthly' | 'yearly'>('yearly');

  // Value based on timeframe
  const getValue = (res: FootprintResult) => {
    if (timeframe === 'daily') return res.totalDaily;
    if (timeframe === 'monthly') return res.totalMonthly;
    return res.totalYearly;
  };

  const currentVal = getValue(result);
  
  // Calculate relative change
  let changePct = 0;
  if (previousResult) {
    const prevVal = getValue(previousResult);
    if (prevVal > 0) {
      changePct = ((currentVal - prevVal) / prevVal) * 100;
    }
  }

  // Progress relative to Paris Agreement Target (2,000 kg CO₂e / year)
  // Target: 2000 kg/year, 166.7 kg/month, 5.48 kg/day
  const getTarget = () => {
    if (timeframe === 'daily') return 5.48;
    if (timeframe === 'monthly') return 166.67;
    return 2000;
  };

  const target = getTarget();
  const percentageOfTarget = (currentVal / target) * 100;

  // Visual formatting
  const formattedVal = timeframe === 'yearly' 
    ? formatCO2(currentVal) 
    : `${currentVal.toFixed(1)} kg CO₂e`;

  return (
    <Card variant="glass" padding="lg" hover className="w-full relative overflow-hidden">
      {/* Title & Timeframe Selector */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Your Carbon Footprint</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Estimated based on your lifestyle profile</p>
        </div>
        
        {/* Toggle buttons */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          {(['daily', 'monthly', 'yearly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${
                timeframe === t
                  ? 'bg-white dark:bg-slate-700 text-emerald-600 dark:text-emerald-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Large Score Display */}
        <div className="space-y-4">
          <div className="space-y-1">
            <span className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
              Emissions Rate
            </span>
            <div className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tabular-nums tracking-tight">
              {formattedVal}
            </div>
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
              per {timeframe === 'yearly' ? 'year' : timeframe === 'monthly' ? 'month' : 'day'}
            </span>
          </div>

          {/* Change Indicator */}
          {previousResult && (
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-0.5 px-2.5 py-1 rounded-full text-xs font-bold leading-none ${
                  changePct <= 0
                    ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-red-500/10 text-red-600 dark:text-red-400'
                }`}
              >
                {changePct <= 0 ? (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                )}
                {formatPercentage(Math.abs(changePct))}%
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                vs. last assessment
              </span>
            </div>
          )}

          {/* Paris Agreement status message */}
          <div className="text-xs text-slate-500 dark:text-slate-400">
            {result.totalYearly <= 2000 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                🎉 Meeting the Paris Agreement target (2,000 kg/year)
              </span>
            ) : (
              <span className="flex items-start gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  Currently <b>{formatPercentage(percentageOfTarget - 100)}</b> above the sustainable global target ({timeframe === 'yearly' ? '2,000 kg' : timeframe === 'monthly' ? '167 kg' : '5.5 kg'}).
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Circular Gauge */}
        <div className="flex flex-col items-center justify-center p-4">
          <ProgressRing
            value={percentageOfTarget}
            size={140}
            strokeWidth={10}
            color={result.totalYearly <= 2000 ? 'emerald' : result.totalYearly <= 4800 ? 'amber' : 'red'}
            gradient
            label="Relative to Climate Target"
            showValue
          />
        </div>
      </div>
    </Card>
  );
}
