"use client"

import { useState, useEffect } from "react"
import { Play, Pause, RotateCcw, Settings } from "lucide-react"
import { Button } from "../components/ui/button"
import { Progress } from "../components/ui/progress"
import React from "react"

export function TrainingControls() {
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isTraining) {
      interval = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            setIsTraining(false)
            return 100
          }
          return prevProgress + 1
        })
      }, 100)
    }
    return () => clearInterval(interval)
  }, [isTraining])

  const toggleTraining = () => setIsTraining(!isTraining)

  const resetTraining = () => {
    setIsTraining(false)
    setProgress(0)
  }

  return (
    <div className="container-panel p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <div className="text-sm text-[#0af0ff]">Training Progress</div>
          <div className="text-2xl font-bold">{progress}%</div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-[#0af0ff] hover:bg-[#0af0ff]/10"
            onClick={toggleTraining}
          >
            {isTraining ? <Pause className="h-4 w-4 text-[#0af0ff]" /> : <Play className="h-4 w-4 text-[#0af0ff]" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-[#0af0ff] hover:bg-[#0af0ff]/10"
            onClick={resetTraining}
          >
            <RotateCcw className="h-4 w-4 text-[#0af0ff]" />
          </Button>
          <Button variant="outline" size="icon" className="border-[#0af0ff] hover:bg-[#0af0ff]/10">
            <Settings className="h-4 w-4 text-[#0af0ff]" />
          </Button>
        </div>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}

