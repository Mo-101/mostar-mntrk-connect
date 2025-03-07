
import { useState } from 'react';

interface TrainingProgressProps {
  currentEpoch: number;
  totalEpochs: number;
  accuracy: number;
  loss: number;
}

export function TrainingProgress({ currentEpoch, totalEpochs, accuracy, loss }: TrainingProgressProps) {
  return (
    <>
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progress</span>
          <span>{currentEpoch} / {totalEpochs} epochs</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentEpoch / totalEpochs) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-[#262E45] p-3 rounded-md">
          <div className="text-xs text-gray-400 mb-1">Accuracy</div>
          <div className="text-lg font-bold text-gray-200">{accuracy.toFixed(2)}%</div>
        </div>
        <div className="bg-[#262E45] p-3 rounded-md">
          <div className="text-xs text-gray-400 mb-1">Loss</div>
          <div className="text-lg font-bold text-gray-200">{loss.toFixed(4)}</div>
        </div>
      </div>
    </>
  );
}
