import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import type { LucideIcon } from "lucide-react";
import { SuggestionItem } from "./SuggestionItem";

interface SuggestionCategoryProps {
  value: string;
  title: string;
  icon: LucideIcon;
  iconColor: string;
  suggestions: Array<{ id: string; time: string; suggestion: string }>;
  onNavigateToMessage: (messageId: string) => void;
  isLast?: boolean;
  isFirst?: boolean;
}

/**
 * Component for rendering a category of suggestions
 * Displays accordion with icon, title, and list of suggestions
 */
export const SuggestionCategory: React.FC<SuggestionCategoryProps> = ({
  value,
  title,
  icon: Icon,
  iconColor,
  suggestions,
  onNavigateToMessage,
  isLast = false,
  isFirst = false
}) => {
  return (
    <Accordion type="single" collapsible defaultValue={value}>
      <AccordionItem value={value}>
        <AccordionTrigger 
          className={`text-sm font-normal text-black border p-4 hover:no-underline hover:text-gray-700 ${
            isLast ? 'data-[state=closed]:rounded-b-md rounded-none border-t-0' : isFirst ? 'data-[state=closed]:rounded-t-md border-t rounded-b-none' : 'rounded-none border-t-0'
          }`}
        >
          <div className="flex items-center gap-2">
            <Icon className={`h-4 w-4 ${iconColor}`} />
            {title}
          </div>
        </AccordionTrigger>
        <AccordionContent 
          className={`border-r border-l border-b p-4 ${
            isLast ? 'border-b border-t-0 rounded-b-md' : ''
          }`}
        >
          {suggestions.map((suggestion) => (
            <SuggestionItem
              key={suggestion.id}
              id={suggestion.id}
              time={suggestion.time}
              suggestion={suggestion.suggestion}
              onNavigateToMessage={onNavigateToMessage}
            />
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}; 