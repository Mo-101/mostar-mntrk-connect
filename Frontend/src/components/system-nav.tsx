interface SystemNavProps {
  currentTime: Date
}

export function SystemNav({ currentTime }: SystemNavProps) {
  return (
    <div className="glass-panel flex justify-between items-center px-4 py-2 rounded-lg pointer-events-auto">
      <div className="flex gap-6">
        <button className="text-[#0af0ff] hover:text-[#0af0ff]/80">Function Page-2</button>
        <button className="text-[#0af0ff] hover:text-[#0af0ff]/80">Function Page-3</button>
        <button className="text-[#0af0ff] hover:text-[#0af0ff]/80">Function Page-4</button>
      </div>

      <div className="flex items-center gap-6">
        <div className="glass-panel px-4 py-1 rounded">
          <span className="text-[#0af0ff]">Edition Information</span>
          <span className="text-sm text-white/50 ml-2">V0.04 14/08</span>
        </div>

        <div className="glass-panel px-4 py-1 rounded flex items-center gap-2">
          <span>32°</span>
          <span className="text-sm text-white/50">PM 2.0</span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#0af0ff]">
            {currentTime.toLocaleTimeString("en-US", {
              hour12: false,
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        </div>
      </div>
    </div>
  )
}

