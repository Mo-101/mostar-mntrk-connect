
import { Progress } from "@/components/ui/progress";

export function TrainingMetricsPanel() {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <MetricCard 
          label="Total Count" 
          value="346" 
          change="+2.4%" 
          changeColor="text-green-400"
        />
        <MetricCard 
          label="Avg. Density" 
          value="12.8/km²" 
          change="+0.8" 
          changeColor="text-green-400"
        />
      </div>

      <div className="bg-[#1C2333] p-3 rounded-md">
        <div className="flex justify-between items-center mb-1.5">
          <span className="text-sm text-gray-300">Habitat Coverage</span>
          <div className="flex items-center gap-1.5">
            <span className="text-base font-mono text-gray-200">68%</span>
            <span className="text-xs text-green-400">+3.2%</span>
          </div>
        </div>
        <Progress 
          value={68} 
          className="h-2 bg-[#0D1326]" 
          style={{
            "--progress-indicator-color": "#10B981" // green color
          } as React.CSSProperties}
        />
      </div>

      <div className="bg-[#1C2333] p-3 rounded-md">
        <div className="text-sm text-gray-300 mb-1.5">Last Observation</div>
        <div className="flex justify-between items-center">
          <div className="text-xs text-gray-400">Lagos, Nigeria</div>
          <div className="text-xs text-gray-400">Today, 14:32</div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-[#2A324B]">
        <div className="text-xs text-gray-400">
          Accuracy: 96.4%
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, change, changeColor }: { 
  label: string, 
  value: string, 
  change: string,
  changeColor: string
}) {
  return (
    <div className="bg-[#1C2333] p-3 rounded-md">
      <div className="text-xs text-gray-400 mb-1.5">{label}</div>
      <div className="flex items-baseline">
        <span className="text-base font-mono text-gray-200 mr-2">{value}</span>
        <span className={`text-xs ${changeColor}`}>{change}</span>
      </div>
    </div>
  );
}
