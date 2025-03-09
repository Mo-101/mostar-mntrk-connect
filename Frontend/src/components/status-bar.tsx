"use client"

import { Clock } from "lucide-react"
import { useState, useEffect } from "react"

export function StatusBar() {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center justify-between mb-4 glass-panel px-4 py-2">
      <div className="flex items-center gap-4">
        <span className="text-[#0af0ff] font-bold">AG.AI</span>
        <span className="text-[#0af0ff]/60">Controller</span>
        <span className="text-[#0af0ff]/60">Overview</span>
        <span className="text-[#0af0ff]/60">Models</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2">
          <span className="text-[#0af0ff]">Training Progress</span>
          <span className="text-[#06f7a1]">+12.2%</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0af0ff]" />
          <span>
            {time.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

