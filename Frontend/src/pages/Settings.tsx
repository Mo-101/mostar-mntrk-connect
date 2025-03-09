import { Settings as SettingsIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Settings = () => {
  const handleToggle = (setting: string) => {
    toast.success(`${setting} setting updated`);
  };

  return (
    <div className="container mx-auto p-8 max-w-3xl">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Settings</h1>
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Real-time Updates</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automatic data refresh from weather APIs
                </p>
              </div>
              <Switch onCheckedChange={() => handleToggle("Real-time Updates")} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Debug Mode</Label>
                <p className="text-sm text-muted-foreground">
                  Show detailed API response information
                </p>
              </div>
              <Switch onCheckedChange={() => handleToggle("Debug Mode")} />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Model Settings</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Automatic Training</Label>
                <p className="text-sm text-muted-foreground">
                  Enable automated model training with new data
                </p>
              </div>
              <Switch onCheckedChange={() => handleToggle("Automatic Training")} />
            </div>
            <Separator />
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Performance Metrics</Label>
                <p className="text-sm text-muted-foreground">
                  Collect and analyze model performance data
                </p>
              </div>
              <Switch onCheckedChange={() => handleToggle("Performance Metrics")} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;