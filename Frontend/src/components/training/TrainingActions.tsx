
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

interface TrainingActionsProps {
  isTraining: boolean;
  onStartTraining: () => void;
  onPauseTraining: () => void;
  onResetTraining: () => void;
}

export function TrainingActions({ 
  isTraining, 
  onStartTraining, 
  onPauseTraining, 
  onResetTraining 
}: TrainingActionsProps) {
  return (
    <>
      <div className="flex space-x-2">
        {!isTraining ? (
          <button 
            onClick={onStartTraining}
            className="flex items-center justify-center bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md flex-1 transition-colors"
          >
            <Play className="w-4 h-4 mr-2" />
            Start Training
          </button>
        ) : (
          <button 
            onClick={onPauseTraining}
            className="flex items-center justify-center bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md flex-1 transition-colors"
          >
            <Pause className="w-4 h-4 mr-2" />
            Pause
          </button>
        )}
        
        <button 
          onClick={onResetTraining}
          className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-md"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
      
      <button className="mt-4 w-full flex items-center justify-between text-xs bg-[#262E45] hover:bg-[#303A57] text-gray-300 p-2 rounded transition-colors">
        <span>View Detailed Training Metrics</span>
        <ChevronRight className="w-4 h-4" />
      </button>
    </>
  );
}
