import { Cpu, MemoryStickIcon as Memory, HardDrive, Activity } from "lucide-react"
import { cn } from "@/lib/utils"

const metrics = [
  { icon: Cpu, label: "CPU", value: "45%" },
  { icon: Memory, label: "RAM", value: "60%" },
  { icon: HardDrive, label: "Storage", value: "75%" },
  { icon: Activity, label: "Network", value: "32 Mbps" },
]

export function FooterMetrics() {
  return (
    <div className="grid grid-cols-4 gap-4 mb-4">
      {metrics.map((metric) => (
        <div
          key={metric.label}
          className={cn(
            "relative bg-[#001a1a] border border-[#0af0ff]/20 rounded-lg p-3",
            "before:absolute before:inset-0 before:bg-[#0af0ff]/5",
            "after:absolute after:inset-0 after:bg-gradient-to-b after:from-[#0af0ff]/10 after:to-transparent",
            "shadow-[0_0_15px_rgba(10,240,255,0.1)]",
            "flex items-center justify-between",
          )}
        >
          <div className="flex items-center">
            <metric.icon className="w-5 h-5 text-[#0af0ff] mr-2 animate-pulse" />
            <span className="text-sm text-[#0af0ff]">{metric.label}</span>
          </div>
          <span className="text-sm font-bold text-white">{metric.value}</span>
        </div>
      ))}
    </div>
  )
}

