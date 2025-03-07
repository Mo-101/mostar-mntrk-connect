import React from "react"

export function PerformanceMetrics() {
  const metrics = [
    { label: "Accuracy", value: "92.5%", trend: "+0.5%" },
    { label: "Loss", value: "0.0234", trend: "-0.002" },
    { label: "F1 Score", value: "0.918", trend: "+0.003" },
    { label: "Precision", value: "0.945", trend: "+0.001" },
  ]

  return (
    <div className="container-panel p-4">
      <h3 className="text-[#0af0ff] font-bold mb-4">Performance Metrics</h3>
      <div className="grid grid-cols-2 gap-4">
        {metrics.map((metric) => (
          <div key={metric.label} className="container-panel p-3">
            <div className="text-sm text-[#0af0ff]/60">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-bold">{metric.value}</span>
              <span className="text-sm text-[#06f7a1]">{metric.trend}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

