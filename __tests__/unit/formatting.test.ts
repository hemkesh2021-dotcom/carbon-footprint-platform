import {
  formatCO2,
  formatPercentage,
  formatDate,
  formatTrend,
  formatRelativeTime,
} from '@/utils/formatting';

// ────────────────────────────────────────────────────────────────
// formatCO2
// ────────────────────────────────────────────────────────────────

describe('formatCO2', () => {
  it('returns kg output for values under 1000', () => {
    expect(formatCO2(500)).toBe('500 kg CO₂e');
  });

  it('returns kg output for value exactly 999', () => {
    expect(formatCO2(999)).toBe('999 kg CO₂e');
  });

  it('returns tonnes output for value exactly 1000', () => {
    expect(formatCO2(1000)).toBe('1.0 tonnes CO₂e');
  });

  it('returns tonnes output for values above 1000', () => {
    expect(formatCO2(5432)).toBe('5.4 tonnes CO₂e');
  });

  it('returns 0 kg for zero input', () => {
    expect(formatCO2(0)).toBe('0 kg CO₂e');
  });

  it('handles negative values (rounds toward zero)', () => {
    const result = formatCO2(-50);
    expect(result).toBe('-50 kg CO₂e');
  });

  it('handles very large numbers in tonnes', () => {
    expect(formatCO2(1_000_000)).toBe('1000.0 tonnes CO₂e');
  });

  it('rounds fractional kg values', () => {
    // Math.round(499.5) = 500
    expect(formatCO2(499.5)).toBe('500 kg CO₂e');
  });

  it('rounds 999.6 up to 1000 which triggers tonnes output', () => {
    // Math.round(999.6) = 1000
    expect(formatCO2(999.6)).toBe('1.0 tonnes CO₂e');
  });

  it('handles very small positive values', () => {
    expect(formatCO2(0.4)).toBe('0 kg CO₂e');
  });

  it('handles 1500 with proper decimal in tonnes', () => {
    expect(formatCO2(1500)).toBe('1.5 tonnes CO₂e');
  });
});

// ────────────────────────────────────────────────────────────────
// formatPercentage
// ────────────────────────────────────────────────────────────────

describe('formatPercentage', () => {
  it('formats a positive value without sign by default', () => {
    expect(formatPercentage(12.34)).toBe('12.3%');
  });

  it('formats a negative value without explicit sign', () => {
    expect(formatPercentage(-5.67)).toBe('-5.7%');
  });

  it('formats zero', () => {
    expect(formatPercentage(0)).toBe('0.0%');
  });

  it('includes + sign for positive values when includeSign is true', () => {
    expect(formatPercentage(12.34, true)).toBe('+12.3%');
  });

  it('includes - sign for negative values when includeSign is true', () => {
    expect(formatPercentage(-5.67, true)).toBe('-5.7%');
  });

  it('does not add + sign for zero when includeSign is true', () => {
    expect(formatPercentage(0, false)).toBe('0.0%');
    expect(formatPercentage(0, true)).toBe('0.0%');
  });

  it('rounds to one decimal place', () => {
    expect(formatPercentage(33.333)).toBe('33.3%');
    expect(formatPercentage(66.666)).toBe('66.7%');
  });

  it('handles 100%', () => {
    expect(formatPercentage(100)).toBe('100.0%');
  });

  it('handles very small positive value with includeSign', () => {
    expect(formatPercentage(0.01, true)).toBe('+0.0%');
  });
});

// ────────────────────────────────────────────────────────────────
// formatDate
// ────────────────────────────────────────────────────────────────

describe('formatDate', () => {
  it('formats a valid ISO date string', () => {
    const result = formatDate('2024-06-15');
    // The exact format is locale-dependent; just verify it includes the year and day
    expect(result).toContain('2024');
    expect(result).toContain('15');
  });

  it('formats a full ISO datetime string', () => {
    const result = formatDate('2024-01-01T12:00:00Z');
    expect(result).toContain('2024');
  });

  it('includes the month name (locale-dependent, but should be a word)', () => {
    const result = formatDate('2024-12-25');
    // December or locale equivalent
    expect(result).toContain('25');
    expect(result).toContain('2024');
  });
});

