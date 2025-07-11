import { Button } from "@/components/ui/button";
import { Loader2, CheckSquare, Clock, AlertTriangle, Info, ListTodo } from "lucide-react";
import type { ReportData } from "../../hooks/useReportGeneration";
import type { CategorizedSuggestions } from "../../hooks/useCategorizedSuggestions";

interface ReportModalProps {
  isOpen: boolean;
  isGenerating: boolean;
  reportData: ReportData | null;
  categorizedSuggestions: CategorizedSuggestions;
  totalMessages: number;
  duration: string;
  onClose: () => void;
}

/**
 * Modal component for displaying incident reports
 * Shows loading states, error handling, and formatted report data
 */
export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  isGenerating,
  reportData,
  categorizedSuggestions,
  totalMessages,
  duration,
  onClose
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-3xl w-full mx-4 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-center">Incident Report</h2>
            <div className="flex justify-between items-center mb-4">
            <Button 
                variant="ghost" 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700"
            >
                ✕
            </Button>
            </div>
        </div>
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
            <p className="text-gray-600">Generating incident report...</p>
          </div>
        ) : reportData ? (
          <div className="space-y-4">
            {reportData.error ? (
              <div className="text-red-600 p-4 bg-red-50 rounded-lg">
                {reportData.error}
              </div>
            ) : (
              <div className="space-y-4">
                {/* Statistics Grid */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-700">Total Messages</div>
                    <div className="text-2xl font-normal text-black">{totalMessages}</div>
                  </div>
                  <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="font-medium text-gray-700">Simulation Duration</div>
                    <div className="text-2xl font-normal text-black">{duration}</div>
                  </div>
                </div>
                
                {/* Suggestions Summary */}
                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-800">Suggestions Summary</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <CheckSquare className="h-4 w-4 text-blue-500" />
                      <span>Action Items: {categorizedSuggestions.actionItems.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-500" />
                      <span>Timeline Events: {categorizedSuggestions.timelineEvents.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      <span>Root Cause Signals: {categorizedSuggestions.rootCauseSignals.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-yellow-500" />
                      <span>Metadata Hints: {categorizedSuggestions.metadataHints.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <ListTodo className="h-4 w-4 text-purple-500" />
                      <span>Follow-ups: {categorizedSuggestions.followUps.length}</span>
                    </div>
                  </div>
                </div>
                
                {/* Generated Report */}
                {reportData.report && (
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Generated Report</h4>
                    <pre className="text-sm text-blue-700 whitespace-pre-wrap">{reportData.report}</pre>
                  </div>
                )}
                
                {/* Incident Summary */}
                {reportData.summary && (
                  <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                    <div className="text-sm text-black whitespace-pre-wrap prose prose-sm max-w-none">
                      {reportData.summary
                        .replace(/```markdown\n|\n```/g, '')
                        .replaceAll("#", "")
                        .replaceAll("*", "")}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-red-600 p-4 bg-red-50 rounded-lg">
            No report data available.
          </div>
        )}
      </div>
    </div>
  );
}; 