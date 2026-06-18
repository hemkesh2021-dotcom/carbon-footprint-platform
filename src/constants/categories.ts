/**
 * @module constants/categories
 * @description Metadata for each emission category — labels, icons, colours, descriptions.
 */

import type { EmissionCategory } from '@/types/common';

/** Visual and descriptive metadata for a single emission category. */
export interface CategoryMeta {
  /** The category key. */
  key: EmissionCategory;
  /** Human-readable label. */
  label: string;
  /** Emoji icon. */
  icon: string;
  /** Brand colour in hex. */
  color: string;
  /** Short description shown in the UI. */
  description: string;
}

/**
 * Metadata for every emission category.
 * Indexed by EmissionCategory for constant-time lookups.
 */
export const CATEGORY_META: Readonly<Record<EmissionCategory, CategoryMeta>> = {
  transport: {
    key: 'transport',
    label: 'Transport',
    icon: '🚗',
    color: '#3B82F6',
    description:
      'Emissions from daily commuting, driving, and local public transport usage.',
  },
  energy: {
    key: 'energy',
    label: 'Energy',
    icon: '⚡',
    color: '#F59E0B',
    description:
      'Emissions from household electricity, natural gas, and heating or cooling.',
  },
  food: {
    key: 'food',
    label: 'Food',
    icon: '🍽️',
    color: '#10B981',
    description:
      'Emissions from your diet, food sourcing, and food waste habits.',
  },
  shopping: {
    key: 'shopping',
    label: 'Shopping',
    icon: '🛍️',
    color: '#8B5CF6',
    description:
      'Emissions from purchasing clothing, electronics, and consumer goods.',
  },
  waste: {
    key: 'waste',
    label: 'Waste',
    icon: '♻️',
    color: '#EF4444',
    description:
      'Emissions from waste disposal, recycling, composting, and plastic usage.',
  },
  travel: {
    key: 'travel',
    label: 'Travel',
    icon: '✈️',
    color: '#EC4899',
    description:
      'Emissions from flights, long-distance travel, and business trips.',
  },
} as const;

/** Ordered list of categories for consistent rendering. */
export const CATEGORY_ORDER: readonly EmissionCategory[] = [
  'transport',
  'energy',
  'food',
  'shopping',
  'waste',
  'travel',
] as const;
