import React from "react"
import { CesiumMap } from "./cesium-map"
import { TrainingControls } from "./training-controls"

export function AITrainingView() {
  return (
    <div className="container-panel h-[calc(100vh-60rem)] relative flex-grow">
      <div className="absolute top-4 left-4 z-10 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-[#06f7a1] rounded-full animate-pulse" />
          <span className="text-sm text-[#0af0ff]">HDR</span>
        </div>
        <div className="text-2xl font-bold">AI Training View</div>
        <div className="text-[#0af0ff]/60 text-sm">Model: DHMR-3200</div>
        <CesiumMap />
      </div>
    </div>
  )
}

