/**
 * @module utils/validation
 * @description Input validation, sanitization, and security helpers.
 */

/**
 * Sanitize user input strings to prevent basic XSS or HTML injection.
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<[^>]*>/g, '') // Strip HTML tags
    .trim();
}

/**
 * Clamp a number to a specific range (min, max).
 */
export function validateNumericRange(value: number, min: number, max: number): number {
  const num = Number(value);
  if (isNaN(num)) return min;
  return Math.min(Math.max(num, min), max);
}

/**
 * Check if a date string is valid and not in the future.
 */
export function isValidDate(dateStr: string): boolean {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return false;
  
  const now = new Date();
  return date <= now;
}

/**
 * Fallback UUID generator if crypto.randomUUID is not available.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  
  // Basic RFC4122 version 4 compliant fallback UUID generator
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
