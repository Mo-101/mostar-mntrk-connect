
import { Cpu, MemoryStick, HardDrive } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export function SystemMetricsPanel() {
  const metrics = [
    { icon: Cpu, label: "CPU Usage", value: 45 },
    { icon: MemoryStick, label: "Memory Usage", value: 66 },
    { icon: HardDrive, label: "Storage Usage", value: 75 },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base font-medium text-gray-200">System Resources</h3>
        <div className="bg-[#1C2333]/80 text-xs font-medium text-gray-300 px-2 py-1 rounded-sm">ACTIVE</div>
      </div>
      
      {metrics.map((metric) => (
        <div key={metric.label} className="space-y-1.5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <metric.icon className="w-4 h-4 text-[#3B82F6]" />
              <span className="text-sm text-gray-300">{metric.label}</span>
            </div>
            <span className="text-sm font-mono text-gray-200">{metric.value}%</span>
          </div>
          <Progress 
            value={metric.value} 
            className="h-2 bg-[#1C2333]" 
            style={{
              "--progress-indicator-color": getColorClass(metric.value)
            } as React.CSSProperties}
          />
        </div>
      ))}
      
      <div className="mt-4 pt-4 border-t border-[#2A324B]">
        <div className="text-xs text-gray-400">
          Last updated: {new Date().toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}

function getColorClass(value: number): string {
  if (value < 50) return "#3B82F6"; // blue
  if (value < 80) return "#EAB308"; // yellow
  return "#EF4444"; // red
}
