'use client';

import { motion } from 'framer-motion';
import { Loader2, BarChart3 } from 'lucide-react';
import { MonthlyTrendChart } from '@/components/insights/MonthlyTrendChart';
import { CategoryTrendChart } from '@/components/insights/CategoryTrendChart';
import { ComparisonCard } from '@/components/insights/ComparisonCard';
import { SummaryReport } from '@/components/insights/SummaryReport';
import { useAssessment } from '@/hooks/useAssessment';

export default function InsightsPage() {
  const { assessmentHistory, isLoading } = useAssessment();

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Loading your insights...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Page header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="flex items-center gap-3 text-3xl font-bold text-gray-900 dark:text-white">
          <BarChart3 className="h-8 w-8 text-emerald-600" />
          Insights &amp; Progress
        </h1>
        <p className="mt-2 max-w-2xl text-gray-600 dark:text-gray-400">
          Track your carbon footprint over time, compare assessments, and
          discover actionable insights to reduce your environmental impact.
        </p>
      </motion.div>

      {/* Empty state */}
      {assessmentHistory.length === 0 && (
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8 overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-800 dark:from-emerald-900/20 dark:to-teal-900/20"
        >
          <div className="flex flex-col items-center px-6 py-16 text-center">
            <span className="mb-4 text-6xl" role="img" aria-hidden="true">
              📊
            </span>
            <h2 className="mb-2 text-2xl font-bold text-gray-900 dark:text-white">
              No Data Yet
            </h2>
            <p className="max-w-md text-gray-600 dark:text-gray-400">
              Complete your first carbon footprint assessment to unlock
              personalized insights, track your progress, and discover ways to
              reduce your impact.
            </p>
          </div>
        </motion.section>
      )}

      {/* Charts grid */}
      <div className="space-y-6">
        {/* Full width: Monthly trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <MonthlyTrendChart assessments={assessmentHistory} />
        </motion.div>

        {/* Two columns: Category trend + Comparison */}
        <div className="grid gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <CategoryTrendChart assessments={assessmentHistory} />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ComparisonCard assessments={assessmentHistory} />
          </motion.div>
        </div>

        {/* Full width: Summary report */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SummaryReport assessments={assessmentHistory} />
        </motion.div>
      </div>
    </div>
  );
}
