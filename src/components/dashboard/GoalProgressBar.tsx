'use client';

/** @module GoalProgressBar - Component or utility for GoalProgressBar */


import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { getGoals, removeGoal } from '@/services/goal.service';
import type { Goal } from '@/types';
import { Calendar, Target, Trash2 } from 'lucide-react';

interface GoalProgressBarProps {
  refreshTrigger?: number;
  onGoalChange?: () => void;
}

export function GoalProgressBar({ refreshTrigger = 0, onGoalChange }: GoalProgressBarProps) {
  const [goals, setGoals] = useState<Goal[]>([]);

  const loadGoals = async () => {
    try {
      const allGoals = await getGoals();
      setGoals(allGoals);
    } catch (error) {
      console.error('Failed to load goals:', error);
    }
  };

  useEffect(() => {
    void loadGoals();
  }, [refreshTrigger]);

  const handleDeleteGoal = async (id: string) => {
    try {
      await removeGoal(id);
      await loadGoals();
      if (onGoalChange) onGoalChange();
    } catch (error) {
      console.error('Failed to delete goal:', error);
    }
  };

  // Days remaining calculation
  const getDaysRemaining = (deadlineStr: string) => {
    const deadline = new Date(deadlineStr);
    const now = new Date();
    const diffTime = deadline.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const activeGoals = goals.slice(0, 3);

  return (
    <Card variant="glass" padding="lg" hover className="w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Carbon Reduction Goals</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Track targets to lower your environmental impact</p>
        </div>
      </div>

      {activeGoals.length === 0 ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <span className="text-3xl mb-2">🎯</span>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
            No goals set yet
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-[250px] mt-1 mb-4">
            Setting concrete targets is shown to double your chances of success.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {activeGoals.map((goal) => {
            const daysRemaining = getDaysRemaining(goal.deadline);
            // Calculate progress percentage: (currentValue / targetReduction) * 100
            const progress = goal.targetReduction > 0 
              ? Math.min((goal.currentValue / goal.targetReduction) * 100, 100) 
              : 0;

            return (
              <div key={goal.id} className="space-y-2 group relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-sm font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                      <Target className="w-4 h-4 text-emerald-500" />
                      {goal.title}
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">
                      Target: Reduce emissions by {goal.targetReduction}%
                    </p>
                  </div>
                  
                  {/* Delete button (visible on hover) */}
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100"
                    aria-label={`Delete goal: ${goal.title}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-1">
                  <ProgressBar
                    value={progress}
                    color={goal.isCompleted ? 'emerald' : 'blue'}
                    size="md"
                    showLabel
                    animated
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 dark:text-slate-500 font-semibold">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {daysRemaining === 0 ? 'Goal Ended' : `${daysRemaining} days remaining`}
                    </span>
                    <span>{progress.toFixed(0)}% achieved</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
