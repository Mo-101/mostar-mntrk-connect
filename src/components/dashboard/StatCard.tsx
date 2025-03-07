
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type StatCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  loading?: boolean;
  className?: string;
  status?: "active" | "warning" | "alert" | "inactive";
};

const StatCard = ({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  loading = false,
  className,
  status
}: StatCardProps) => {
  const getStatusClass = () => {
    if (!status) return "";
    return `status-indicator-${status}`;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-industrial-success";
    if (trend === "down") return "text-industrial-alert";
    return "text-gray-500";
  };

  const getTrendIcon = () => {
    if (trend === "up") return "↑";
    if (trend === "down") return "↓";
    return "→";
  };

  if (loading) {
    return (
      <Card className={cn("overflow-hidden", className)}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-20 mb-2" />
          <Skeleton className="h-4 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">
          {status && (
            <span className="mr-2 inline-flex items-center">
              <span className={cn("status-indicator", getStatusClass())} />
            </span>
          )}
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {(description || trend) && (
          <p className="text-xs text-muted-foreground">
            {description}
            {trend && trendValue && (
              <span className={cn("ml-1", getTrendColor())}>
                {getTrendIcon()} {trendValue}
              </span>
            )}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
