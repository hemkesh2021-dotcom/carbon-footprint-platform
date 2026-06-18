'use client';

import { Card } from '@/components/ui/Card';
import { generateMonthlySummary } from '@/lib/insights/generator';
import type { FootprintResult } from '@/types';
import { Leaf, Sparkles, TrendingDown } from 'lucide-react';

interface ImpactSummaryProps {
  result: FootprintResult;
  previousResult?: FootprintResult | null;
}

export function ImpactSummary({ result, previousResult }: ImpactSummaryProps) {
  const summaryText = generateMonthlySummary(result, previousResult || null);

  // Derive top savings category or general reduction status
  const totalSavings = previousResult 
    ? Math.max(previousResult.totalYearly - result.totalYearly, 0)
    : 0;

  return (
    <Card variant="glass" padding="lg" hover className="w-full relative overflow-hidden bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-950/20 dark:to-teal-950/20">
      {/* Background decoration */}
      <div className="absolute right-[-20px] bottom-[-20px] opacity-10 dark:opacity-5 text-emerald-600">
        <Leaf size={140} />
      </div>

      <div className="flex gap-4 items-start relative z-10">
        {/* Animated Icon Container */}
        <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 shrink-0">
          {totalSavings > 0 ? (
            <TrendingDown className="w-6 h-6 animate-bounce" />
          ) : (
            <Sparkles className="w-6 h-6" />
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
            Sustainability Insights
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
            {summaryText}
          </p>
          
          {totalSavings > 0 && (
            <div className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mt-2">
              🌳 Your annual carbon savings are equivalent to planting about {Math.round(totalSavings / 22)} trees!
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
