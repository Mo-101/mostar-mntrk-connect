import { Settings, Check } from "lucide-react"
import React from "react"

export function ProcessingSettings() {
  const resolutions = [
    { id: "1280x720", status: "active" },
    { id: "1920x1080", status: "inactive" },
    { id: "854x480", status: "inactive" },
  ]

  return (
    <div className="bg-[#001a1a] border border-[#0af0ff]/20 rounded-lg p-4 flex flex-col h-full">
      <div className="flex items-center gap-3 mb-4">
        <Settings className="w-5 h-5 text-[#0af0ff]" />
        <h3 className="text-[#0af0ff] font-bold text-lg">Processing Settings</h3>
      </div>

      <div className="space-y-3 flex-grow">
        {resolutions.map((res) => (
          <div key={res.id} className="flex items-center justify-between p-2 border border-[#0af0ff]/20 rounded">
            <span className="font-mono text-sm">{res.id}</span>
            <div className="flex items-center gap-2">
              {res.status === "active" ? (
                <Check className="w-4 h-4 text-[#06f7a1]" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-[#0af0ff]/40" />
              )}
              <span className="text-xs text-[#0af0ff]/60">{res.status === "active" ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

