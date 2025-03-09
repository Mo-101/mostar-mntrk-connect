"use client"

import { useState } from "react";

import { Progress } from "../components/ui/progress";
import { Play, Pause, RotateCcw } from "lucide-react";
import React from "react";

export function TrainingPanel() { 
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  const startTraining = () => {
    setIsTraining(true)
    setProgress(0)
    const interval = setInterval(() => {
      setProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(interval)
          setIsTraining(false)
          return 100
        }
        return prevProgress + 1
      })
    }, 100)
  }

  const pauseTraining = () => {
    setIsTraining(false)
  }

  const resetTraining = () => {
    setIsTraining(false)
    setProgress(0)
  }

  return (
    <div className="glass-panel p-4"> 
      <div className="flex top-2 right-2 flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-[#0af0ff]">AI Model Training</h3>
        <div className="flex space-x-2">
          <button
            onClick={isTraining ? pauseTraining : startTraining}
            className="bg-[#0af0ff] text-[#001a1a] hover:bg-[#0af0ff]/80 px-4 py-2 rounded-md"
          >
            {isTraining ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
            {isTraining ? "Pause" : "Start"} Training
          </button>
          <button onClick={resetTraining} className="bg-[#0af0ff] text-[#001a1a] hover:bg-[#0af0ff]/80 px-4 py-2 rounded-md">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
        </div>
      </div>
      <Progress value={progress} className="w-full h-2 bg-[#0af0ff]/20" indicatorColor="bg-[#0af0ff]" />
      <div className="mt-2 text-right text-sm text-[#0af0ff]">{progress}% Complete</div>
    </div>
  )
};

