'use client';

/** @module SummaryReport - Component or utility for SummaryReport */


import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/Badge';
import type { Assessment } from '@/types';
import { generateInsights } from '@/lib/insights/generator';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';

interface SummaryReportProps {
  assessments: Assessment[];
}

interface Insight {
  type: 'improvement' | 'suggestion' | 'achievement';
  message: string;
  category?: string;
}

const INSIGHT_ICONS: Record<string, string> = {
  improvement: '↓',
  suggestion: '💡',
  achievement: '🏆',
};

const INSIGHT_STYLES: Record<string, string> = {
  improvement:
    'border-emerald-200 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-900/20',
  suggestion:
    'border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-900/20',
  achievement:
    'border-purple-200 bg-purple-50 dark:border-purple-800 dark:bg-purple-900/20',
};

const INSIGHT_TEXT_STYLES: Record<string, string> = {
  improvement: 'text-emerald-700 dark:text-emerald-400',
  suggestion: 'text-amber-700 dark:text-amber-400',
  achievement: 'text-purple-700 dark:text-purple-400',
};

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function SummaryReport({ assessments }: SummaryReportProps) {
  const insights = useMemo<Insight[]>(() => {
    if (assessments.length === 0) return [];

    try {
      const generated = generateInsights(assessments);
      // If generator returns a Promise, we handle it in the component state instead
      // For now, assume synchronous or handle as needed
      if (Array.isArray(generated)) {
        return generated as Insight[];
      }
      return [];
    } catch {
      // Fallback insights based on assessment data
      const latest = assessments[assessments.length - 1];
      const fallbackInsights: Insight[] = [];

      if (assessments.length >= 2) {
        const prev = assessments[assessments.length - 2];
        if (prev && latest) {
          const prevTotal = calculateTotalFootprint(prev).totalYearly;
          const currTotal = calculateTotalFootprint(latest).totalYearly;

          if (currTotal < prevTotal) {
            fallbackInsights.push({
              type: 'improvement',
              message: `Great progress! Your footprint decreased by ${Math.round(prevTotal - currTotal)} kg CO₂e since your last assessment.`,
            });
          }
        }

        fallbackInsights.push({
          type: 'achievement',
          message: `You've completed ${assessments.length} assessments. Tracking is the first step to improvement!`,
        });
      }

      fallbackInsights.push({
        type: 'suggestion',
        message:
          'Consider reducing car trips by 1 per week — this could save ~500 kg CO₂e per year.',
        category: 'transport',
      });

      fallbackInsights.push({
        type: 'suggestion',
        message:
          'Switching to a renewable energy provider is one of the highest-impact actions you can take.',
        category: 'energy',
      });

      return fallbackInsights;
    }
  }, [assessments]);

  if (assessments.length === 0) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <h3 className="mb-2 text-lg font-semibold text-slate-900 dark:text-white">
          Personalized Insights
        </h3>
        <div className="flex h-48 flex-col items-center justify-center text-center">
          <span className="mb-3 text-4xl" role="img" aria-hidden="true">
            🔍
          </span>
          <p className="max-w-sm text-sm text-slate-500 dark:text-slate-400">
            Complete your first assessment to get personalized insights and
            actionable recommendations.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <h3 className="mb-6 text-lg font-semibold text-slate-900 dark:text-white">
        Personalized Insights
      </h3>

      <motion.div
        className="grid gap-4 sm:grid-cols-2"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {insights.map((insight, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className={`flex gap-3 rounded-xl border p-4 ${INSIGHT_STYLES[insight.type] ?? INSIGHT_STYLES.suggestion}`}
          >
            <span className="flex-shrink-0 text-2xl" role="img" aria-hidden="true">
              {INSIGHT_ICONS[insight.type] ?? '💡'}
            </span>
            <div className="min-w-0 flex-1">
              <p
                className={`text-sm font-medium ${INSIGHT_TEXT_STYLES[insight.type] ?? INSIGHT_TEXT_STYLES.suggestion}`}
              >
                {insight.message}
              </p>
              {insight.category && (
                <Badge variant="neutral" className="mt-2">
                  {insight.category}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Motivation footer */}
      <div className="mt-6 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-center dark:from-emerald-900/10 dark:to-teal-900/10">
        <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
          💪 Every small step makes a difference. Keep tracking your progress!
        </p>
      </div>
    </section>
  );
}