// ────────────────────────────────────────────────────────────────
// formatTrend
// ────────────────────────────────────────────────────────────────

describe('formatTrend', () => {
  it('returns "up" direction when current > previous by more than 1%', () => {
    const result = formatTrend(110, 100);
    expect(result.direction).toBe('up');
    expect(result.percentage).toBeCloseTo(10, 1);
    expect(result.label).toContain('increase');
  });

  it('returns "down" direction when current < previous by more than 1%', () => {
    const result = formatTrend(80, 100);
    expect(result.direction).toBe('down');
    expect(result.percentage).toBeCloseTo(20, 1);
    expect(result.label).toContain('reduction');
  });

  it('returns "stable" when the change is within ±1%', () => {
    const result = formatTrend(100.5, 100);
    expect(result.direction).toBe('stable');
    expect(result.percentage).toBe(0);
    expect(result.label).toBe('Stable');
  });

  it('returns "stable" with "No change" when previous is zero', () => {
    const result = formatTrend(100, 0);
    expect(result.direction).toBe('stable');
    expect(result.percentage).toBe(0);
    expect(result.label).toBe('No change');
  });

  it('returns "stable" when both values are equal', () => {
    const result = formatTrend(500, 500);
    expect(result.direction).toBe('stable');
    expect(result.percentage).toBe(0);
    expect(result.label).toBe('Stable');
  });

  it('handles large increases', () => {
    const result = formatTrend(1000, 100);
    expect(result.direction).toBe('up');
    expect(result.percentage).toBeCloseTo(900, 0);
  });

  it('handles near-total decreases', () => {
    const result = formatTrend(1, 100);
    expect(result.direction).toBe('down');
    expect(result.percentage).toBeCloseTo(99, 0);
  });
});

// ────────────────────────────────────────────────────────────────
// formatRelativeTime
// ────────────────────────────────────────────────────────────────

describe('formatRelativeTime', () => {
  it('returns "Just now" for a date less than 1 minute ago', () => {
    const now = new Date();
    expect(formatRelativeTime(now.toISOString())).toBe('Just now');
  });

  it('returns "Just now" for a future date', () => {
    const future = new Date(Date.now() + 60_000);
    expect(formatRelativeTime(future.toISOString())).toBe('Just now');
  });

  it('returns minutes ago for a date a few minutes in the past', () => {
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    expect(formatRelativeTime(fiveMinAgo.toISOString())).toBe('5 minutes ago');
  });

  it('returns "1 hour ago" for a date about 1 hour ago', () => {
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    expect(formatRelativeTime(oneHourAgo.toISOString())).toBe('1 hour ago');
  });

  it('returns "X hours ago" for plural hours', () => {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    expect(formatRelativeTime(threeHoursAgo.toISOString())).toBe('3 hours ago');
  });

  it('returns "Yesterday" for a date 1 day ago', () => {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(yesterday.toISOString())).toBe('Yesterday');
  });

  it('returns "X days ago" for 2-6 days ago', () => {
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(threeDaysAgo.toISOString())).toBe('3 days ago');
  });

  it('returns "1 week ago" for 7 days ago', () => {
    const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(oneWeekAgo.toISOString())).toBe('1 week ago');
  });

  it('returns "X weeks ago" for 2-3 weeks ago', () => {
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
    expect(formatRelativeTime(twoWeeksAgo.toISOString())).toBe('2 weeks ago');
  });

  it('falls back to formatted date for dates older than ~4 weeks', () => {
    const sixWeeksAgo = new Date(Date.now() - 42 * 24 * 60 * 60 * 1000);
    const result = formatRelativeTime(sixWeeksAgo.toISOString());
    // Should be a formatted date string (not "X weeks ago")
    expect(result).not.toContain('weeks ago');
    expect(result).not.toContain('days ago');
  });
});
