
import { SystemIndicator } from "@/types/system";
import { cn } from "@/lib/utils";

interface StatusIndicatorProps extends Partial<SystemIndicator> {
  className?: string;
}

export function StatusIndicator({ id = "", label = "", status = "active", className }: StatusIndicatorProps) {
  return (
    <div
      className={cn(
        "relative bg-[#001a1a] border border-[#0af0ff]/20",
        "before:absolute before:inset-0 before:bg-[#0af0ff]/5",
        "after:absolute after:inset-0 after:bg-gradient-to-b after:from-[#0af0ff]/10 after:to-transparent",
        "shadow-[0_0_15px_rgba(10,240,255,0.1)]",
        "group transition-all duration-300",
        "hover:border-[#0af0ff]/30 hover:shadow-[0_0_20px_rgba(10,240,255,0.2)]",
        className,
      )}
    >
      <div className="relative z-10 p-4 flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="font-mono text-lg text-[#0af0ff]">{id}</h3>
          <p className="font-mono text-sm text-[#0af0ff]/60">{label}</p>
        </div>
        <div
          className={cn(
            "h-2 w-2 rounded-full",
            "transition-all duration-500",
            status === "active" ? "bg-[#0af0ff] animate-pulse" : "bg-[#0af0ff]/30",
          )}
        />
      </div>
    </div>
  );
}
