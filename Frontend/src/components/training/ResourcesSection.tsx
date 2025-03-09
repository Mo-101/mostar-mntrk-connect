import { Info } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ResourceCardProps {
  title: string;
  description: string;
  link: string;
}

const ResourceCard: React.FC<ResourceCardProps> = ({ title, description, link }) => {
  return (
    <div className="p-4 bg-muted rounded-lg">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
      <Button variant="link" className="mt-2 p-0" ref={link}>
        Learn More →
      </Button>
    </div>
  );
};


export const ResourcesSection = () => {
  const resources: ResourceCardProps[] = [
    {
      title: "API Documentation",
      description: "Comprehensive guide to weather API endpoints and usage examples.",
      link: "/api-docs", // Replace with your actual link
    },
    {
      title: "Model Training Guide",
      description: "Step-by-step guide to training and optimizing weather prediction models.",
      link: "/training-guide", // Replace with your actual link
    },
    // Add more resources here as needed
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"> {/* More responsive cols */}
      {resources.map((resource, index) => (
        <Card key={index} className="p-6">
          <div className="flex items-left gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-500" />
            <h3 className="text-xl font-semibold">{resource.title}</h3>
          </div>
          <ResourceCard {...resource} />
        </Card>
      ))}
    </div>
  );
};
