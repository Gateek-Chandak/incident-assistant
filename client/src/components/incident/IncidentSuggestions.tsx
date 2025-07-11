import { CheckSquare, Clock, AlertTriangle, Info, ListTodo } from "lucide-react";
import type { CategorizedSuggestions } from "../../hooks/useCategorizedSuggestions";
import { SuggestionCategory } from "./SuggestionCategory";

interface IncidentSuggestionsProps {
  categorizedSuggestions: CategorizedSuggestions;
  onNavigateToMessage: (messageId: string) => void;
}

/**
 * Component for the incident suggestions sidebar
 * Displays all categorized suggestions in accordion format
 */
export const IncidentSuggestions: React.FC<IncidentSuggestionsProps> = ({
  categorizedSuggestions,
  onNavigateToMessage
}) => {
  const categories = [
    {
      value: "action-items",
      title: "Action Items",
      icon: CheckSquare,
      iconColor: "text-blue-500",
      suggestions: categorizedSuggestions.actionItems,
      isFirst: true
    },
    {
      value: "root-cause-signals",
      title: "Root Cause Signals",
      icon: AlertTriangle,
      iconColor: "text-red-500",
      suggestions: categorizedSuggestions.rootCauseSignals
    },
    {
      value: "metadata-hints",
      title: "Metadata Hints",
      icon: Info,
      iconColor: "text-yellow-500",
      suggestions: categorizedSuggestions.metadataHints
    },
    {
      value: "timeline-events",
      title: "Timeline Events",
      icon: Clock,
      iconColor: "text-green-500",
      suggestions: categorizedSuggestions.timelineEvents
    },
    {
      value: "follow-ups",
      title: "Follow-up Tasks",
      icon: ListTodo,
      iconColor: "text-purple-500",
      suggestions: categorizedSuggestions.followUps,
      isLast: true
    }
  ];

  return (
    <div className="w-[40%] border-neutral-200 border-l p-4 overflow-y-scroll">
      <h1 className="text-lg text-center mb-4 font-medium text-gray-700">
        Incident Suggestions
      </h1>
      
      {categories.map((category) => (
        <SuggestionCategory
          key={category.value}
          value={category.value}
          title={category.title}
          icon={category.icon}
          iconColor={category.iconColor}
          suggestions={category.suggestions}
          onNavigateToMessage={onNavigateToMessage}
          isLast={category.isLast}
          isFirst={category.isFirst}
        />
      ))}
    </div>
  );
}; 