import type { AssessmentData } from '@/types';
import { storage } from './storage';

const STORAGE_KEY = 'assessments';

export async function getAssessmentHistory(): Promise<AssessmentData[]> {
  const history = storage.get<AssessmentData[]>(STORAGE_KEY);
  return history || [];
}

export async function getLatestAssessment(): Promise<AssessmentData | null> {
  const history = await getAssessmentHistory();
  if (history.length === 0) return null;
  return history[history.length - 1] || null;
}

export async function saveAssessment(
  assessment: Omit<AssessmentData, 'id' | 'date'> & { id?: string; date?: string }
): Promise<void> {
  const history = await getAssessmentHistory();
  


  const fullAssessment: AssessmentData = {
    ...assessment,
    id: assessment.id || crypto.randomUUID(),
    date: assessment.date || new Date().toISOString(),
    // We attach the calculated result to the object or save it inside the object
    // Wait, does AssessmentData type in types/assessment.ts have result?
    // Let's check: AssessmentData has transport, energy, food, shopping, waste, travel.
    // Wait, the result itself is not a field in AssessmentData interface!
    // But we can store it as part of a list of saved results or attach it as a separate key in local storage.
    // Actually, we can either re-calculate on read, or we can save an array of assessments,
    // and if needed, we can also store the result or calculate it.
    // Wait! Let's check if the AssessmentData type has any result field.
    // No, in types/assessment.ts:
    // export interface AssessmentData { id: string; date: string; transport: TransportData; ... }
    // It doesn't have a result field. But that's fine! The calculator engine is so fast
    // that we can calculate the result on the fly whenever we load, OR we can store the result
    // on the object anyway (in JS/TS we can cast or add it, but let's stick to the clean AssessmentData type).
    // Let's look at getAssessmentHistory. It returns AssessmentData[].
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

export async function deleteAssessment(id: string): Promise<void> {
  const history = await getAssessmentHistory();
  const filtered = history.filter((a) => a.id !== id);
  storage.set(STORAGE_KEY, filtered);
}
