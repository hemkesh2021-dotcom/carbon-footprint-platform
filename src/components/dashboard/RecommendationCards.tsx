'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CATEGORY_META } from '@/constants/categories';
import { generateRecommendations } from '@/lib/recommendations/engine';
import { addHabit, getHabits } from '@/services/habit.service';
import { Check, Plus } from 'lucide-react';
import type { FootprintResult, Recommendation } from '@/types';

interface RecommendationCardsProps {
  result: FootprintResult;
  onHabitAdded?: () => void;
}

export function RecommendationCards({ result, onHabitAdded }: RecommendationCardsProps) {
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    // Wait: to get active habit IDs we should query getHabits. Since this is in initializer state,
    // we will load it inside a useEffect, or just compute with empty adoptedHabitIds first.
    return generateRecommendations(result, []);
  });

  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [adoptedIds, setAdoptedIds] = useState<string[]>([]);

  // Load actual habits on mount to see what is already adopted
  useState(() => {
    if (typeof window !== 'undefined') {
      getHabits().then((habits) => {
        const ids = habits.map((h) => h.id);
        setAdoptedIds(ids);
        setRecommendations(generateRecommendations(result, ids));
      });
    }
  });

  const handleAddHabit = async (rec: Recommendation) => {
    setLoadingId(rec.id);
    try {
      // Convert recommendation template to a habit template
      await addHabit({
        id: rec.id,
        name: rec.title,
        category: rec.category,
        icon: CATEGORY_META[rec.category]?.icon || '🌱',
        frequency: rec.id.includes('monday') || rec.id.includes('wednesday') ? 'weekly' : 'daily',
        estimatedReduction: rec.estimatedReduction,
      });

      setAdoptedIds((prev) => [...prev, rec.id]);
      setRecommendations((prev) =>
        prev.map((r) => (r.id === rec.id ? { ...r, isAdopted: true } : r))
      );

      if (onHabitAdded) onHabitAdded();
    } catch (error) {
      console.error('Failed to add habit:', error);
    } finally {
      setLoadingId(null);
    }
  };

  const activeRecs = recommendations.slice(0, 3);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recommended Actions</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">High-impact actions customized for you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {activeRecs.length === 0 ? (
          <div className="text-center p-6 bg-slate-50 dark:bg-slate-800/20 rounded-2xl border border-slate-200 dark:border-slate-800">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No recommendations available
            </p>
          </div>
        ) : (
          activeRecs.map((rec) => {
            const meta = CATEGORY_META[rec.category];
            const isAdopted = adoptedIds.includes(rec.id) || rec.isAdopted;

            return (
              <Card
                key={rec.id}
                variant="bordered"
                padding="md"
                className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span
                    className="flex items-center justify-center w-10 h-10 rounded-xl shrink-0 text-xl"
                    style={{ backgroundColor: `${meta.color}15`, color: meta.color }}
                  >
                    {meta.icon}
                  </span>
                  <div className="min-w-0 space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 leading-snug">
                        {rec.title}
                      </h4>
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                        • {meta.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                      {rec.description}
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Save ~{rec.estimatedReduction} kg CO₂e/mo
                      </span>
                      <span className="text-slate-300 dark:text-slate-700 text-xs">•</span>
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        rec.difficulty === 'easy' ? 'text-emerald-500' : rec.difficulty === 'medium' ? 'text-amber-500' : 'text-red-500'
                      }`}>
                        {rec.difficulty}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="shrink-0 self-end sm:self-auto">
                  {isAdopted ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400">
                      <Check className="w-4 h-4" /> Added
                    </span>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddHabit(rec)}
                      disabled={loadingId !== null}
                    >
                      {loadingId === rec.id ? (
                        <span className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <span className="flex items-center gap-1">
                          <Plus className="w-3.5 h-3.5" /> Track Habit
                        </span>
                      )}
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}
