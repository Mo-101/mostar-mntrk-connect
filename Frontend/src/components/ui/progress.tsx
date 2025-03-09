
import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"

import { cn } from "@/lib/utils"

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
    indicatorColor?: string;
    style?: React.CSSProperties;
  }
>(({ className, value, indicatorColor, style, ...props }, ref) => {
  // Create a combined style with the indicator color if provided
  const combinedStyle = indicatorColor 
    ? { ...style, "--progress-indicator-color": indicatorColor } as React.CSSProperties
    : style;

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(
        "relative h-2 w-full overflow-hidden rounded-full bg-primary/20",
        className
      )}
      {...props}
    >
      <ProgressPrimitive.Indicator
        className={cn(
          "h-full w-full flex-1 bg-primary transition-all",
          indicatorColor ? undefined : "bg-[var(--progress-indicator-color,theme(colors.primary))]"
        )}
        style={{
          ...combinedStyle,
          transform: `translateX(-${100 - (value || 0)}%)`,
          backgroundColor: indicatorColor || "var(--progress-indicator-color, var(--primary))"
        }}
      />
    </ProgressPrimitive.Root>
  )
})
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
