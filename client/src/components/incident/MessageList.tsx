import { CheckSquare, Clock, AlertTriangle, Info, ListTodo } from "lucide-react";
import type { Message } from "../../types/incident";
import { useAutoScroll } from "../../hooks/useAutoScroll";

interface MessageListProps {
  messages: Message[];
}

/**
 * Component for rendering individual message type icons
 */
const MessageTypeIcon: React.FC<{ type: string }> = ({ type }) => {
  switch (type) {
    case "Action_Item":
      return <CheckSquare className="h-5 w-5 text-blue-500" />;
    case "Timeline_Event":
      return <Clock className="h-5 w-5 text-green-500" />;
    case "Root_Cause_Signal":
      return <AlertTriangle className="h-5 w-5 text-red-500" />;
    case "Metadata_Hint":
      return <Info className="h-5 w-5 text-yellow-500" />;
    case "Follow_Up":
      return <ListTodo className="h-5 w-5 text-purple-500" />;
    default:
      return null;
  }
};

/**
 * Component for rendering individual message items
 */
const MessageItem: React.FC<{ message: Message }> = ({ message }) => (
  <div id={message.id} className="p-4 mb-2 border rounded-lg bg-background">
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-neutral-50 border flex items-center justify-center text-black text-sm font-medium">
        {message.speaker.charAt(0).toUpperCase()}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium text-gray-900">{message.speaker}</div>
          <div className="text-gray-500 text-xs">{message.time}</div>
        </div>
        <div className="text-gray-700 mt-1">{message.text}</div>
        
        {/* Loading indicator */}
        {message.isLoading && (
          <div className="mt-3 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
              Waiting for response...
            </div>
          </div>
        )}
        
        {/* API Response */}
        {message.response && !message.isLoading && message.response.suggestion !== "No Suggestion" && (
          <div className="mt-3 p-3 bg-gray-50 rounded border relative flex flex-row-reverse gap-2">
            <div className="w-full flex flex-col justify-center items-start gap-1">
              <h1 className="text-[14.5px] text-gray-600 whitespace-pre-wrap pr-8">
                {message.response.suggestion}
              </h1>
            </div>
            {/* Type Icon */}
            <div className="w-fit h-full flex flex-col justify-center items-center">
              <MessageTypeIcon type={message.type} />
            </div>
          </div>
        )}
      </div>
    </div>
  </div>
);

/**
 * Component for displaying the list of incident messages
 * Handles the rendering of all messages in the simulation
 */
export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const containerRef = useAutoScroll(messages);

  return (
    <div ref={containerRef} className="flex-1 overflow-y-auto p-4 min-h-0 pb-10">
        {messages.length > 0 &&
        <h1 className="text-lg text-center mb-4 font-medium text-gray-700">
            Message List
        </h1>}
        {messages.map((message) => (
            <MessageItem key={message.id} message={message} />
        ))}
    </div>
  );
}; 