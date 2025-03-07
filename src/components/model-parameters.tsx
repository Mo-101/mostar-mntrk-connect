export function ModelParameters() {
  const parameters = [
    { label: "Learning Rate", value: "0.001" },
    { label: "Batch Size", value: "32" },
    { label: "Epochs", value: "100" },
    { label: "Optimizer", value: "Adam" },
  ]

  return (
    <div className="glass-panel p-4">
      <h3 className="text-[#0af0ff] font-bold mb-4">Model Parameters</h3>
      <div className="space-y-2">
        {parameters.map((param) => (
          <div key={param.label} className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">{param.label}</span>
            <span className="text-sm font-mono">{param.value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

