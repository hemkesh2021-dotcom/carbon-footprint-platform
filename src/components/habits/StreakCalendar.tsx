'use client';

/** @module StreakCalendar - Component or utility for StreakCalendar */


import { useMemo, useState } from 'react';
import type { Habit } from '@/types/habit';

interface StreakCalendarProps {
  habits: Habit[];
}

const WEEKS = 12;
const DAYS_IN_WEEK = 7;
const DAY_LABELS = ['', 'Mon', '', 'Wed', '', 'Fri', ''] as const;

const INTENSITY_COLORS = [
  'bg-slate-100 dark:bg-slate-700',          // 0 habits
  'bg-emerald-200 dark:bg-emerald-800',    // 1 habit
  'bg-emerald-400 dark:bg-emerald-600',    // 2 habits
  'bg-emerald-600 dark:bg-emerald-400',    // 3+ habits
] as const;

const LEGEND_ITEMS = [
  { label: '0', className: INTENSITY_COLORS[0] },
  { label: '1', className: INTENSITY_COLORS[1] },
  { label: '2', className: INTENSITY_COLORS[2] },
  { label: '3+', className: INTENSITY_COLORS[3] },
];

function getIntensityIndex(count: number): number {
  if (count === 0) return 0;
  if (count === 1) return 1;
  if (count === 2) return 2;
  return 3;
}

function formatDateDisplay(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

function toDateString(date: Date): string {
  return date.toISOString().split('T')[0];
}

interface DayData {
  date: Date;
  dateStr: string;
  count: number;
}

export function StreakCalendar({ habits }: StreakCalendarProps) {
  const [tooltipData, setTooltipData] = useState<{
    date: string;
    count: number;
    x: number;
    y: number;
  } | null>(null);

  // Build a map of date -> completion count from all habits
  const completionMap = useMemo(() => {
    const map = new Map<string, number>();
    for (const habit of habits) {
      if (!habit.completionHistory) continue;
      for (const dateStr of Object.keys(habit.completionHistory)) {
        if (habit.completionHistory[dateStr]) {
          map.set(dateStr, (map.get(dateStr) ?? 0) + 1);
        }
      }
    }
    return map;
  }, [habits]);

  // Generate grid data for last 12 weeks
  const { grid, monthLabels } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find the start date (12 weeks ago, aligned to Monday)
    const dayOfWeek = today.getDay();
    const daysToCurrentMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const currentMonday = new Date(today);
    currentMonday.setDate(today.getDate() - daysToCurrentMonday);

    const startDate = new Date(currentMonday);
    startDate.setDate(currentMonday.getDate() - (WEEKS - 1) * 7);

    const weeks: DayData[][] = [];
    const months: { label: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    for (let w = 0; w < WEEKS; w++) {
      const week: DayData[] = [];
      for (let d = 0; d < DAYS_IN_WEEK; d++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + w * 7 + d);
        const dateStr = toDateString(date);
        const count = completionMap.get(dateStr) ?? 0;

        // Only show days up to today
        const isFuture = date > today;
        week.push({
          date,
          dateStr,
          count: isFuture ? -1 : count,
        });

        // Track month boundaries
        const month = date.getMonth();
        if (month !== lastMonth && d === 0) {
          months.push({
            label: date.toLocaleDateString('en-US', { month: 'short' }),
            weekIndex: w,
          });
          lastMonth = month;
        }
      }
      weeks.push(week);
    }

    return { grid: weeks, monthLabels: months };
  }, [completionMap]);

  const handleMouseEnter = (
    day: DayData,
    event: React.MouseEvent<HTMLDivElement>,
  ) => {
    if (day.count < 0) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltipData({
      date: formatDateDisplay(day.date),
      count: day.count,
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    setTooltipData(null);
  };

  return (
    <section
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-800"
      aria-label="Habit streak calendar"
    >
      <h3 className="mb-4 text-lg font-semibold text-slate-900 dark:text-white">
        Activity Overview
      </h3>

      <div className="overflow-x-auto">
        <div className="inline-flex gap-1">
          {/* Day labels column */}
          <div className="flex flex-col gap-1 pr-2">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="flex h-3.5 w-6 items-center text-[10px] font-medium text-slate-500 dark:text-slate-400"
              >
                {label}
              </div>
            ))}
          </div>

          {/* Grid */}
          <div>
            {/* Month labels */}
            <div className="relative mb-1 flex gap-1" style={{ height: '14px' }}>
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] font-medium text-slate-500 dark:text-slate-400"
                  style={{ left: `${m.weekIndex * 18}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="flex gap-1">
              {grid.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1">
                  {week.map((day) => (
                    <div
                      key={day.dateStr}
                      className={`h-3.5 w-3.5 rounded-sm transition-colors ${
                        day.count < 0
                          ? 'bg-transparent'
                          : INTENSITY_COLORS[getIntensityIndex(day.count)]
                      }`}
                      onMouseEnter={(e) => handleMouseEnter(day, e)}
                      onMouseLeave={handleMouseLeave}
                      role="gridcell"
                      aria-label={
                        day.count >= 0
                          ? `${formatDateDisplay(day.date)}: ${day.count} habit${day.count !== 1 ? 's' : ''} completed`
                          : undefined
                      }
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">Less</span>
        {LEGEND_ITEMS.map((item) => (
          <div
            key={item.label}
            className={`h-3.5 w-3.5 rounded-sm ${item.className}`}
            title={`${item.label} habits completed`}
          />
        ))}
        <span className="text-xs text-slate-500 dark:text-slate-400">More</span>
      </div>

      {/* Tooltip (portal-free, fixed position) */}
      {tooltipData && (
        <div
          className="pointer-events-none fixed z-50 -translate-x-1/2 -translate-y-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-white shadow-lg dark:bg-slate-700"
          style={{
            left: tooltipData.x,
            top: tooltipData.y - 8,
          }}
        >
          <div className="font-medium">{tooltipData.date}</div>
          <div className="text-slate-300">
            {tooltipData.count} habit{tooltipData.count !== 1 ? 's' : ''} completed
          </div>
        </div>
      )}
    </section>
  );
}
