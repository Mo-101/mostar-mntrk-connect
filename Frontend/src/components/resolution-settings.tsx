export function ResolutionSettings() {
  const resolutions = [
    { id: "1280x720", status: "active" },
    { id: "1920x1080", status: "inactive" },
    { id: "854x480", status: "inactive" },
    { id: "640x360", status: "inactive" },
  ]

  return (
    <div className="container-panel p-4">
      <h3 className="text-[#0af0ff] font-bold mb-4">Processing Settings</h3>

      <div className="space-y-2">
        {resolutions.map((res) => (
          <div key={res.id} className="flex items-center justify-between p-2 border border-[#0af0ff]/20 rounded">
            <span className="font-mono text-sm">{res.id}</span>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${res.status === "active" ? "bg-[#06f7a1]" : "bg-[#0af0ff]/20"}`} />
              <span className="text-xs text-[#0af0ff]/60">{res.status === "active" ? "Active" : "Inactive"}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

