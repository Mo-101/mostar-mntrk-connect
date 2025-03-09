
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, AlertCircle, Info, Settings, Clock } from "lucide-react";

type ActivityItemProps = {
  timestamp: string;
  message: string;
  type: "success" | "error" | "info" | "warning" | "system";
};

const ActivityItem = ({ timestamp, message, type }: ActivityItemProps) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-industrial-success" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-industrial-alert" />;
      case "warning":
        return <AlertCircle className="h-4 w-4 text-industrial-accent" />;
      case "info":
        return <Info className="h-4 w-4 text-primary" />;
      case "system":
        return <Settings className="h-4 w-4 text-muted-foreground" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  return (
    <div className="flex items-start space-x-3 rounded-md p-2 transition-colors hover:bg-muted/50">
      <div className="mt-0.5">{getIcon()}</div>
      <div className="space-y-1">
        <p className="text-sm">{message}</p>
        <div className="flex items-center text-xs text-muted-foreground">
          <Clock className="mr-1 h-3 w-3" />
          {timestamp}
        </div>
      </div>
    </div>
  );
};

const ActivityLog = () => {
  const activities = [
    {
      timestamp: "Today, 10:42 AM",
      message: "Pump Unit 5 operational status restored",
      type: "success" as const,
    },
    {
      timestamp: "Today, 09:15 AM",
      message: "Critical pressure alert on Compressor C2",
      type: "error" as const,
    },
    {
      timestamp: "Today, 08:30 AM",
      message: "Maintenance team dispatched to Sector B",
      type: "info" as const,
    },
    {
      timestamp: "Yesterday, 4:23 PM",
      message: "Temperature warning on Heat Exchanger 2",
      type: "warning" as const,
    },
    {
      timestamp: "Yesterday, 2:15 PM",
      message: "System update completed successfully",
      type: "system" as const,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-1">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            timestamp={activity.timestamp}
            message={activity.message}
            type={activity.type}
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
