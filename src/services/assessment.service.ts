/** @module services/assessment - CRUD operations for carbon footprint assessments stored in localStorage. */

import type { AssessmentData } from '@/types';
import { storage } from './storage';

const STORAGE_KEY = 'assessments';

/** Retrieve all saved assessments from localStorage, ordered chronologically. */
export async function getAssessmentHistory(): Promise<AssessmentData[]> {
  const history = storage.get<AssessmentData[]>(STORAGE_KEY);
  return history || [];
}

/** Retrieve the most recent assessment, or null if none exist. */
export async function getLatestAssessment(): Promise<AssessmentData | null> {
  const history = await getAssessmentHistory();
  if (history.length === 0) return null;
  return history[history.length - 1] || null;
}

/**
 * Persist an assessment to localStorage.
 * @param assessment - Assessment data; `id` and `date` are auto-generated if omitted.
 */
export async function saveAssessment(
  assessment: Omit<AssessmentData, 'id' | 'date'> & { id?: string; date?: string }
): Promise<void> {
  const history = await getAssessmentHistory();
  const fullAssessment: AssessmentData = {
    ...assessment,
    id: assessment.id || crypto.randomUUID(),
    date: assessment.date || new Date().toISOString(),
  };

  // Replace if existing ID, otherwise append
  const existingIndex = history.findIndex((a) => a.id === fullAssessment.id);
  if (existingIndex > -1) {
    history[existingIndex] = fullAssessment;
  } else {
    history.push(fullAssessment);
  }

  storage.set(STORAGE_KEY, history);
}

/** Remove an assessment by its unique ID. */
export async function deleteAssessment(id: string): Promise<void> {
  const history = await getAssessmentHistory();
  const filtered = history.filter((a) => a.id !== id);
  storage.set(STORAGE_KEY, filtered);
}
