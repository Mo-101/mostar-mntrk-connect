import { Progress } from "./ui/progress";
import React from "react";

export function AgentStatus() {
  return (
    <div className="container-panel p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#0af0ff] font-bold">Agent Status</h3>
        <div className="text-sm text-[#0af0ff]/60">MNTRK-API-AGENT</div>
      </div>
      <div className="p-3 border border-[#0af0ff]/20 rounded-lg space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">Battery</span>
            <div className="flex items-center gap-2">
              <span className="text-sm">50%</span>
              <span className="text-xs text-[#0af0ff]/60">27°C</span>
            </div>
          </div>
          <Progress value={50} className="h-1" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">Memory</span>
            <span className="text-sm">2653/4356 MB</span>
          </div>
          <Progress value={75} className="h-1" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">CPU Load</span>
            <span className="text-sm">35%</span>
          </div>
          <Progress value={35} className="h-1" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="p-2 border border-[#0af0ff]/20 rounded">
          <div className="text-xs text-[#0af0ff]/60">Altitude limited</div>
          <div className="text-sm font-mono">120 ML</div>
        </div>
        <div className="p-2 border border-[#0af0ff]/20 rounded">
          <div className="text-xs text-[#0af0ff]/60">Resolution px</div>
          <div className="text-sm font-mono">1920x1080</div>
        </div>
      </div>
    </div>
  )
}

