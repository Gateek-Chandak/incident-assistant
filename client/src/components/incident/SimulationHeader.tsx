import { Button } from "@/components/ui/button";
import { PlayIcon, FileText, Loader, Clock } from "lucide-react";

interface SimulationHeaderProps {
  title: string;
  elapsedTime: number;
  formatTime: (seconds: number) => string;
  isPlaying: boolean;
  isFinished: boolean;
  onSimulateIncident: () => void;
  onGenerateReport: () => void;
}

/**
 * Header component for the incident simulation
 * Displays title, elapsed time, and control buttons
 */
export const SimulationHeader: React.FC<SimulationHeaderProps> = ({
  title,
  elapsedTime,
  formatTime,
  isPlaying,
  isFinished,
  onSimulateIncident,
  onGenerateReport
}) => {
  return (
    <div className="w-full bg-background border-b border-neutral-200 py-4 flex flex-row justify-between items-center px-4">
      <h1 className="w-fit whitespace-nowrap ml-0 text-center text-2xl tracking-wider font-medium">
        {title}
      </h1>
      
      {/* Elapsed Time Display */}
      {(isPlaying || isFinished) && (
        <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg">
          <Clock className="h-4 w-4 text-gray-600" />
          <span className="text-sm font-medium text-gray-700">
            {formatTime(elapsedTime)}
          </span>
        </div>
      )}
      
      {/* Control Buttons */}
      <div className="w-fit flex flex-row gap-2">
        <Button 
          onClick={onGenerateReport} 
          disabled={!isFinished}
          className={!isFinished ? "opacity-50" : ""}
        >
          Generate Report
          <FileText className="ml-2" />
        </Button>
        <Button 
          onClick={onSimulateIncident} 
          disabled={isPlaying}
          className={isPlaying ? "opacity-50" : ""}
        >
          {isPlaying ? "Simulating..." : "Simulate Incident"}
          {!isPlaying ? <PlayIcon className="ml-2" /> : <Loader className="ml-2" />}
        </Button>
      </div>
    </div>
  );
}; 