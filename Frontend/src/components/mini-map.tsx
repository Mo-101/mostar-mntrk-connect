import React from "react";

export function MiniMap() {
  return (
    <div className="container-panel h-60 top-0 bottom-20 p-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[#0af0ff] font-bold">Network Map</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-[#0af0ff]/60">Speed</span>
          <span className="text-sm font-mono">22 MB/s</span>
        </div>
      </div>

      <div className="relative h-[200px] bg-[#001a1a]/50 rounded-lg border border-[#0af0ff]/20">
        {/* Network visualization would go here */}
        <div className="absolute bottom-4 left-4">
          <div className="text-sm text-[#0af0ff]/60">Latency</div>
          <div className="text-lg font-mono">83 ms</div>
        </div>
      </div>
    </div>
  )
}

