import { useState } from 'react';
import type { CategorizedSuggestions } from './useCategorizedSuggestions';

export interface ReportData {
  report?: string;
  summary?: string;
  error?: string;
}

/**
 * Custom hook to manage report generation
 * Handles API calls, loading states, and modal visibility
 */
export const useReportGeneration = () => {
  const [showReportModal, setShowReportModal] = useState(false);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const [reportData, setReportData] = useState<ReportData | null>(null);

  const generateReport = async (
    categorizedSuggestions: CategorizedSuggestions,
    totalMessages: number,
    duration: string
  ): Promise<void> => {
    setShowReportModal(true);
    setIsGeneratingReport(true);
    setReportData(null);
    
    try {
      const response = await fetch("http://localhost:3000/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categorizedSuggestions,
          totalMessages,
          simulationData: {
            duration
          }
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      const data = await response.json();
      // console.log("response", data);
      setReportData(data);
    } catch (error) {
      console.error('Error generating report:', error);
      setReportData({ error: 'Failed to generate report. Please try again.' });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const closeModal = (): void => {
    setShowReportModal(false);
  };

  return {
    showReportModal,
    isGeneratingReport,
    reportData,
    generateReport,
    closeModal
  };
}; 