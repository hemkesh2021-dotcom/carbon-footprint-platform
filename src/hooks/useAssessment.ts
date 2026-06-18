'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Assessment } from '@/types';
import * as assessmentService from '@/services/assessment.service';

interface UseAssessmentReturn {
  latestAssessment: Assessment | null;
  assessmentHistory: Assessment[];
  saveAssessment: (assessment: Assessment) => Promise<void>;
  deleteAssessment: (id: string) => Promise<void>;
  isLoading: boolean;
}

export function useAssessment(): UseAssessmentReturn {
  const [assessmentHistory, setAssessmentHistory] = useState<Assessment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadAssessments = useCallback(async () => {
    setIsLoading(true);
    try {
      const history = await assessmentService.getAssessmentHistory();
      setAssessmentHistory(history);
    } catch (error) {
      console.error('Failed to load assessments:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadAssessments();
  }, [loadAssessments]);

  const latestAssessment: Assessment | null =
    assessmentHistory.length > 0
      ? assessmentHistory[assessmentHistory.length - 1]
      : null;

  const saveAssessment = useCallback(
    async (assessment: Assessment) => {
      await assessmentService.saveAssessment(assessment);
      await loadAssessments();
    },
    [loadAssessments],
  );

  const deleteAssessment = useCallback(
    async (id: string) => {
      await assessmentService.deleteAssessment(id);
      await loadAssessments();
    },
    [loadAssessments],
  );

  return {
    latestAssessment,
    assessmentHistory,
    saveAssessment,
    deleteAssessment,
    isLoading,
  };
}
