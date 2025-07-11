import { Button } from "@/components/ui/button";

interface SuggestionItemProps {
  id: string;
  time: string;
  suggestion: string;
  onNavigateToMessage: (messageId: string) => void;
}

/**
 * Component for rendering individual suggestion items
 * Displays timestamp, suggestion text, and navigation button
 */
export const SuggestionItem: React.FC<SuggestionItemProps> = ({
  id,
  time,
  suggestion,
  onNavigateToMessage
}) => {
  return (
    <div className="text-sm text-gray-700 mb-2 flex flex-col gap-0">
      <div className="text-xs text-gray-500">{time}</div>
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">{suggestion}</div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onNavigateToMessage(id)}
          className="text-xs px-2 py-1 h-auto"
        >
          Go to Message
        </Button>
      </div>
    </div>
  );
}; 