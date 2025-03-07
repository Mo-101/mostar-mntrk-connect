import { Book, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

interface TrainingModule {
  title: string;
  progress: number;
  completed: boolean;
  description: string;
}

interface TrainingModulesProps {
  modules: TrainingModule[];
}

export const TrainingModules = ({ modules }: TrainingModulesProps) => {
  const handleStartModule = (moduleTitle: string) => {
    toast.success(`Starting module: ${moduleTitle}`);
  };

  return (
    <div className="space-y-6">
      {modules.map((module, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                {module.completed ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <Book className="h-5 w-5 text-blue-500" />
                )}
                <h3 className="text-xl font-semibold">{module.title}</h3>
              </div>
              <p className="text-muted-foreground">{module.description}</p>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{module.progress}%</span>
                </div>
                <Progress value={module.progress} className="h-2" />
              </div>
            </div>
            <Button
              variant={module.completed ? "outline" : "default"}
              onClick={() => handleStartModule(module.title)}
            >
              {module.completed ? "Review" : "Start"}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};