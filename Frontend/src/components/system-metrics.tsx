import { Cpu, MemoryStick, HardDrive } from "lucide-react"
import React from "react"
import { Progress } from "@/components/ui/progress";

export function SystemMetrics() {
  const metrics = [
    { icon: Cpu, label: "CPU Usage", value: 45 },
    { icon: MemoryStick, label: "Memory Usage", value: 60 },
    { icon: HardDrive, label: "Storage Usage", value: 75 },
  ]

  return (
    <div className="bg-[#001a1a] border border-[#0af0ff]/20 rounded-lg p-4 flex flex-col h-full">
      <h3 className="text-[#0af0ff] font-bold text-lg mb-4">System Metrics</h3>
      <div className="space-y-4 flex-grow">
        {metrics.map((metric) => (
          <div key={metric.label} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <metric.icon className="w-4 h-4 text-[#0af0ff]" />
                <span className="text-sm text-[#0af0ff]/60">{metric.label}</span>
              </div>
              <span className="text-sm font-mono">{metric.value}%</span>
            </div>
            <Progress value={metric.value} className="h-1" />
          </div>
        ))}
      </div>
    </div>
  )
}

