import React from "react"
import { cn } from "../lib/utils"

interface DataMetricProps {
  id: string
  value: string
  subValue: string
  status?: "default" | "success" | "error"
  className?: string
}

export function DataMetric({ id, value, subValue, status = "default", className }: DataMetricProps) {
  const statusColors = {
    default: "bg-[#0af0ff]",
    success: "bg-[#06f7a1]",
    error: "bg-red-500",
  }

  return (
    <div
      className={cn(
        "relative bg-[#001a1a] border border-[#0af0ff]/20",
        "before:absolute before:inset-0 before:bg-[#0af0ff]/5",
        "after:absolute after:inset-0 after:bg-gradient-to-b after:from-[#0af0ff]/10 after:to-transparent",
        "shadow-[0_0_15px_rgba(10,240,255,0.1)]",
        className,
      )}
    >
      <div className="relative z-10 p-4">
        <div className="flex justify-between items-center mb-2">
          <span className="font-mono text-sm">{id}</span>
          <div className={cn("h-2 w-2 rounded-full animate-pulse", statusColors[status])} />
        </div>
        <div className="space-y-1">
          <p className="font-mono text-xl tracking-wider">{value}</p>
          <p className="font-mono text-xs text-white/50">{subValue}</p>
        </div>
      </div>
    </div>
  )
}

