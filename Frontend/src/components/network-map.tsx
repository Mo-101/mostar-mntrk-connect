export function NetworkMap() {
  return (
    <div className="container-panel p-4">
      <h3 className="text-[#0af0ff] font-bold mb-4">Network Map</h3>
      <div className="relative h-[200px] bg-[#001a1a]/50 rounded-lg border border-[#0af0ff]/20">
        {/* Network visualization would go here */}
        <div className="absolute bottom-4 left-4">
          <div className="text-sm text-[#0af0ff]/60">Latency</div>
          <div className="text-lg font-mono">83 ms</div>
        </div>
      </div>
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-[#0af0ff]/60">Speed</span>
        <span className="text-sm font-mono">22 MB/s</span>
      </div>
    </div>
  )
}

