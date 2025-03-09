import React from "react"
import styles from "./donut-chart.module.css"
import { className } from "cesium"

interface DonutChartProps {
  progress: number
  label: string
  color?: string
}

export function DonutChart({ progress, label, color = "#0af0ff" }: DonutChartProps) {
  const radius = 45
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (progress / 100) * circumference
  const customStyle = {
    "--donut-chart-color": color,
  } as React.CSSProperties;

  return (
    <div className="donut-chart-circle-background">
    <div className="relative w-50 h-50">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle
          className={`stroke-current opacity-10 ${styles['donut-chart-circle']}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="10"
        />
        <circle
          className={`stroke-current ${styles['donut-chart-circle']}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
        />
        <circle
          className={`stroke-current ${styles['donut-chart-circle']}`}
          cx="50"
          cy="50"
          r={radius}
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold ${styles['donut-chart-progress']}`}>
          {progress}%
        </span>
        <span className="text-xs text-white/60">{label}</span>
      </div>
    </div>
    </div>
  )
}
