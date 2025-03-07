import { Progress } from "@/components/ui/progress";
import React from "react";

export function SystemOverview() {
  return (
    <div className="container-panel h-60 top-0 bottom-1 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-[#0af0ff] font-bold">System Overview</h3>
          <div className="text-sm text-[#0af0ff]/60">Status Summary</div>
        </div>

        {/* ✅ System Status Section */}
        <div className="p-2 border border-[#0af0ff]/20 rounded-lg space-y-4">
        
        {/* APP Performance */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">APP Performance</span>
            <span className="text-sm">82%</span>
          </div>
          <Progress value={82} className="h-1" />
        </div>

        {/* API Health */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">API Response</span>
            <span className="text-sm">200ms</span>
          </div>
          <Progress value={90} className="h-1" />
        </div>

        {/* Agent Load */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">Agent Utilization</span>
            <span className="text-sm">60%</span>
          </div>
          <Progress value={60} className="h-1" />
        </div>

        {/* DeepSeek Activity */}
        <div className="space-y-2 top-5 bottom-1">
          <div className="flex justify-between items-center">
            <span className="text-sm text-[#0af0ff]/60">DeepSeek Activity</span>
            <span className="text-sm">73%</span>
          </div>
          <Progress value={73} className="h-1" />
        </div>
      </div>
    </div>
  );
}
