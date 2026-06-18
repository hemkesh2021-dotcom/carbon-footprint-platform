export * from './common';
export * from './assessment';
export * from './recommendation';
export * from './habit';
export * from './goal';

// Alias for ease of use across hooks/services
import type { AssessmentData } from './assessment';
export type Assessment = AssessmentData;
