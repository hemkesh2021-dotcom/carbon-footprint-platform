'use client';

/** @module DashboardPage - Carbon Footprint Dashboard displaying metrics, history, and suggestions */

import { useState } from 'react';
import Link from 'next/link';
import { useAssessment } from '@/hooks/useAssessment';
import { calculateTotalFootprint } from '@/lib/calculator/calculator';
import { FootprintScoreCard } from '@/components/dashboard/FootprintScoreCard';
import { TrendLineChart } from '@/components/dashboard/TrendLineChart';
import { CategoryRingChart } from '@/components/dashboard/CategoryRingChart';
import { RecommendationCards } from '@/components/dashboard/RecommendationCards';
import { HabitStreakPanel } from '@/components/dashboard/HabitStreakPanel';
import { GoalProgressBar } from '@/components/dashboard/GoalProgressBar';
import { ImpactSummary } from '@/components/dashboard/ImpactSummary';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Leaf } from 'lucide-react';

/**
 * DashboardPage component containing the dashboard content.
 * Displays score details, trend graphs, recommendations, streaks, and goals.
 * Prompts onboarding if no assessment history is found.
 */
export default function DashboardPage() {
  const { latestAssessment, assessmentHistory, isLoading } = useAssessment();
  const [habitAddedTrigger, setHabitAddedTrigger] = useState(0);

  // Trigger habit panel refresh when a recommendation is tracked
  const handleHabitAdded = () => {
    setHabitAddedTrigger((prev) => prev + 1);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  // If no assessments exist, show onboarding state
  if (!latestAssessment) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 shadow-xl text-center space-y-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 dark:opacity-10 text-emerald-500 pointer-events-none">
            <Leaf size={120} />
          </div>

          <div className="mx-auto w-16 h-16 rounded-2xl bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-3xl">
            🌱
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">Welcome to CarbonWise!</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Before we can build your dashboard, we need to estimate your carbon footprint. Take a quick 3-minute assessment about your lifestyle habits.
            </p>
          </div>

          <Link href="/calculator" className="block">
            <Button className="w-full flex items-center justify-center gap-2" size="lg">
              Start Assessment
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>

          <p className="text-xs text-slate-400 dark:text-slate-500">
            No registration required. All data is stored privately on your device.
          </p>
        </div>
      </div>
    );
  }

  // Calculate footprints
  const result = calculateTotalFootprint(latestAssessment);
  const previousResult =
    assessmentHistory.length > 1
      ? calculateTotalFootprint(assessmentHistory[assessmentHistory.length - 2]!)
      : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Your Dashboard</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage and track your carbon reduction progress</p>
        </div>
        <Link href="/calculator">
          <Button variant="outline" size="sm">
            Recalculate Footprint
          </Button>
        </Link>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: ScoreCard and Trend Chart */}
        <div className="lg:col-span-7 space-y-8">
          <FootprintScoreCard result={result} previousResult={previousResult} />
          <TrendLineChart history={assessmentHistory} />
          <ImpactSummary result={result} previousResult={previousResult} />
        </div>

        {/* Right Column: Breakdown and Suggestions */}
        <div className="lg:col-span-5 space-y-8">
          <CategoryRingChart result={result} />
          <RecommendationCards result={result} onHabitAdded={handleHabitAdded} />
        </div>
      </div>

      {/* Full Width Bottom Panels */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
        <HabitStreakPanel refreshTrigger={habitAddedTrigger} />
        <GoalProgressBar refreshTrigger={habitAddedTrigger} />
      </div>
    </div>
  );
}
