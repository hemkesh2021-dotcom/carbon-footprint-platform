/**
 * @module services/storage
 * @description SSR-safe, type-safe wrapper for localStorage operations.
 */

const KEY_PREFIX = 'cfp_';

export const storage = {
  /**
   * Retrieve an item from localStorage
   */
  get<T>(key: string): T | null {
    if (typeof window === 'undefined') return null;
    try {
      const value = localStorage.getItem(`${KEY_PREFIX}${key}`);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Error reading key "${key}" from localStorage:`, error);
      return null;
    }
  },

  /**
   * Save an item to localStorage
   */
  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(`${KEY_PREFIX}${key}`, JSON.stringify(value));
    } catch (error) {
      console.error(`Error writing key "${key}" to localStorage:`, error);
    }
  },

  /**
   * Remove an item from localStorage
   */
  remove(key: string): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(`${KEY_PREFIX}${key}`);
    } catch (error) {
      console.error(`Error removing key "${key}" from localStorage:`, error);
    }
  },

  /**
   * Clear all items starting with our prefix
   */
  clear(): void {
    if (typeof window === 'undefined') return;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  },
};
