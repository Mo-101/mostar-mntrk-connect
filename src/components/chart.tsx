"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"

const data = [
  { time: "00:00", accuracy: 65, loss: 35 },
  { time: "00:05", accuracy: 68, loss: 32 },
  { time: "00:10", accuracy: 75, loss: 28 },
  { time: "00:15", accuracy: 82, loss: 25 },
  { time: "00:20", accuracy: 87, loss: 20 },
  { time: "00:25", accuracy: 90, loss: 18 },
]

export function Chart() {
  return (
    <div className="relative h-full pt-16 pb-20 px-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
          <XAxis dataKey="time" stroke="#0af0ff40" tick={{ fill: "#0af0ff80" }} />
          <YAxis stroke="#0af0ff40" tick={{ fill: "#0af0ff80" }} />
          <Line type="monotone" dataKey="accuracy" stroke="#06f7a1" strokeWidth={2} dot={{ fill: "#06f7a1" }} />
          <Line type="monotone" dataKey="loss" stroke="#0af0ff" strokeWidth={2} dot={{ fill: "#0af0ff" }} />
        </LineChart>
      </ResponsiveContainer>

      {/* Level Indicator */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        <div className="w-8 h-8 rounded border border-[#0af0ff]/20 flex items-center justify-center text-[#0af0ff]">
          R
        </div>
        <div className="w-8 h-8 rounded border border-[#0af0ff]/20 flex items-center justify-center text-[#0af0ff]">
          G
        </div>
        <div className="w-8 h-8 rounded border border-[#0af0ff]/20 flex items-center justify-center text-[#0af0ff]">
          B
        </div>
      </div>
    </div>
  )
}

