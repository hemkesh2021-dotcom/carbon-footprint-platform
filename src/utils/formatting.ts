/**
 * @module utils/formatting
 * @description formatting utilities for numbers, percentages, dates, and carbon footprint trends.
 */

/**
 * Format carbon emissions value in kg or tonnes of CO₂e.
 */
export function formatCO2(kg: number): string {
  const rounded = Math.round(kg);
  if (rounded >= 1000) {
    const tonnes = (rounded / 1000).toFixed(1);
    return `${tonnes} tonnes CO₂e`;
  }
  return `${rounded.toLocaleString()} kg CO₂e`;
}

/**
 * Format percentage values (e.g. 12.3% or -5.0%).
 */
export function formatPercentage(value: number, includeSign = false): string {
  const rounded = value.toFixed(1);
  const sign = includeSign && value > 0 ? '+' : '';
  return `${sign}${rounded}%`;
}

/**
 * Format ISO date string to a localized human-readable date.
 */
export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Compute trend statistics between two values.
 */
export function formatTrend(
  current: number,
  previous: number
): { direction: 'up' | 'down' | 'stable'; percentage: number; label: string } {
  if (previous === 0) {
    return { direction: 'stable', percentage: 0, label: 'No change' };
  }

  const diff = current - previous;
  const percentage = (diff / previous) * 100;
  
  // Neutral range: within +/- 1%
  if (Math.abs(percentage) < 1) {
    return { direction: 'stable', percentage: 0, label: 'Stable' };
  }

  if (diff > 0) {
    return {
      direction: 'up',
      percentage,
      label: `${formatPercentage(percentage)} increase`,
    };
  } else {
    return {
      direction: 'down',
      percentage: Math.abs(percentage),
      label: `${formatPercentage(Math.abs(percentage))}% reduction`,
    };
  }
}

/**
 * Format relative time (e.g., "3 days ago").
 */
export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  
  if (diffMs < 0) return 'Just now';
  
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) {
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHours === 0) {
      const diffMins = Math.floor(diffMs / (1000 * 60));
      return diffMins <= 1 ? 'Just now' : `${diffMins} minutes ago`;
    }
    return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  }
  
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  
  const diffWeeks = Math.floor(diffDays / 7);
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`;
  
  return formatDate(dateStr);
}
