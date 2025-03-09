
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';

interface TrainingMetric {
  epoch: number;
  accuracy: number;
  loss: number;
  val_accuracy: number;
  val_loss: number;
}

interface TrainingMetricsDisplayProps {
  metrics: TrainingMetric[];
}

const TrainingMetricsDisplay: React.FC<TrainingMetricsDisplayProps> = ({ metrics }) => {
  if (!metrics || metrics.length === 0) {
    return (
      <div className="flex justify-center items-center h-60 bg-gray-900/50 rounded-lg border border-gray-800">
        <p className="text-gray-400">No training metrics available yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900/50 p-3 rounded-lg border border-gray-800">
      <h3 className="text-white text-sm font-medium mb-3">Training Progress Metrics</h3>
      
      <div className="h-60">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={metrics}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <defs>
              <linearGradient id="colorAccuracy" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ff5555" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ff5555" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorValAcc" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#82ca9d" stopOpacity={0.2}/>
              </linearGradient>
              <linearGradient id="colorValLoss" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ffc658" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ffc658" stopOpacity={0.2}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis 
              dataKey="epoch" 
              tick={{ fill: '#999' }} 
              stroke="#666" 
              label={{ value: 'Epochs', position: 'insideBottom', offset: -5, fill: '#999', fontSize: 12 }}
            />
            <YAxis tick={{ fill: '#999' }} stroke="#666" />
            <Tooltip 
              contentStyle={{ backgroundColor: '#333', borderColor: '#666', borderRadius: '4px' }}
              labelStyle={{ color: '#ccc' }}
              itemStyle={{ color: '#fff' }}
            />
            <Legend />
            <Area 
              type="monotone" 
              dataKey="accuracy" 
              stroke="#8884d8" 
              fillOpacity={1} 
              fill="url(#colorAccuracy)" 
              name="Accuracy"
            />
            <Area 
              type="monotone" 
              dataKey="loss" 
              stroke="#ff5555" 
              fillOpacity={1} 
              fill="url(#colorLoss)" 
              name="Loss"
            />
            <Area 
              type="monotone" 
              dataKey="val_accuracy" 
              stroke="#82ca9d" 
              fillOpacity={1} 
              fill="url(#colorValAcc)" 
              name="Val Accuracy"
            />
            <Area 
              type="monotone" 
              dataKey="val_loss" 
              stroke="#ffc658" 
              fillOpacity={1} 
              fill="url(#colorValLoss)" 
              name="Val Loss"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-2 gap-2 mt-3">
        <div className="bg-gray-800/70 rounded p-2">
          <h4 className="text-xs text-gray-400 mb-1">Current Accuracy</h4>
          <p className="text-lg font-medium text-green-400">
            {metrics[metrics.length - 1]?.accuracy.toFixed(4) || '0.0000'}
          </p>
        </div>
        <div className="bg-gray-800/70 rounded p-2">
          <h4 className="text-xs text-gray-400 mb-1">Current Loss</h4>
          <p className="text-lg font-medium text-red-400">
            {metrics[metrics.length - 1]?.loss.toFixed(4) || '0.0000'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TrainingMetricsDisplay;
